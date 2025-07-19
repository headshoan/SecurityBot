import { 
  users, 
  discordServers, 
  moderationLogs, 
  threatDetections, 
  botStats,
  type User, 
  type InsertUser,
  type DiscordServer,
  type InsertDiscordServer,
  type ModerationLog,
  type InsertModerationLog,
  type ThreatDetection,
  type InsertThreatDetection,
  type BotStats
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Discord server management
  getDiscordServer(serverId: string): Promise<DiscordServer | undefined>;
  createDiscordServer(server: InsertDiscordServer): Promise<DiscordServer>;
  updateDiscordServer(serverId: string, updates: Partial<InsertDiscordServer>): Promise<DiscordServer | undefined>;
  getAllActiveServers(): Promise<DiscordServer[]>;

  // Moderation logs
  createModerationLog(log: InsertModerationLog): Promise<ModerationLog>;
  getModerationLogs(serverId: string, limit?: number): Promise<ModerationLog[]>;

  // Threat detection
  createThreatDetection(threat: InsertThreatDetection): Promise<ThreatDetection>;
  getThreatsByServer(serverId: string, limit?: number): Promise<ThreatDetection[]>;
  getTodayThreatsCount(): Promise<number>;

  // Bot statistics
  getBotStats(): Promise<BotStats | undefined>;
  updateBotStats(stats: Partial<BotStats>): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private discordServers: Map<string, DiscordServer>;
  private moderationLogs: Map<number, ModerationLog>;
  private threatDetections: Map<number, ThreatDetection>;
  private botStats: BotStats;
  private currentUserId: number;
  private currentLogId: number;
  private currentThreatId: number;

  constructor() {
    this.users = new Map();
    this.discordServers = new Map();
    this.moderationLogs = new Map();
    this.threatDetections = new Map();
    this.currentUserId = 1;
    this.currentLogId = 1;
    this.currentThreatId = 1;
    
    // Initialize bot stats
    this.botStats = {
      id: 1,
      date: new Date(),
      totalServers: 0,
      totalUsers: 0,
      threatsBlocked: 0,
      actionsPerformed: 0,
    };
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDiscordServer(serverId: string): Promise<DiscordServer | undefined> {
    return this.discordServers.get(serverId);
  }

  async createDiscordServer(server: InsertDiscordServer): Promise<DiscordServer> {
    const id = Math.floor(Math.random() * 1000000);
    const newServer: DiscordServer = {
      ...server,
      id,
      createdAt: new Date(),
    };
    this.discordServers.set(server.serverId, newServer);
    this.botStats.totalServers = this.discordServers.size;
    return newServer;
  }

  async updateDiscordServer(serverId: string, updates: Partial<InsertDiscordServer>): Promise<DiscordServer | undefined> {
    const existing = this.discordServers.get(serverId);
    if (!existing) return undefined;

    const updated: DiscordServer = { ...existing, ...updates };
    this.discordServers.set(serverId, updated);
    return updated;
  }

  async getAllActiveServers(): Promise<DiscordServer[]> {
    return Array.from(this.discordServers.values()).filter(server => server.isActive);
  }

  async createModerationLog(log: InsertModerationLog): Promise<ModerationLog> {
    const id = this.currentLogId++;
    const newLog: ModerationLog = {
      ...log,
      id,
      timestamp: new Date(),
    };
    this.moderationLogs.set(id, newLog);
    this.botStats.actionsPerformed++;
    return newLog;
  }

  async getModerationLogs(serverId: string, limit = 50): Promise<ModerationLog[]> {
    return Array.from(this.moderationLogs.values())
      .filter(log => log.serverId === serverId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createThreatDetection(threat: InsertThreatDetection): Promise<ThreatDetection> {
    const id = this.currentThreatId++;
    const newThreat: ThreatDetection = {
      ...threat,
      id,
      timestamp: new Date(),
    };
    this.threatDetections.set(id, newThreat);
    if (threat.isBlocked) {
      this.botStats.threatsBlocked++;
    }
    return newThreat;
  }

  async getThreatsByServer(serverId: string, limit = 50): Promise<ThreatDetection[]> {
    return Array.from(this.threatDetections.values())
      .filter(threat => threat.serverId === serverId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getTodayThreatsCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.threatDetections.values())
      .filter(threat => threat.timestamp >= today && threat.isBlocked)
      .length;
  }

  async getBotStats(): Promise<BotStats | undefined> {
    return this.botStats;
  }

  async updateBotStats(stats: Partial<BotStats>): Promise<void> {
    this.botStats = { ...this.botStats, ...stats, date: new Date() };
  }
}

export const storage = new MemStorage();
