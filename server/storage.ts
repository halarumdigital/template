import {
  users,
  clients,
  teamMembers,
  projects,
  invoices,
  projectAssignments,
  type User,
  type UpsertUser,
  type Client,
  type InsertClient,
  type TeamMember,
  type InsertTeamMember,
  type Project,
  type InsertProject,
  type Invoice,
  type InsertInvoice,
  type ProjectAssignment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sum, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Client operations
  getClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client>;
  deleteClient(id: string): Promise<void>;

  // Team operations
  getTeamMembers(): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<void>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getProjectsByTeamMember(teamMemberId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // Invoice operations
  getInvoices(): Promise<Invoice[]>;
  getInvoicesByClient(clientId: string): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice>;
  deleteInvoice(id: string): Promise<void>;

  // Dashboard stats
  getAdminStats(): Promise<{
    totalClients: number;
    totalRevenue: number;
    activeProjects: number;
    teamMembers: number;
  }>;
  getClientStats(clientId: string): Promise<{
    pendingInvoices: number;
    totalOpen: number;
    nextDue: string | null;
  }>;
  getTeamStats(teamMemberId: string): Promise<{
    activeProjects: number;
    pendingTasks: number;
    completedToday: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Try to find existing user first
    const existingUser = await this.getUser(userData.id);
    
    if (existingUser) {
      // Update existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id))
        .returning();
      return updatedUser;
    } else {
      // Insert new user
      const [newUser] = await db
        .insert(users)
        .values(userData)
        .returning();
      return newUser;
    }
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(client: InsertClient): Promise<Client> {
    const [newClient] = await db.insert(clients).values(client).returning();
    return newClient;
  }

  async updateClient(id: string, client: Partial<InsertClient>): Promise<Client> {
    const [updatedClient] = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return updatedClient;
  }

  async deleteClient(id: string): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Team operations
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(desc(teamMembers.createdAt));
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db.insert(teamMembers).values(member).returning();
    return newMember;
  }

  async updateTeamMember(id: string, member: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [updatedMember] = await db
      .update(teamMembers)
      .set({ ...member, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return updatedMember;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProjectsByTeamMember(teamMemberId: string): Promise<Project[]> {
    return await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        clientId: projects.clientId,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        budget: projects.budget,
        progress: projects.progress,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .innerJoin(projectAssignments, eq(projects.id, projectAssignments.projectId))
      .where(eq(projectAssignments.teamMemberId, teamMemberId))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Invoice operations
  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }

  async getInvoicesByClient(clientId: string): Promise<Invoice[]> {
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.clientId, clientId))
      .orderBy(desc(invoices.createdAt));
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice> {
    const [updatedInvoice] = await db
      .update(invoices)
      .set({ ...invoice, updatedAt: new Date() })
      .where(eq(invoices.id, id))
      .returning();
    return updatedInvoice;
  }

  async deleteInvoice(id: string): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }

  // Dashboard stats
  async getAdminStats(): Promise<{
    totalClients: number;
    totalRevenue: number;
    activeProjects: number;
    teamMembers: number;
  }> {
    const [clientCount] = await db.select({ count: count() }).from(clients);
    const [revenueSum] = await db
      .select({ sum: sum(invoices.amount) })
      .from(invoices)
      .where(eq(invoices.status, "paid"));
    const [projectCount] = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, "active"));
    const [memberCount] = await db.select({ count: count() }).from(teamMembers);

    return {
      totalClients: clientCount.count,
      totalRevenue: Number(revenueSum.sum || 0),
      activeProjects: projectCount.count,
      teamMembers: memberCount.count,
    };
  }

  async getClientStats(clientId: string): Promise<{
    pendingInvoices: number;
    totalOpen: number;
    nextDue: string | null;
  }> {
    const [pendingCount] = await db
      .select({ count: count() })
      .from(invoices)
      .where(and(eq(invoices.clientId, clientId), eq(invoices.status, "sent")));
    
    const [openSum] = await db
      .select({ sum: sum(invoices.amount) })
      .from(invoices)
      .where(and(eq(invoices.clientId, clientId), eq(invoices.status, "sent")));

    const [nextInvoice] = await db
      .select({ dueDate: invoices.dueDate })
      .from(invoices)
      .where(and(eq(invoices.clientId, clientId), eq(invoices.status, "sent")))
      .orderBy(invoices.dueDate)
      .limit(1);

    return {
      pendingInvoices: pendingCount.count,
      totalOpen: Number(openSum.sum || 0),
      nextDue: nextInvoice?.dueDate?.toISOString().split('T')[0] || null,
    };
  }

  async getTeamStats(teamMemberId: string): Promise<{
    activeProjects: number;
    pendingTasks: number;
    completedToday: number;
  }> {
    const [activeCount] = await db
      .select({ count: count() })
      .from(projects)
      .innerJoin(projectAssignments, eq(projects.id, projectAssignments.projectId))
      .where(
        and(
          eq(projectAssignments.teamMemberId, teamMemberId),
          eq(projects.status, "active")
        )
      );

    // For now, using mock values for tasks as we don't have a tasks table
    return {
      activeProjects: activeCount.count,
      pendingTasks: 12, // This would come from a tasks table in a real implementation
      completedToday: 8, // This would come from a tasks table in a real implementation
    };
  }
}

export const storage = new DatabaseStorage();
