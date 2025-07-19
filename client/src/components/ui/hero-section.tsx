import { Button } from "@/components/ui/button";
import { Play, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function HeroSection() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  type InviteData = { inviteUrl?: string };
  const { data: inviteData } = useQuery<InviteData>({
    queryKey: ["/api/discord/invite"],
  });

  const handleAddToDiscord = () => {
    if (inviteData?.inviteUrl) {
      window.open(inviteData.inviteUrl, '_blank');
    }
  };

  const scrollToDemo = () => {
    const element = document.getElementById('demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-discord rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[hsl(var(--accent-success))] rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          <div className="inline-flex items-center bg-bg-tertiary/50 border border-bg-tertiary rounded-full px-6 py-2 mb-8">
            <Star className="text-accent-warning mr-2" size={16} />
            <span className="text-sm text-text-secondary">
              Trusted by {stats?.totalServers || '10,000'}+ Discord servers
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-gradient">
            Ultimate Discord Security
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
            Protect your Discord server with advanced moderation, anti-spam protection, and intelligent security features. 
            <span className="text-accent-success font-semibold"> Mega affen geil!</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={handleAddToDiscord}
              className="bg-gradient-to-r from-discord to-discord-dark hover:from-discord-dark hover:to-discord text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
              </svg>
              Add to Discord
            </Button>
            <Button 
              onClick={scrollToDemo}
              variant="outline"
              className="border border-bg-tertiary hover:border-discord text-text-primary hover:text-discord px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-2" size={20} />
              Watch Demo
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-bg-secondary/50 backdrop-blur-sm border border-bg-tertiary rounded-lg p-6 hover:border-discord transition-colors duration-300">
              <div className="text-3xl font-bold text-accent-success mb-2">99.9%</div>
              <div className="text-text-secondary">Uptime Guarantee</div>
            </div>
            <div className="bg-bg-secondary/50 backdrop-blur-sm border border-bg-tertiary rounded-lg p-6 hover:border-discord transition-colors duration-300">
              <div className="text-3xl font-bold text-accent-warning mb-2">24/7</div>
              <div className="text-text-secondary">Active Protection</div>
            </div>
            <div className="bg-bg-secondary/50 backdrop-blur-sm border border-bg-tertiary rounded-lg p-6 hover:border-discord transition-colors duration-300">
              <div className="text-3xl font-bold text-discord mb-2">{stats?.totalServers || '10K'}+</div>
              <div className="text-text-secondary">Servers Protected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
