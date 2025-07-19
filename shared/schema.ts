import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const discordServers = pgTable("discord_servers", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull().unique(),
  serverName: text("server_name").notNull(),
  ownerId: text("owner_id").notNull(),
  configData: json("config_data").$type<{
    autoMod: boolean;
    spamProtection: "low" | "medium" | "high";
    logChannelId?: string;
    raidProtection: boolean;
    welcomeMessage?: string;
    autoRoleId?: string;
  }>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moderationLogs = pgTable("moderation_logs", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull(),
  userId: text("user_id").notNull(),
  moderatorId: text("moderator_id"),
  action: text("action").notNull(), // ban, kick, mute, warn, etc.
  reason: text("reason"),
  duration: integer("duration"), // in minutes for temporary actions
  timestamp: timestamp("timestamp").defaultNow(),
});

export const threatDetections = pgTable("threat_detections", {
  id: serial("id").primaryKey(),
  serverId: text("server_id").notNull(),
  userId: text("user_id").notNull(),
  threatType: text("threat_type").notNull(), // spam, malicious_link, raid, etc.
  content: text("content"),
  severity: text("severity").notNull(), // low, medium, high, critical
  isBlocked: boolean("is_blocked").default(true),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const botStats = pgTable("bot_stats", {
  id: serial("id").primaryKey(),
  date: timestamp("date").defaultNow(),
  totalServers: integer("total_servers").default(0),
  totalUsers: integer("total_users").default(0),
  threatsBlocked: integer("threats_blocked").default(0),
  actionsPerformed: integer("actions_performed").default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDiscordServerSchema = createInsertSchema(discordServers).omit({
  id: true,
  createdAt: true,
});

export const insertModerationLogSchema = createInsertSchema(moderationLogs).omit({
  id: true,
  timestamp: true,
});

export const insertThreatDetectionSchema = createInsertSchema(threatDetections).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DiscordServer = typeof discordServers.$inferSelect;
export type InsertDiscordServer = z.infer<typeof insertDiscordServerSchema>;
export type ModerationLog = typeof moderationLogs.$inferSelect;
export type InsertModerationLog = z.infer<typeof insertModerationLogSchema>;
export type ThreatDetection = typeof threatDetections.$inferSelect;
export type InsertThreatDetection = z.infer<typeof insertThreatDetectionSchema>;
export type BotStats = typeof botStats.$inferSelect;
