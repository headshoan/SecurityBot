import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const plans = [
  {
    name: "Basic Protection",
    price: "Free",
    description: "Perfect for small communities",
    features: [
      { name: "Basic spam protection", included: true },
      { name: "Standard moderation commands", included: true },
      { name: "Community support", included: true },
      { name: "Advanced threat detection", included: false },
      { name: "Custom commands", included: false }
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false
  },
  {
    name: "Pro Security",
    price: "$4.99",
    period: "/month",
    description: "Advanced protection for growing servers",
    features: [
      { name: "All Basic features", included: true },
      { name: "AI-powered threat detection", included: true },
      { name: "Custom commands & automation", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Priority support", included: true }
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default" as const,
    popular: true
  },
  {
    name: "Enterprise",
    price: "$19.99",
    period: "/month",
    description: "Maximum security for large communities",
    features: [
      { name: "All Pro features", included: true },
      { name: "White-label branding", included: true },
      { name: "Dedicated support agent", included: true },
      { name: "Custom integrations", included: true },
      { name: "99.99% SLA guarantee", included: true }
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
    popular: false
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Choose Your Protection Level
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            From basic protection to enterprise security - we have the perfect plan for your Discord server
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`bg-bg-primary rounded-xl p-8 transition-all duration-300 relative ${
                plan.popular 
                  ? "border-2 border-discord transform scale-105 shadow-2xl" 
                  : "border border-bg-tertiary hover:border-discord"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-discord to-discord-dark text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 text-text-primary">{plan.name}</h3>
                <div className="mb-2">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-discord' : 'text-accent-success'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-lg font-normal text-text-secondary">{plan.period}</span>
                  )}
                </div>
                <p className="text-text-secondary">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-text-secondary">
                    {feature.included ? (
                      <Check className="text-accent-success mr-3 flex-shrink-0" size={16} />
                    ) : (
                      <X className="text-accent-danger mr-3 flex-shrink-0" size={16} />
                    )}
                    {feature.name}
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.buttonVariant}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                  plan.popular 
                    ? "bg-gradient-to-r from-discord to-discord-dark text-white hover:from-discord-dark hover:to-discord transform hover:scale-105"
                    : plan.buttonVariant === "outline"
                    ? "border-discord text-discord hover:bg-discord hover:text-white"
                    : ""
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
