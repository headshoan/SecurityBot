import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Info, BarChart3, Terminal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const initialMessages = [
  {
    id: 1,
    user: "BadUser",
    userColor: "text-red-400",
    avatar: "U",
    avatarBg: "bg-gradient-to-r from-red-500 to-pink-500",
    time: "Today at 2:34 PM",
    content: "Check out this totally legit free nitro link! discord-nitro-free.fake-site.com",
    type: "user"
  }
];

const botResponse = {
  id: 2,
  user: "SecureBot",
  userColor: "text-discord",
  avatar: "🛡️",
  avatarBg: "bg-gradient-to-r from-discord to-discord-dark",
  time: "Today at 2:34 PM",
  content: "⚠️ Malicious Link Detected\nUser BadUser has been automatically banned for sharing a malicious link. Message deleted.",
  type: "bot",
  severity: "danger"
};

const userReaction = {
  id: 3,
  user: "AdminUser",
  userColor: "text-green-400",
  avatar: "A",
  avatarBg: "bg-gradient-to-r from-green-500 to-blue-500",
  time: "Today at 2:35 PM",
  content: "Thanks SecureBot! Great protection as always 👍",
  type: "user"
};

export default function DemoSection() {
  const [messages, setMessages] = useState(initialMessages);
  const [isRunning, setIsRunning] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const runDemo = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    // Add bot response after 1 second
    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
    
    // Add user reaction after 2 seconds
    setTimeout(() => {
      setMessages(prev => [...prev, userReaction]);
      setIsRunning(false);
    }, 2000);
  };

  const resetDemo = () => {
    setMessages(initialMessages);
    setIsRunning(false);
  };

  return (
    <section id="demo" className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            See SecureBot in Action
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Experience the power of advanced Discord moderation with our interactive demo
          </p>
        </div>

        <div className="bg-bg-secondary border border-bg-tertiary rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent-danger rounded-full"></div>
              <div className="w-3 h-3 bg-accent-warning rounded-full"></div>
              <div className="w-3 h-3 bg-accent-success rounded-full"></div>
            </div>
            <div className="text-text-secondary text-sm"># general</div>
          </div>

          <div className="space-y-4 mb-6 h-64 overflow-y-auto bg-bg-primary rounded-lg p-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3 animate-fade-in">
                <div className={`w-8 h-8 ${message.avatarBg} rounded-full flex items-center justify-center text-sm font-semibold`}>
                  {message.avatar}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-semibold ${message.userColor}`}>{message.user}</span>
                    {message.type === "bot" && (
                      <span className="bg-discord text-white text-xs px-2 py-0.5 rounded">BOT</span>
                    )}
                    <span className="text-text-secondary text-xs">{message.time}</span>
                  </div>
                  {message.type === "bot" ? (
                    <div className="bg-accent-danger/20 border-l-4 border-accent-danger p-3 rounded">
                      <div className="text-accent-danger font-semibold">⚠️ Malicious Link Detected</div>
                      <div className="text-text-secondary text-sm mt-1">User BadUser has been automatically banned for sharing a malicious link. Message deleted.</div>
                    </div>
                  ) : (
                    <div className="text-text-primary">{message.content}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={runDemo}
              disabled={isRunning}
              className="bg-discord hover:bg-discord-dark text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Play className="mr-2" size={16} />
              {isRunning ? "Running Demo..." : "Run Demo"}
            </Button>
            <Button 
              onClick={resetDemo}
              variant="outline"
              className="border border-bg-tertiary hover:border-discord text-text-secondary hover:text-discord px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="mr-2" size={16} />
              Reset
            </Button>
            <div className="text-text-secondary text-sm flex items-center">
              <Info className="mr-1" size={16} />
              Demo shows automatic threat detection and response
            </div>
          </div>
        </div>

        {/* Command Examples and Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
              <Terminal className="mr-2 text-discord" size={20} />
              Slash Commands
            </h3>
            <div className="space-y-3 font-mono text-sm">
              <div className="bg-bg-primary p-3 rounded border-l-4 border-discord">
                <div className="text-discord">/ban @user reason</div>
                <div className="text-text-secondary text-xs mt-1">Ban a user with optional reason</div>
              </div>
              <div className="bg-bg-primary p-3 rounded border-l-4 border-accent-warning">
                <div className="text-accent-warning">/mute @user duration</div>
                <div className="text-text-secondary text-xs mt-1">Temporarily mute a user</div>
              </div>
              <div className="bg-bg-primary p-3 rounded border-l-4 border-accent-success">
                <div className="text-accent-success">/security status</div>
                <div className="text-text-secondary text-xs mt-1">Check server security status</div>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
              <BarChart3 className="mr-2 text-accent-success" size={20} />
              Live Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Threats Blocked Today</span>
                <span className="text-accent-danger font-semibold">{stats?.threatsBlockedToday || 247}</span>
              </div>
              <div className="w-full bg-bg-primary rounded-full h-2">
                <div className="bg-gradient-to-r from-accent-danger to-accent-warning h-2 rounded-full" style={{width: "78%"}}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Active Protections</span>
                <span className="text-accent-success font-semibold">12/12</span>
              </div>
              <div className="w-full bg-bg-primary rounded-full h-2">
                <div className="bg-gradient-to-r from-accent-success to-discord h-2 rounded-full" style={{width: "100%"}}></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Server Health</span>
                <span className="text-accent-success font-semibold">
                  {stats?.isOnline ? "Excellent" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
