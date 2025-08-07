import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default('student'), // SuperAdmin, University Admin, Financial Auditor, Student
  universityId: varchar("university_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const universities = pgTable("universities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  verified: boolean("verified").default(false),
  walletAddress: text("wallet_address"),
  contactEmail: varchar("contact_email"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transcripts = pgTable("transcripts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull(),
  universityId: varchar("university_id").notNull(),
  studentName: text("student_name").notNull(),
  degree: text("degree").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  ipfsHash: text("ipfs_hash"),
  verified: boolean("verified").default(false),
  blockTxn: text("block_txn"),
  qrCode: text("qr_code"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // tuition, grants, fees, services
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default('USD'),
  universityId: varchar("university_id"),
  studentId: varchar("student_id"),
  description: text("description"),
  status: varchar("status").default('completed'), // pending, completed, failed
  riskScore: decimal("risk_score", { precision: 3, scale: 2 }).default('0.00'),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const anomalies = pgTable("anomalies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").notNull(),
  riskScore: decimal("risk_score", { precision: 3, scale: 2 }).notNull(),
  description: text("description").notNull(),
  severity: varchar("severity").notNull(), // low, medium, high
  resolved: boolean("resolved").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: varchar("event_type").notNull(),
  userId: varchar("user_id"),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  university: one(universities, {
    fields: [users.universityId],
    references: [universities.id],
  }),
  transcripts: many(transcripts),
  transactions: many(transactions),
}));

export const universitiesRelations = relations(universities, ({ many }) => ({
  users: many(users),
  transcripts: many(transcripts),
  transactions: many(transactions),
}));

export const transcriptsRelations = relations(transcripts, ({ one }) => ({
  university: one(universities, {
    fields: [transcripts.universityId],
    references: [universities.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  university: one(universities, {
    fields: [transactions.universityId],
    references: [universities.id],
  }),
  anomalies: many(anomalies),
}));

export const anomaliesRelations = relations(anomalies, ({ one }) => ({
  transaction: one(transactions, {
    fields: [anomalies.transactionId],
    references: [transactions.id],
  }),
}));

// Zod schemas
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertUniversitySchema = createInsertSchema(universities).omit({
  id: true,
  createdAt: true,
});

export const insertTranscriptSchema = createInsertSchema(transcripts).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

export const insertAnomalySchema = createInsertSchema(anomalies).omit({
  id: true,
  timestamp: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type University = typeof universities.$inferSelect;
export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type Transcript = typeof transcripts.$inferSelect;
export type InsertTranscript = z.infer<typeof insertTranscriptSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Anomaly = typeof anomalies.$inferSelect;
export type InsertAnomaly = z.infer<typeof insertAnomalySchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
