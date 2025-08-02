import { sql } from 'drizzle-orm';
import {
  index,
  json,
  mysqlTable,
  timestamp,
  varchar,
  text,
  decimal,
  boolean,
  int,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 128 }).primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  role: varchar("role", { length: 10 }).notNull().default("client"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

// Clients table
export const clients = mysqlTable("clients", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  companyName: varchar("company_name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zip_code", { length: 10 }),
  taxId: varchar("tax_id", { length: 50 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

// Team members table
export const teamMembers = mysqlTable("team_members", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  position: varchar("position", { length: 100 }),
  department: varchar("department", { length: 100 }),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  hireDate: timestamp("hire_date"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

// Projects table
export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  clientId: varchar("client_id", { length: 36 }).references(() => clients.id),
  status: varchar("status", { length: 15 }).notNull().default("planning"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: decimal("budget", { precision: 10, scale: 2 }),
  progress: int("progress").default(0),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

// Project assignments table
export const projectAssignments = mysqlTable("project_assignments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  projectId: varchar("project_id", { length: 36 }).references(() => projects.id),
  teamMemberId: varchar("team_member_id", { length: 36 }).references(() => teamMembers.id),
  role: varchar("role", { length: 100 }),
  assignedAt: timestamp("assigned_at").default(sql`CURRENT_TIMESTAMP`),
});

// Invoices table
export const invoices = mysqlTable("invoices", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(uuid())`),
  number: varchar("number", { length: 50 }).unique().notNull(),
  clientId: varchar("client_id", { length: 36 }).references(() => clients.id),
  projectId: varchar("project_id", { length: 36 }).references(() => projects.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 15 }).notNull().default("draft"),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  client: one(clients, { fields: [users.id], references: [clients.userId] }),
  teamMember: one(teamMembers, { fields: [users.id], references: [teamMembers.userId] }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  invoices: many(invoices),
  projects: many(projects),
}));

export const teamMembersRelations = relations(teamMembers, ({ one, many }) => ({
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
  assignments: many(projectAssignments),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, { fields: [projects.clientId], references: [clients.id] }),
  assignments: many(projectAssignments),
  invoices: many(invoices),
}));

export const projectAssignmentsRelations = relations(projectAssignments, ({ one }) => ({
  project: one(projects, { fields: [projectAssignments.projectId], references: [projects.id] }),
  teamMember: one(teamMembers, { fields: [projectAssignments.teamMemberId], references: [teamMembers.id] }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
  project: one(projects, { fields: [invoices.projectId], references: [projects.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type ProjectAssignment = typeof projectAssignments.$inferSelect;
