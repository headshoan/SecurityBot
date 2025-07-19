import { UserX, Users, TrendingUp, FileText, Terminal, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: UserX,
    title: "Auto Moderation",
    description: "Intelligent spam detection and automatic user management with customizable rules and filters.",
    tags: ["Anti-Spam", "Auto-Ban"]
  },
  {
    icon: Users,
    title: "Role Management", 
    description: "Advanced role assignment and permission management with automated role distribution systems.",
    tags: ["Auto-Role", "Permissions"]
  },
  {
    icon: TrendingUp,
    title: "Activity Monitoring",
    description: "Real-time server monitoring with detailed analytics and suspicious activity detection.",
    tags: ["Analytics", "Alerts"]
  },
  {
    icon: FileText,
    title: "Moderation Logs",
    description: "Comprehensive logging system that tracks all moderation actions and user behavior patterns.",
    tags: ["Audit Trail", "History"]
  },
  {
    icon: Terminal,
    title: "Custom Commands",
    description: "Create custom moderation commands with advanced permission systems and automated responses.",
    tags: ["Slash Commands", "Automation"]
  },
  {
    icon: ShieldCheck,
    title: "Threat Detection",
    description: "AI-powered threat detection that identifies and neutralizes malicious links, raids, and suspicious behavior.",
    tags: ["AI Detection", "Real-time"]
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Powerful Security Features
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Comprehensive moderation tools designed to keep your Discord server safe and organized
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-bg-primary border border-bg-tertiary rounded-xl p-6 hover:border-discord transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-discord to-accent-success rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-white" size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-primary">{feature.title}</h3>
              <p className="text-text-secondary mb-4">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="bg-bg-tertiary text-text-secondary px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
