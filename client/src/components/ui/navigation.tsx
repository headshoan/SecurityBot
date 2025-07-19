import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Shield, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: inviteData } = useQuery({
    queryKey: ["/api/discord/invite"],
  });

  const handleAddToServer = () => {
    if (inviteData?.inviteUrl) {
      window.open(inviteData.inviteUrl, '_blank');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-bg-tertiary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-discord to-discord-dark rounded-lg flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">SecureBot</h1>
              <p className="text-xs text-text-secondary">Premium Security</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('demo')}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Demo
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('docs')}
              className="text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              Docs
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleAddToServer}
              className="bg-discord hover:bg-discord-dark text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Add to Server
            </Button>
            <button 
              className="md:hidden text-text-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-bg-tertiary">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200 text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200 text-left"
              >
                Demo
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200 text-left"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('docs')}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200 text-left"
              >
                Docs
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
