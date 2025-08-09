import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Star, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Equipment = {
  id: string;
  name: string;
  brand: string;
  model?: string;
  description?: string;
  price: number;
  condition: string;
  category: string;
  certification_status: string;
  availability_status: string;
  location?: string;
  images: string[];
  tags: string[];
  created_at: string;
  profiles?: {
    full_name?: string;
    company?: string;
    verified?: boolean;
  } | null;
};

const Equipment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  const fetchEquipment = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('availability_status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipment(data || []);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast({
        title: "Error",
        description: "Failed to load equipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesCondition = conditionFilter === "all" || item.condition === conditionFilter;
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const categories = [...new Set(equipment.map(item => item.category))];
  const conditions = ["new", "excellent", "good", "fair", "poor"];

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "bg-accent text-accent-foreground";
      case "excellent": return "bg-verified/10 text-verified border-verified";
      case "good": return "bg-primary/10 text-primary border-primary";
      case "fair": return "bg-warning/10 text-warning border-warning";
      case "poor": return "bg-destructive/10 text-destructive border-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleContactSeller = (equipmentId: string) => {
    toast({
      title: "Contact Seller",
      description: "This feature requires authentication. Please sign in to contact sellers.",
    });
  };

  const handleViewDetails = (equipmentId: string) => {
    navigate(`/equipment/${equipmentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Filters Section */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Laboratory Equipment</h1>
              <p className="text-muted-foreground mt-1">
                {filteredEquipment.length} items available
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEquipment.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-muted/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No equipment found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse all categories.
            </p>
            <Button onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setConditionFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 bg-muted/30">
                  {item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {item.certification_status === 'certified' && (
                    <Badge className="absolute top-2 right-2 bg-verified text-white">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
                    <Badge className={getConditionColor(item.condition)}>
                      {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">{item.brand}</p>
                  {item.model && (
                    <p className="text-sm text-muted-foreground mb-2">Model: {item.model}</p>
                  )}
                  
                  <p className="text-sm text-foreground mb-3 line-clamp-2">
                    {item.description || "No description available"}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(item.price)}
                    </span>
                    {item.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.location}
                      </div>
                    )}
                  </div>
                  
                  {item.profiles && (
                    <div className="flex items-center justify-between mb-4 p-2 bg-muted/30 rounded">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.profiles.full_name || "Seller"}
                        </p>
                        {item.profiles.company && (
                          <p className="text-xs text-muted-foreground">{item.profiles.company}</p>
                        )}
                      </div>
                      {item.profiles.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleContactSeller(item.id)}
                    >
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Equipment;