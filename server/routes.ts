import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUniversitySchema, insertTranscriptSchema, insertTransactionSchema, insertAnomalySchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { contractManager, AcademicCredentialContract, EthereumSmartContractService } from "./blockchain/solidity";
import { academicBlockchain, rustCrypto, performanceMonitor } from "./blockchain/rust";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard API
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Universities API
  app.get('/api/universities', isAuthenticated, async (req, res) => {
    try {
      const universities = await storage.getUniversities();
      res.json(universities);
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Failed to fetch universities" });
    }
  });

  app.post('/api/universities', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertUniversitySchema.parse(req.body);
      const university = await storage.createUniversity(validatedData);
      
      // Create audit log
      await storage.createAuditLog(
        'university_created',
        req.user.claims.sub,
        `University "${university.name}" was created`,
        { universityId: university.id }
      );
      
      res.json(university);
    } catch (error) {
      console.error("Error creating university:", error);
      res.status(400).json({ message: "Failed to create university" });
    }
  });

  app.patch('/api/universities/:id/verify', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const university = await storage.updateUniversity(id, { verified: true });
      
      await storage.createAuditLog(
        'university_verified',
        req.user.claims.sub,
        `University "${university.name}" was verified`,
        { universityId: id }
      );
      
      res.json(university);
    } catch (error) {
      console.error("Error verifying university:", error);
      res.status(400).json({ message: "Failed to verify university" });
    }
  });

  // Transcripts API
  app.get('/api/transcripts', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const transcripts = await storage.getTranscripts(limit);
      res.json(transcripts);
    } catch (error) {
      console.error("Error fetching transcripts:", error);
      res.status(500).json({ message: "Failed to fetch transcripts" });
    }
  });

  app.post('/api/transcripts', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertTranscriptSchema.parse({
        ...req.body,
        qrCode: randomUUID(), // Generate QR code data
        ipfsHash: `Qm${randomUUID().replace(/-/g, '')}`, // Mock IPFS hash
        blockTxn: `0x${randomUUID().replace(/-/g, '')}`, // Mock blockchain transaction
      });
      
      const transcript = await storage.createTranscript(validatedData);
      
      await storage.createAuditLog(
        'transcript_issued',
        req.user.claims.sub,
        `Transcript issued for ${transcript.studentName}`,
        { transcriptId: transcript.id }
      );
      
      res.json(transcript);
    } catch (error) {
      console.error("Error creating transcript:", error);
      res.status(400).json({ message: "Failed to create transcript" });
    }
  });

  app.post('/api/transcripts/:id/verify', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const transcript = await storage.verifyTranscript(id);
      
      await storage.createAuditLog(
        'transcript_verified',
        req.user.claims.sub,
        `Transcript verified for ${transcript.studentName}`,
        { transcriptId: id }
      );
      
      res.json(transcript);
    } catch (error) {
      console.error("Error verifying transcript:", error);
      res.status(400).json({ message: "Failed to verify transcript" });
    }
  });

  // Mock transcript verification by hash/QR
  app.post('/api/transcripts/verify', async (req, res) => {
    try {
      const { hash } = req.body;
      
      if (!hash) {
        return res.status(400).json({ message: "Hash or QR code required" });
      }

      // Mock verification - in reality this would check blockchain
      const mockTranscript = {
        verified: true,
        student: "John Smith",
        university: "MIT",
        degree: "B.S. Computer Science",
        issueDate: "May 2023",
        transactionHash: hash,
      };
      
      res.json(mockTranscript);
    } catch (error) {
      console.error("Error verifying transcript:", error);
      res.status(400).json({ message: "Failed to verify transcript" });
    }
  });

  // Transactions API
  app.get('/api/transactions', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await storage.getTransactions(limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      
      // Check for anomalies (simple risk scoring)
      const riskScore = parseFloat(validatedData.amount || '0') > 10000 ? 8.5 : 
                       validatedData.type === 'grants' ? 6.0 : 2.0;
      
      if (riskScore > 7.0) {
        await storage.createAnomaly({
          transactionId: transaction.id,
          riskScore: riskScore.toString(),
          description: `High-risk ${validatedData.type} transaction detected`,
          severity: riskScore > 8.0 ? 'high' : 'medium',
        });
      }
      
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(400).json({ message: "Failed to create transaction" });
    }
  });

  // Anomalies API
  app.get('/api/anomalies', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const anomalies = await storage.getAnomalies(limit);
      res.json(anomalies);
    } catch (error) {
      console.error("Error fetching anomalies:", error);
      res.status(500).json({ message: "Failed to fetch anomalies" });
    }
  });

  app.post('/api/anomalies/:id/resolve', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const anomaly = await storage.resolveAnomaly(id);
      
      await storage.createAuditLog(
        'anomaly_resolved',
        req.user.claims.sub,
        `Anomaly resolved: ${anomaly.description}`,
        { anomalyId: id }
      );
      
      res.json(anomaly);
    } catch (error) {
      console.error("Error resolving anomaly:", error);
      res.status(400).json({ message: "Failed to resolve anomaly" });
    }
  });

  // Audit logs API
  app.get('/api/audit-logs', isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getAuditLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Mock blockchain operations
  app.post('/api/blockchain/register-student', isAuthenticated, async (req: any, res) => {
    try {
      const { studentAddress, hash } = req.body;
      
      // Mock blockchain transaction
      const mockTx = {
        transactionHash: `0x${randomUUID().replace(/-/g, '')}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        gasUsed: Math.floor(Math.random() * 100000) + 21000,
        status: 'success'
      };
      
      await storage.createAuditLog(
        'blockchain_register_student',
        req.user.claims.sub,
        `Student registered on blockchain: ${studentAddress}`,
        mockTx
      );
      
      res.json(mockTx);
    } catch (error) {
      console.error("Error registering student:", error);
      res.status(500).json({ message: "Failed to register student" });
    }
  });

  app.post('/api/blockchain/issue-transcript', isAuthenticated, async (req: any, res) => {
    try {
      const { studentAddress, transcriptHash } = req.body;
      
      const mockTx = {
        transactionHash: `0x${randomUUID().replace(/-/g, '')}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        gasUsed: Math.floor(Math.random() * 150000) + 50000,
        status: 'success'
      };
      
      await storage.createAuditLog(
        'blockchain_issue_transcript',
        req.user.claims.sub,
        `Transcript issued on blockchain for: ${studentAddress}`,
        mockTx
      );
      
      res.json(mockTx);
    } catch (error) {
      console.error("Error issuing transcript:", error);
      res.status(500).json({ message: "Failed to issue transcript" });
    }
  });

  // Blockchain and Smart Contract Routes
  app.get('/api/blockchain/status', isAuthenticated, async (req, res) => {
    try {
      const networkStatus = await contractManager.getNetworkStatus();
      const performanceMetrics = performanceMonitor.getMetricsSummary();
      
      res.json({
        network: networkStatus,
        performance: performanceMetrics,
        contracts: {
          academicVerification: '0x742d35Cc6634C0532925a3b8d5C9D6A4B34C72e3',
          status: 'deployed'
        }
      });
    } catch (error) {
      console.error("Error fetching blockchain status:", error);
      res.status(500).json({ message: "Failed to fetch blockchain status" });
    }
  });

  app.post('/api/blockchain/verify-transcript', isAuthenticated, async (req: any, res) => {
    try {
      const { transcriptId, studentId, transcriptHash } = req.body;
      
      // Generate proof using Rust backend
      const proof = await academicBlockchain.createTranscriptProof({
        transcriptId,
        studentId,
        transcriptHash,
        timestamp: Date.now()
      });
      
      // Verify using Solidity contract
      const contractService = contractManager.getContract('academic-verification');
      if (!contractService) {
        throw new Error('Academic verification contract not available');
      }
      
      const academicContract = new AcademicCredentialContract(contractService);
      const isValid = await academicContract.verifyTranscript(studentId, transcriptHash);
      
      // Create audit log
      await storage.createAuditLog(
        'transcript_verified',
        req.user.claims.sub,
        `Transcript verification for student ${studentId}`,
        { transcriptId, proof, isValid }
      );
      
      res.json({
        verified: isValid,
        proof: proof.proof,
        merkleRoot: proof.merkleRoot,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
      });
    } catch (error) {
      console.error("Error verifying transcript:", error);
      res.status(500).json({ message: "Failed to verify transcript" });
    }
  });

  app.post('/api/blockchain/deploy-contract', isAuthenticated, async (req: any, res) => {
    try {
      const contractAddress = await contractManager.deployAcademicVerificationContract();
      
      await storage.createAuditLog(
        'contract_deployed',
        req.user.claims.sub,
        'New academic verification contract deployed',
        { contractAddress }
      );
      
      res.json({
        contractAddress,
        network: 'ethereum',
        status: 'deployed'
      });
    } catch (error) {
      console.error("Error deploying contract:", error);
      res.status(500).json({ message: "Failed to deploy smart contract" });
    }
  });

  // Financial Forensics Routes
  app.get('/api/anomalies', isAuthenticated, async (req, res) => {
    try {
      const anomalies = await storage.getAnomalies();
      res.json(anomalies);
    } catch (error) {
      console.error("Error fetching anomalies:", error);
      res.status(500).json({ message: "Failed to fetch anomalies" });
    }
  });

  app.patch('/api/anomalies/:id/resolve', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const anomaly = await storage.resolveAnomaly(id);
      
      await storage.createAuditLog(
        'anomaly_resolved',
        req.user.claims.sub,
        `Anomaly ${id} resolved`,
        { anomalyId: id }
      );
      
      res.json(anomaly);
    } catch (error) {
      console.error("Error resolving anomaly:", error);
      res.status(500).json({ message: "Failed to resolve anomaly" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
