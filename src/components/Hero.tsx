import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/hero-lab-equipment.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-sustainability/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="mb-4">
                🌱 Sustainable Laboratory Solutions
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Trusted Marketplace for{" "}
                <span className="bg-gradient-to-r from-primary to-sustainability bg-clip-text text-transparent">
                  Used Lab Equipment
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect with verified sellers and buyers. Access certified, refurbished 
                laboratory equipment with transparent ratings and comprehensive warranties.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-verified" />
                <span>Certified Equipment</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-trust" />
                <span>Trusted Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-sustainability" />
                <span>Sustainable Choice</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8">
                Browse Equipment
              </Button>
              <Button variant="trust" size="lg" className="text-lg px-8">
                Sell Your Equipment
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Equipment Listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Verified Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Scientific laboratory equipment"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating trust badge */}
            <div className="absolute -bottom-6 -left-6 bg-background border border-border rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-verified rounded-full"></div>
                <span className="text-sm font-medium">Certified & Tested</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;