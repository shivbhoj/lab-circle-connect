import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const featuredEquipment = [
  {
    id: 1,
    name: "Olympus BX51 Research Microscope",
    brand: "Olympus",
    condition: "Excellent",
    price: "$8,500",
    originalPrice: "$15,000",
    rating: 4.8,
    reviews: 24,
    seller: "BioTech Solutions",
    verified: true,
    certification: "ISO Certified",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    tags: ["Refurbished", "Warranty Included"]
  },
  {
    id: 2,
    name: "Thermo Scientific Centrifuge",
    brand: "Thermo Fisher",
    condition: "Very Good",
    price: "$3,200",
    originalPrice: "$5,800",
    rating: 4.6,
    reviews: 18,
    seller: "Lab Equipment Pro",
    verified: true,
    certification: "Factory Tested",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    tags: ["Recently Serviced"]
  },
  {
    id: 3,
    name: "Waters HPLC System",
    brand: "Waters",
    condition: "Good",
    price: "$12,000",
    originalPrice: "$25,000",
    rating: 4.7,
    reviews: 31,
    seller: "Analytical Instruments Inc",
    verified: true,
    certification: "Calibrated",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
    tags: ["Complete System", "Documentation"]
  }
];

const FeaturedEquipment = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Equipment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hand-picked, certified equipment from our most trusted sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEquipment.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <div className="absolute top-4 left-4 space-y-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.brand}</p>
                  </div>

                  {/* Condition & Certification */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-verified">
                      Condition: {item.condition}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {item.certification}
                    </Badge>
                  </div>

                  {/* Rating & Seller */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-sm text-muted-foreground">({item.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {item.verified && <CheckCircle className="h-4 w-4 text-verified" />}
                      <span className="text-sm text-muted-foreground">{item.seller}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-foreground">{item.price}</div>
                      <div className="text-sm text-muted-foreground line-through">
                        Original: {item.originalPrice}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-sustainability">
                        Save {Math.round(((parseInt(item.originalPrice.replace(/[$,]/g, '')) - parseInt(item.price.replace(/[$,]/g, ''))) / parseInt(item.originalPrice.replace(/[$,]/g, ''))) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" variant="default">
                      View Details
                    </Button>
                    <Button variant="outline">
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/equipment')}
          >
            View All Equipment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEquipment;