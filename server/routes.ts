import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { discordBot } from "./services/discord-bot";
import { z } from "zod";

const configSchema = z.object({
  serverId: z.string(),
  autoMod: z.boolean().optional(),
  spamProtection: z.enum(["low", "medium", "high"]).optional(),
  logChannelId: z.string().optional(),
  raidProtection: z.boolean().optional(),
  welcomeMessage: z.string().optional(),
  autoRoleId: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Bot statistics endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getBotStats();
      const todayThreats = await storage.getTodayThreatsCount();
      
      res.json({
        ...stats,
        threatsBlockedToday: todayThreats,
        isOnline: discordBot.isOnline(),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bot statistics" });
    }
  });

  // Get server configuration
  app.get("/api/server/:serverId", async (req, res) => {
    try {
      const { serverId } = req.params;
      const server = await storage.getDiscordServer(serverId);
      
      if (!server) {
        return res.status(404).json({ message: "Server not found" });
      }
      
      res.json(server);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch server configuration" });
    }
  });

  // Update server configuration
  app.post("/api/server/config", async (req, res) => {
    try {
      const config = configSchema.parse(req.body);
      const { serverId, ...updates } = config;
      
      // Check if server exists
      let server = await storage.getDiscordServer(serverId);
      if (!server) {
        // Create new server configuration
        server = await storage.createDiscordServer({
          serverId,
          serverName: "Unknown Server",
          ownerId: "unknown",
          configData: {
            autoMod: updates.autoMod || false,
            spamProtection: updates.spamProtection || "medium",
            logChannelId: updates.logChannelId,
            raidProtection: updates.raidProtection || false,
            welcomeMessage: updates.welcomeMessage,
            autoRoleId: updates.autoRoleId,
          },
          isActive: true,
        });
      } else {
        // Update existing configuration
        const updatedConfigData = {
          ...server.configData,
          ...updates,
        };
        server = await storage.updateDiscordServer(serverId, {
          configData: updatedConfigData,
        });
      }
      
      res.json(server);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid configuration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update server configuration" });
    }
  });

  // Get moderation logs for a server
  app.get("/api/server/:serverId/logs", async (req, res) => {
    try {
      const { serverId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const logs = await storage.getModerationLogs(serverId, limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch moderation logs" });
    }
  });

  // Get threat detections for a server
  app.get("/api/server/:serverId/threats", async (req, res) => {
    try {
      const { serverId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const threats = await storage.getThreatsByServer(serverId, limit);
      res.json(threats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch threat detections" });
    }
  });

  // Discord OAuth callback (for adding bot to servers)
  app.get("/api/discord/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({ message: "Missing authorization code" });
      }
      
      // In a real implementation, you would exchange the code for an access token
      // and get the guild information to set up the bot
      res.json({ message: "Bot successfully added to server" });
    } catch (error) {
      res.status(500).json({ message: "Failed to process Discord authorization" });
    }
  });

  // Get Discord invite URL
  app.get("/api/discord/invite", (req, res) => {
    const clientId = process.env.DISCORD_CLIENT_ID || "your_client_id";
    const permissions = "8"; // Administrator permissions for full functionality
    const scopes = "bot%20applications.commands";
    
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=${scopes}`;
    
    res.json({ inviteUrl });
  });

  const httpServer = createServer(app);
  return httpServer;
}
