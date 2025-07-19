import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import FeaturesSection from "@/components/ui/features-section";
import DemoSection from "@/components/ui/demo-section";
import PricingSection from "@/components/ui/pricing-section";
import SetupSection from "@/components/ui/setup-section";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <PricingSection />
      <SetupSection />
      <Footer />
    </div>
  );
}
