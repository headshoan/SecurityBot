import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react";

const setupSteps = [
  {
    number: 1,
    title: "Invite SecureBot",
    description: "Click the \"Add to Server\" button and select your Discord server from the dropdown.",
    color: "bg-discord"
  },
  {
    number: 2,
    title: "Configure Permissions",
    description: "Grant the necessary permissions for moderation, role management, and message handling.",
    color: "bg-accent-success"
  },
  {
    number: 3,
    title: "Customize Settings",
    description: "Use /setup to configure auto-moderation rules and security levels.",
    color: "bg-accent-warning"
  },
  {
    number: 4,
    title: "Start Protecting",
    description: "Your server is now protected! Monitor activity with /dashboard.",
    color: "bg-accent-danger"
  }
];

const configCommands = [
  {
    category: "Basic Setup Commands",
    color: "text-accent-success",
    commands: [
      "/setup auto-mod enable",
      "/setup spam-protection high",
      "/setup log-channel #mod-logs"
    ]
  },
  {
    category: "Advanced Configuration",
    color: "text-accent-warning",
    commands: [
      "/config raid-protection enable",
      "/config auto-role @Member",
      "/config welcome-message \"Welcome!\""
    ]
  },
  {
    category: "Monitor & Control",
    color: "text-discord",
    commands: [
      "/dashboard",
      "/security status",
      "/logs recent"
    ]
  }
];

export default function SetupSection() {
  return (
    <section id="docs" className="py-20 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Setup in Minutes
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Get SecureBot protecting your server in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-8 text-text-primary">Quick Setup Guide</h3>
            
            <div className="space-y-6">
              {setupSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {step.number}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h4>
                    <p className="text-text-secondary">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-bg-secondary border border-bg-tertiary rounded-lg">
              <h4 className="text-lg font-semibold text-text-primary mb-3 flex items-center">
                <BookOpen className="mr-2 text-discord" size={20} />
                Need Help?
              </h4>
              <p className="text-text-secondary mb-4">Check out our comprehensive documentation and join our support server.</p>
              <div className="flex space-x-4">
                <Button variant="link" className="text-discord hover:text-discord-dark transition-colors duration-200 p-0">
                  <ExternalLink className="mr-1" size={16} />
                  Documentation
                </Button>
                <Button variant="link" className="text-discord hover:text-discord-dark transition-colors duration-200 p-0">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  Support Server
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-text-primary">Bot Configuration</h4>
              <span className="text-accent-success text-sm flex items-center">
                <div className="w-2 h-2 bg-accent-success rounded-full mr-1"></div>
                Online
              </span>
            </div>

            <div className="space-y-4 text-sm font-mono">
              {configCommands.map((section, index) => (
                <div key={index} className="bg-bg-primary p-4 rounded border border-bg-tertiary">
                  <div className={`${section.color} mb-2 font-semibold`}># {section.category}</div>
                  {section.commands.map((command, cmdIndex) => (
                    <div key={cmdIndex} className="text-text-secondary">{command}</div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-accent-success/10 border border-accent-success/30 rounded">
              <div className="text-accent-success font-semibold mb-2">✅ Ready to Go!</div>
              <div className="text-text-secondary text-sm">Your bot is configured and protecting your server.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
