import { useState, useEffect } from "react";
import { Card } from "./card";
import { Badge } from "./badge";
import { Shield, Zap, Eye, Ban } from "lucide-react";

const demoLogs = [
  { id: 1, type: "threat", message: "Malicious link detected from @spammer123", action: "Auto-banned", time: "2 seconds ago" },
  { id: 2, type: "spam", message: "Spam message blocked from @advertiser", action: "Message deleted", time: "5 seconds ago" },
  { id: 3, type: "raid", message: "Raid attempt detected - 15 users joined", action: "Lockdown activated", time: "12 seconds ago" },
  { id: 4, type: "success", message: "Server secured - all threats neutralized", action: "Protection active", time: "15 seconds ago" },
];

export default function DemoSection() {
  const [currentLog, setCurrentLog] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState([demoLogs[0]]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLog(prev => {
        const next = (prev + 1) % demoLogs.length;
        setDisplayedLogs(prev => {
          const newLogs = [...prev, demoLogs[next]];
          return newLogs.slice(-3); // Keep only last 3 logs
        });
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "threat": return <Ban className="w-4 h-4 text-red-400" />;
      case "spam": return <Shield className="w-4 h-4 text-yellow-400" />;
      case "raid": return <Eye className="w-4 h-4 text-orange-400" />;
      case "success": return <Zap className="w-4 h-4 text-green-400" />;
      default: return <Shield className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "threat": return "text-red-400";
      case "spam": return "text-yellow-400";
      case "raid": return "text-orange-400";
      case "success": return "text-green-400";
      default: return "text-blue-400";
    }
  };

  return (
    <section id="demo" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            See SecureBot in <span className="text-transparent bg-clip-text bg-gradient-to-r from-discord to-discord-dark">Action</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Watch how SecureBot automatically detects and responds to threats in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-6">Real-time Protection</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Advanced Threat Detection</h4>
                  <p className="text-text-secondary">AI-powered scanning identifies malicious links, spam, and suspicious behavior patterns instantly.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Instant Response</h4>
                  <p className="text-text-secondary">Automated actions happen in milliseconds - threats are neutralized before they can cause damage.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text-primary mb-2">Complete Monitoring</h4>
                  <p className="text-text-secondary">24/7 surveillance of your server with detailed logs and analytics for full transparency.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Card className="bg-bg-secondary border-bg-tertiary">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-text-primary">Security Console</h4>
                  <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
                    Live
                  </Badge>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-text-secondary ml-2">SecureBot Console</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {displayedLogs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-2 animate-fade-in">
                        {getLogIcon(log.type)}
                        <div className="flex-1 min-w-0">
                          <div className={`${getLogColor(log.type)} text-sm`}>
                            {log.message}
                          </div>
                          <div className="text-green-400 text-xs mt-1">
                            ✓ {log.action}
                          </div>
                          <div className="text-text-secondary text-xs">
                            {log.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">247</div>
                    <div className="text-xs text-text-secondary">Threats Blocked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">15</div>
                    <div className="text-xs text-text-secondary">Active Servers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">99.9%</div>
                    <div className="text-xs text-text-secondary">Uptime</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}