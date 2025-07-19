import { Client, GatewayIntentBits, SlashCommandBuilder, Events, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { storage } from "../storage";

class DiscordSecurityBot {
  private client: Client;
  private isReady: boolean = false;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
      ],
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.once(Events.ClientReady, async () => {
      console.log(`✅ SecureBot is online as ${this.client.user?.tag}`);
      this.isReady = true;
      this.client.user?.setActivity("🛡️ Protecting servers", { type: 3 });
      
      // Setup commands after client is ready
      await this.setupCommands();
    });

    this.client.on(Events.GuildCreate, async (guild) => {
      console.log(`📥 Added to new guild: ${guild.name} (${guild.id})`);
      
      // Create server configuration in database
      await storage.createDiscordServer({
        serverId: guild.id,
        serverName: guild.name,
        ownerId: guild.ownerId,
        configData: {
          autoMod: true,
          spamProtection: "medium",
          raidProtection: true,
        },
        isActive: true,
      });

      // Send welcome message to system channel
      const systemChannel = guild.systemChannel;
      if (systemChannel) {
        const welcomeEmbed = new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle("🛡️ SecureBot is now protecting your server!")
          .setDescription("Thank you for adding SecureBot to your server. Use `/setup` to configure security settings.")
          .addFields(
            { name: "Quick Start", value: "Use `/setup auto-mod enable` to enable automatic moderation" },
            { name: "Documentation", value: "Visit our website for comprehensive setup guides" },
            { name: "Support", value: "Join our support server if you need help" }
          )
          .setTimestamp();

        systemChannel.send({ embeds: [welcomeEmbed] });
      }
    });

    this.client.on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;

      const server = await storage.getDiscordServer(message.guild?.id || "");
      if (!server?.configData?.autoMod) return;

      // Spam detection
      const isSpam = await this.detectSpam(message);
      if (isSpam) {
        await this.handleThreat(message, "spam", server.configData.spamProtection || "medium");
      }

      // Malicious link detection
      const hasMaliciousLink = this.detectMaliciousLinks(message.content);
      if (hasMaliciousLink) {
        await this.handleThreat(message, "malicious_link", "high");
      }
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const { commandName } = interaction;

      try {
        switch (commandName) {
          case "setup":
            await this.handleSetupCommand(interaction);
            break;
          case "ban":
            await this.handleBanCommand(interaction);
            break;
          case "kick":
            await this.handleKickCommand(interaction);
            break;
          case "mute":
            await this.handleMuteCommand(interaction);
            break;
          case "security":
            await this.handleSecurityCommand(interaction);
            break;
          case "dashboard":
            await this.handleDashboardCommand(interaction);
            break;
          default:
            await interaction.reply({ content: "Unknown command!", ephemeral: true });
        }
      } catch (error) {
        console.error("Command error:", error);
        await interaction.reply({ content: "An error occurred while executing the command.", ephemeral: true });
      }
    });
  }

  private async setupCommands() {
    // Only setup commands if we have the required tokens
    const clientId = process.env.DISCORD_CLIENT_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    
    if (!clientId || !botToken) {
      console.log("⚠️ Discord credentials not found, skipping command setup");
      return;
    }

    const commands = [
      new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Configure bot settings")
        .addStringOption(option =>
          option.setName("setting")
            .setDescription("Setting to configure")
            .setRequired(true)
            .addChoices(
              { name: "Auto Moderation", value: "auto-mod" },
              { name: "Spam Protection", value: "spam-protection" },
              { name: "Raid Protection", value: "raid-protection" },
              { name: "Log Channel", value: "log-channel" }
            ))
        .addStringOption(option =>
          option.setName("value")
            .setDescription("Value for the setting")
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

      new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the server")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("User to ban")
            .setRequired(true))
        .addStringOption(option =>
          option.setName("reason")
            .setDescription("Reason for the ban")
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

      new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user from the server")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("User to kick")
            .setRequired(true))
        .addStringOption(option =>
          option.setName("reason")
            .setDescription("Reason for the kick")
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

      new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a user")
        .addUserOption(option =>
          option.setName("user")
            .setDescription("User to mute")
            .setRequired(true))
        .addIntegerOption(option =>
          option.setName("duration")
            .setDescription("Duration in minutes")
            .setRequired(false))
        .addStringOption(option =>
          option.setName("reason")
            .setDescription("Reason for the mute")
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

      new SlashCommandBuilder()
        .setName("security")
        .setDescription("Check security status")
        .addStringOption(option =>
          option.setName("action")
            .setDescription("Security action")
            .setRequired(true)
            .addChoices(
              { name: "Status", value: "status" },
              { name: "Threats", value: "threats" },
              { name: "Logs", value: "logs" }
            )),

      new SlashCommandBuilder()
        .setName("dashboard")
        .setDescription("View server dashboard and statistics"),
    ];

    try {
      // Set the token for the REST client
      this.client.rest.setToken(botToken);
      
      // Register commands with Discord
      await this.client.rest.put(
        `/applications/${clientId}/commands`,
        { body: commands }
      );
      console.log("✅ Discord commands registered successfully");
    } catch (error) {
      console.error("❌ Failed to register Discord commands:", error);
    }
  }

  private async detectSpam(message: any): Promise<boolean> {
    // Simple spam detection logic
    const content = message.content.toLowerCase();
    const spamPatterns = [
      /(.)\1{10,}/, // Repeated characters
      /@everyone|@here/g, // Mass mentions
      /discord\.gg\/|discordapp\.com\/invite/g, // Server invites
    ];

    return spamPatterns.some(pattern => pattern.test(content));
  }

  private detectMaliciousLinks(content: string): boolean {
    const maliciousPatterns = [
      /discord-nitro.*\.com/i,
      /free-nitro/i,
      /steam-gifts/i,
      /\.tk\b|\.ml\b|\.ga\b|\.cf\b/i, // Suspicious TLDs
    ];

    return maliciousPatterns.some(pattern => pattern.test(content));
  }

  private async handleThreat(message: any, threatType: string, severity: string) {
    const guild = message.guild;
    if (!guild) return;

    // Log threat detection
    await storage.createThreatDetection({
      serverId: guild.id,
      userId: message.author.id,
      threatType,
      content: message.content,
      severity,
      isBlocked: true,
    });

    // Delete the message
    await message.delete().catch(console.error);

    // Take action based on severity
    if (severity === "high" && threatType === "malicious_link") {
      // Auto-ban for malicious links
      await guild.members.ban(message.author.id, { reason: `Automatic ban: ${threatType}` });
      
      await storage.createModerationLog({
        serverId: guild.id,
        userId: message.author.id,
        moderatorId: this.client.user?.id || "bot",
        action: "ban",
        reason: `Automatic ban: ${threatType}`,
      });

      // Send notification
      const embed = new EmbedBuilder()
        .setColor(0xF23F42)
        .setTitle("⚠️ Malicious Link Detected")
        .setDescription(`User ${message.author.tag} has been automatically banned for sharing a malicious link.`)
        .addFields(
          { name: "Action", value: "Automatic Ban", inline: true },
          { name: "Threat Type", value: threatType, inline: true }
        )
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    }
  }

  private async handleSetupCommand(interaction: any) {
    const setting = interaction.options.getString("setting");
    const value = interaction.options.getString("value");
    const guildId = interaction.guild?.id;

    if (!guildId) {
      return interaction.reply({ content: "This command can only be used in a server!", ephemeral: true });
    }

    const server = await storage.getDiscordServer(guildId);
    const currentConfig = server?.configData || {};

    let updatedConfig = { ...currentConfig };

    switch (setting) {
      case "auto-mod":
        updatedConfig.autoMod = value.toLowerCase() === "enable";
        break;
      case "spam-protection":
        if (["low", "medium", "high"].includes(value.toLowerCase())) {
          updatedConfig.spamProtection = value.toLowerCase() as "low" | "medium" | "high";
        }
        break;
      case "raid-protection":
        updatedConfig.raidProtection = value.toLowerCase() === "enable";
        break;
      case "log-channel":
        updatedConfig.logChannelId = value;
        break;
    }

    if (server) {
      await storage.updateDiscordServer(guildId, { configData: updatedConfig });
    } else {
      await storage.createDiscordServer({
        serverId: guildId,
        serverName: interaction.guild.name,
        ownerId: interaction.guild.ownerId,
        configData: updatedConfig,
        isActive: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0x00D4AA)
      .setTitle("✅ Configuration Updated")
      .setDescription(`${setting} has been set to: ${value}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  private async handleBanCommand(interaction: any) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    try {
      await interaction.guild.members.ban(user.id, { reason });
      
      await storage.createModerationLog({
        serverId: interaction.guild.id,
        userId: user.id,
        moderatorId: interaction.user.id,
        action: "ban",
        reason,
      });

      const embed = new EmbedBuilder()
        .setColor(0xF23F42)
        .setTitle("🔨 User Banned")
        .setDescription(`${user.tag} has been banned from the server.`)
        .addFields({ name: "Reason", value: reason })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: "Failed to ban user. Check my permissions.", ephemeral: true });
    }
  }

  private async handleKickCommand(interaction: any) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    try {
      await interaction.guild.members.kick(user.id, reason);
      
      await storage.createModerationLog({
        serverId: interaction.guild.id,
        userId: user.id,
        moderatorId: interaction.user.id,
        action: "kick",
        reason,
      });

      const embed = new EmbedBuilder()
        .setColor(0xFAB005)
        .setTitle("👢 User Kicked")
        .setDescription(`${user.tag} has been kicked from the server.`)
        .addFields({ name: "Reason", value: reason })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: "Failed to kick user. Check my permissions.", ephemeral: true });
    }
  }

  private async handleMuteCommand(interaction: any) {
    const user = interaction.options.getUser("user");
    const duration = interaction.options.getInteger("duration") || 60;
    const reason = interaction.options.getString("reason") || "No reason provided";

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(duration * 60 * 1000, reason); // Convert to milliseconds
      
      await storage.createModerationLog({
        serverId: interaction.guild.id,
        userId: user.id,
        moderatorId: interaction.user.id,
        action: "mute",
        reason,
        duration,
      });

      const embed = new EmbedBuilder()
        .setColor(0xFAB005)
        .setTitle("🔇 User Muted")
        .setDescription(`${user.tag} has been muted for ${duration} minutes.`)
        .addFields({ name: "Reason", value: reason })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: "Failed to mute user. Check my permissions.", ephemeral: true });
    }
  }

  private async handleSecurityCommand(interaction: any) {
    const action = interaction.options.getString("action");
    const guildId = interaction.guild?.id;

    if (!guildId) {
      return interaction.reply({ content: "This command can only be used in a server!", ephemeral: true });
    }

    switch (action) {
      case "status":
        const server = await storage.getDiscordServer(guildId);
        const config = server?.configData || {};
        
        const embed = new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle("🛡️ Security Status")
          .addFields(
            { name: "Auto Moderation", value: config.autoMod ? "✅ Enabled" : "❌ Disabled", inline: true },
            { name: "Spam Protection", value: config.spamProtection || "Medium", inline: true },
            { name: "Raid Protection", value: config.raidProtection ? "✅ Enabled" : "❌ Disabled", inline: true }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        break;

      case "threats":
        const threats = await storage.getThreatsByServer(guildId, 10);
        
        const threatsEmbed = new EmbedBuilder()
          .setColor(0xF23F42)
          .setTitle("🚨 Recent Threats")
          .setDescription(threats.length > 0 ? 
            threats.map(t => `**${t.threatType}** - ${t.severity} severity`).join('\n') :
            "No threats detected recently."
          )
          .setTimestamp();

        await interaction.reply({ embeds: [threatsEmbed] });
        break;

      case "logs":
        const logs = await storage.getModerationLogs(guildId, 10);
        
        const logsEmbed = new EmbedBuilder()
          .setColor(0x00D4AA)
          .setTitle("📋 Recent Moderation Actions")
          .setDescription(logs.length > 0 ?
            logs.map(l => `**${l.action}** - <@${l.userId}> by <@${l.moderatorId}>`).join('\n') :
            "No recent moderation actions."
          )
          .setTimestamp();

        await interaction.reply({ embeds: [logsEmbed] });
        break;
    }
  }

  private async handleDashboardCommand(interaction: any) {
    const stats = await storage.getBotStats();
    const guildId = interaction.guild?.id;
    
    if (!guildId) {
      return interaction.reply({ content: "This command can only be used in a server!", ephemeral: true });
    }

    const todayThreats = await storage.getTodayThreatsCount();
    const recentThreats = await storage.getThreatsByServer(guildId, 5);
    
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle("📊 Server Dashboard")
      .addFields(
        { name: "Threats Blocked Today", value: todayThreats.toString(), inline: true },
        { name: "Bot Status", value: "🟢 Online", inline: true },
        { name: "Total Servers", value: stats?.totalServers?.toString() || "0", inline: true }
      )
      .setTimestamp();

    if (recentThreats.length > 0) {
      embed.addFields({
        name: "Recent Threats",
        value: recentThreats.map(t => `• ${t.threatType} (${t.severity})`).join('\n')
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  async start() {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      console.error("❌ DISCORD_BOT_TOKEN environment variable is required");
      return;
    }

    try {
      await this.client.login(token);
    } catch (error) {
      console.error("❌ Failed to start Discord bot:", error);
    }
  }

  isOnline(): boolean {
    return this.isReady;
  }

  getClient(): Client {
    return this.client;
  }
}

export const discordBot = new DiscordSecurityBot();

// Start the bot if token is available
if (process.env.DISCORD_BOT_TOKEN) {
  discordBot.start();
}
