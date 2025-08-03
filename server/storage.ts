import {
  users,
  clients,
  teamMembers,
  projects,
  invoices,
  projectAssignments,
  systemSettings,
  userRoles,
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
  type SystemSetting,
  type InsertSystemSetting,
  type UserRole,
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

  // System settings operations
  getSystemSettings(): Promise<Record<string, any>>;
  getSystemSetting(key: string): Promise<SystemSetting | undefined>;
  setSystemSetting(key: string, value: string, type?: string): Promise<SystemSetting>;
  deleteSystemSetting(key: string): Promise<void>;

  // Team member with user creation
  createTeamMemberWithUser(data: any): Promise<TeamMember>;

  // Roles operations
  getRoles(): Promise<UserRole[]>;
  getRole(id: string): Promise<UserRole | undefined>;
  createRole(data: any): Promise<UserRole>;
  updateRole(id: string, data: any): Promise<UserRole>;
  deleteRole(id: string): Promise<void>;
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

  // System settings operations
  async getSystemSettings(): Promise<Record<string, any>> {
    const settings = await db.select().from(systemSettings);
    const result: Record<string, any> = {};
    
    settings.forEach(setting => {
      let value = setting.settingValue;
      
      // Parse value based on type
      switch (setting.settingType) {
        case 'boolean':
          value = value === 'true';
          break;
        case 'number':
          value = parseFloat(value || '0');
          break;
        case 'json':
          try {
            value = JSON.parse(value || '{}');
          } catch {
            value = {};
          }
          break;
        default:
          // Keep as string
          break;
      }
      
      // Store all settings with original keys first
      result[setting.settingKey] = value;
      
      // Map database keys to frontend expected keys (only if not already set by a more recent key)
      switch (setting.settingKey) {
        case 'system_name':
          if (!result['systemName']) result['systemName'] = value;
          break;
        case 'system_title':
          if (!result['systemTitle']) result['systemTitle'] = value;
          break;
        case 'primary_color':
          if (!result['systemColor']) result['systemColor'] = value;
          break;
        case 'system_logo':
          // Only use system_logo if logo doesn't exist (prioritize newer 'logo' key)
          if (!result['logo']) result['logo'] = value;
          break;
        case 'system_favicon':
          // Only use system_favicon if favicon doesn't exist (prioritize newer 'favicon' key)
          if (!result['favicon']) result['favicon'] = value;
          break;
        case 'footer_name':
          if (!result['systemSubtitle']) result['systemSubtitle'] = value;
          break;
        default:
          // Keep original key
          break;
      }
    });
    
    return result;
  }

  async getSystemSetting(key: string): Promise<SystemSetting | undefined> {
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.settingKey, key));
    return setting;
  }

  async setSystemSetting(
    key: string, 
    value: string, 
    type: string = 'string'
  ): Promise<SystemSetting> {
    const existingSetting = await this.getSystemSetting(key);
    
    if (existingSetting) {
      // Update existing setting
      await db
        .update(systemSettings)
        .set({
          settingValue: value,
          settingType: type,
          updatedAt: new Date(),
        })
        .where(eq(systemSettings.settingKey, key));
      
      // Return the updated setting
      const updatedSetting = await this.getSystemSetting(key);
      return updatedSetting!;
    } else {
      // Insert new setting
      await db
        .insert(systemSettings)
        .values({
          settingKey: key,
          settingValue: value,
          settingType: type,
        });
      
      // Return the newly created setting
      const newSetting = await this.getSystemSetting(key);
      return newSetting!;
    }
  }

  async deleteSystemSetting(key: string): Promise<void> {
    await db.delete(systemSettings).where(eq(systemSettings.settingKey, key));
  }

  // Team member with user creation
  async createTeamMemberWithUser(data: any): Promise<TeamMember> {
    const bcrypt = await import('bcrypt');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Create the user first
    const [newUser] = await db
      .insert(users)
      .values({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        password: hashedPassword,
        role: data.role,
        active: true,
      })
      .returning();

    // Create the team member linked to the user
    const [newTeamMember] = await db
      .insert(teamMembers)
      .values({
        userId: newUser.id,
        position: data.position,
        department: data.department,
        salary: data.salary ? data.salary.toString() : null,
        hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      })
      .returning();

    return newTeamMember;
  }

  // Roles operations
  async getRoles(): Promise<UserRole[]> {
    const roles = await db.select().from(userRoles).orderBy(desc(userRoles.createdAt));
    
    // Parse permissions JSON for each role
    return roles.map(role => ({
      ...role,
      permissions: typeof role.permissions === 'string' 
        ? JSON.parse(role.permissions) 
        : role.permissions || []
    }));
  }

  async getRole(id: string): Promise<UserRole | undefined> {
    const [role] = await db.select().from(userRoles).where(eq(userRoles.id, id));
    return role;
  }

  async createRole(data: any): Promise<UserRole> {
    const [newRole] = await db
      .insert(userRoles)
      .values({
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        permissions: JSON.stringify(data.permissions || []),
        isSystem: false,
        active: data.active,
      })
      .returning();
    return newRole;
  }

  async updateRole(id: string, data: any): Promise<UserRole> {
    const [updatedRole] = await db
      .update(userRoles)
      .set({
        name: data.name,
        displayName: data.displayName,
        description: data.description,
        permissions: JSON.stringify(data.permissions || []),
        active: data.active,
        updatedAt: new Date(),
      })
      .where(eq(userRoles.id, id))
      .returning();
    return updatedRole;
  }

  async deleteRole(id: string): Promise<void> {
    // Check if role is system role
    const role = await this.getRole(id);
    if (role?.isSystem) {
      throw new Error("Cannot delete system role");
    }
    
    await db.delete(userRoles).where(eq(userRoles.id, id));
  }
}

export const storage = new DatabaseStorage();
