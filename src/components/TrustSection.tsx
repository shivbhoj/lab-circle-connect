import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award, RefreshCw, Users } from "lucide-react";

const trustFeatures = [
  {
    icon: Shield,
    title: "Verified Sellers",
    description: "All sellers undergo rigorous verification including business licenses, certifications, and background checks."
  },
  {
    icon: Award,
    title: "Certified Equipment",
    description: "Every piece of equipment is inspected, tested, and certified by qualified technicians before listing."
  },
  {
    icon: RefreshCw,
    title: "Warranty Protection",
    description: "Comprehensive warranty options available with professional refurbishment and ongoing support."
  },
  {
    icon: Users,
    title: "Community Reviews",
    description: "Transparent rating system with detailed reviews from verified buyers in the scientific community."
  }
];

const TrustSection = () => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Built on Trust & Transparency
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We understand that laboratory equipment represents significant investments. 
            Our platform prioritizes trust, quality, and transparency in every transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-lg bg-background">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-trust/10 rounded-full">
                      <Icon className="h-8 w-8 text-trust" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Metrics */}
        <div className="mt-16 bg-background rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-trust mb-2">$2.5M+</div>
              <div className="text-sm text-muted-foreground">Equipment Value Traded</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-trust mb-2">99.2%</div>
              <div className="text-sm text-muted-foreground">Successful Transactions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-trust mb-2">48h</div>
              <div className="text-sm text-muted-foreground">Average Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-trust mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;