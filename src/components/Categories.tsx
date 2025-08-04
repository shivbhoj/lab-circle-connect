import { Card } from "@/components/ui/card";
import { Microscope, FlaskConical, Zap, Thermometer, Beaker, Scale } from "lucide-react";

const categories = [
  {
    name: "Microscopes",
    icon: Microscope,
    count: "1,245",
    description: "Optical, electron, and digital microscopes"
  },
  {
    name: "Analytical Instruments",
    icon: FlaskConical,
    count: "892",
    description: "Spectroscopy, chromatography, and more"
  },
  {
    name: "Lab Electronics",
    icon: Zap,
    count: "634",
    description: "Power supplies, meters, and controllers"
  },
  {
    name: "Temperature Control",
    icon: Thermometer,
    count: "456",
    description: "Incubators, ovens, and freezers"
  },
  {
    name: "Glassware",
    icon: Beaker,
    count: "789",
    description: "Beakers, flasks, and laboratory glass"
  },
  {
    name: "Scales & Balances",
    icon: Scale,
    count: "321",
    description: "Analytical and precision balances"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need from our extensive collection of certified laboratory equipment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.name}
                className="group p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                    <p className="text-sm font-medium text-primary mt-2">
                      {category.count} items available
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;