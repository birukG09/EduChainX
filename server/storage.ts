import {
  users,
  universities,
  transcripts,
  transactions,
  anomalies,
  auditLogs,
  type User,
  type UpsertUser,
  type University,
  type InsertUniversity,
  type Transcript,
  type InsertTranscript,
  type Transaction,
  type InsertTransaction,
  type Anomaly,
  type InsertAnomaly,
  type AuditLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, or, like, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalTranscripts: number;
    activeUniversities: number;
    totalAnomalies: number;
    systemRiskScore: number;
  }>;
  
  // University operations
  getUniversities(): Promise<University[]>;
  getUniversity(id: string): Promise<University | undefined>;
  createUniversity(university: InsertUniversity): Promise<University>;
  updateUniversity(id: string, updates: Partial<InsertUniversity>): Promise<University>;
  
  // Transcript operations
  getTranscripts(limit?: number): Promise<Transcript[]>;
  getTranscript(id: string): Promise<Transcript | undefined>;
  createTranscript(transcript: InsertTranscript): Promise<Transcript>;
  verifyTranscript(id: string): Promise<Transcript>;
  
  // Transaction operations
  getTransactions(limit?: number): Promise<Transaction[]>;
  getTransactionsByType(type: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Anomaly operations
  getAnomalies(limit?: number): Promise<Anomaly[]>;
  createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly>;
  resolveAnomaly(id: string): Promise<Anomaly>;
  
  // Audit log operations
  createAuditLog(eventType: string, userId: string | null, description: string, metadata?: any): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getDashboardStats() {
    const [transcriptCount] = await db.select({ count: count() }).from(transcripts);
    const [universityCount] = await db.select({ count: count() }).from(universities).where(eq(universities.verified, true));
    const [anomalyCount] = await db.select({ count: count() }).from(anomalies).where(eq(anomalies.resolved, false));
    
    // Calculate system risk score based on recent anomalies
    const recentAnomalies = await db.select().from(anomalies)
      .where(sql`timestamp > NOW() - INTERVAL '7 days'`)
      .limit(100);
    
    const riskScore = recentAnomalies.length > 0 
      ? Math.min(10, recentAnomalies.reduce((sum, a) => sum + parseFloat(a.riskScore || '0'), 0) / recentAnomalies.length)
      : 0;

    return {
      totalTranscripts: transcriptCount.count,
      activeUniversities: universityCount.count,
      totalAnomalies: anomalyCount.count,
      systemRiskScore: Math.round(riskScore * 10) / 10,
    };
  }

  async getUniversities(): Promise<University[]> {
    return db.select().from(universities).orderBy(desc(universities.createdAt));
  }

  async getUniversity(id: string): Promise<University | undefined> {
    const [university] = await db.select().from(universities).where(eq(universities.id, id));
    return university;
  }

  async createUniversity(university: InsertUniversity): Promise<University> {
    const [created] = await db.insert(universities).values(university).returning();
    return created;
  }

  async updateUniversity(id: string, updates: Partial<InsertUniversity>): Promise<University> {
    const [updated] = await db
      .update(universities)
      .set(updates)
      .where(eq(universities.id, id))
      .returning();
    return updated;
  }

  async getTranscripts(limit = 50): Promise<Transcript[]> {
    return db.select().from(transcripts)
      .orderBy(desc(transcripts.createdAt))
      .limit(limit);
  }

  async getTranscript(id: string): Promise<Transcript | undefined> {
    const [transcript] = await db.select().from(transcripts).where(eq(transcripts.id, id));
    return transcript;
  }

  async createTranscript(transcript: InsertTranscript): Promise<Transcript> {
    const [created] = await db.insert(transcripts).values(transcript).returning();
    return created;
  }

  async verifyTranscript(id: string): Promise<Transcript> {
    const [verified] = await db
      .update(transcripts)
      .set({ verified: true })
      .where(eq(transcripts.id, id))
      .returning();
    return verified;
  }

  async getTransactions(limit = 50): Promise<Transaction[]> {
    return db.select().from(transactions)
      .orderBy(desc(transactions.timestamp))
      .limit(limit);
  }

  async getTransactionsByType(type: string): Promise<Transaction[]> {
    return db.select().from(transactions)
      .where(eq(transactions.type, type))
      .orderBy(desc(transactions.timestamp));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [created] = await db.insert(transactions).values(transaction).returning();
    return created;
  }

  async getAnomalies(limit = 50): Promise<Anomaly[]> {
    return db.select().from(anomalies)
      .orderBy(desc(anomalies.timestamp))
      .limit(limit);
  }

  async createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly> {
    const [created] = await db.insert(anomalies).values(anomaly).returning();
    return created;
  }

  async resolveAnomaly(id: string): Promise<Anomaly> {
    const [resolved] = await db
      .update(anomalies)
      .set({ resolved: true })
      .where(eq(anomalies.id, id))
      .returning();
    return resolved;
  }

  async createAuditLog(eventType: string, userId: string | null, description: string, metadata?: any): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values({
      eventType,
      userId,
      description,
      metadata,
    }).returning();
    return log;
  }

  async getAuditLogs(limit = 100): Promise<AuditLog[]> {
    return db.select().from(auditLogs)
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
