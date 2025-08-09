import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MapPin, ShieldCheck, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

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
  user_id: string;
  profiles?: {
    full_name?: string;
    company?: string;
    verified?: boolean;
    email?: string;
  } | null;
};

const EquipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const fetchEquipment = async () => {
      if (!id) {
        setLoading(false);
        toast({ title: "Error", description: "Equipment ID is missing.", variant: "destructive" });
        return;
      }

      try {
        const { data, error } = await supabase
          .from('equipment')
          .select('*, profiles(full_name, company, verified, email)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEquipment(data as Equipment);
      } catch (error) {
        console.error('Error fetching equipment details:', error);
        toast({
          title: "Error",
          description: "Failed to load equipment details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id, toast]);

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

  const handleContactSeller = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to contact the seller.",
        action: <Button onClick={() => navigate('/auth')}>Sign In</Button>,
      });
    } else {
      setShowContactDialog(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Skeleton Loader */}
        </div>
        <Footer />
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-2xl font-bold">Equipment not found</h1>
          <p className="text-muted-foreground">The equipment you are looking for does not exist.</p>
          <Button onClick={() => navigate('/equipment')} className="mt-4">Back to Listings</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div>
            <Carousel className="w-full">
              <CarouselContent>
                {equipment.images && equipment.images.length > 0 ? (
                  equipment.images.map((img, index) => (
                    <CarouselItem key={index}>
                      <img src={img} alt={`${equipment.name} image ${index + 1}`} className="w-full h-auto object-cover rounded-lg" />
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="w-full h-96 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">No Image Available</p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Equipment Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{equipment.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getConditionColor(equipment.condition)}>
                {equipment.condition.charAt(0).toUpperCase() + equipment.condition.slice(1)}
              </Badge>
              {equipment.certification_status === 'certified' && (
                <Badge className="bg-verified text-white">
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  Certified
                </Badge>
              )}
              <p className="text-sm text-muted-foreground">{equipment.category}</p>
            </div>
            <p className="text-lg text-muted-foreground mb-4">{equipment.brand} {equipment.model && `- ${equipment.model}`}</p>
            <p className="text-4xl font-bold text-primary mb-6">{formatPrice(equipment.price)}</p>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{equipment.description || "No description provided."}</p>
              </CardContent>
            </Card>

            {equipment.location && (
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{equipment.location}</span>
              </div>
            )}

            {equipment.profiles && (
              <Card className="mb-6 bg-muted/30">
                <CardHeader>
                  <CardTitle>Seller Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{equipment.profiles.full_name || "Anonymous Seller"}</p>
                        {equipment.profiles.company && <p className="text-sm text-muted-foreground">{equipment.profiles.company}</p>}
                      </div>
                    </div>
                    {equipment.profiles.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified Seller
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button size="lg" className="w-full" onClick={handleContactSeller}>
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact Seller
            </Button>
          </div>
        </div>
      </div>
      <Footer />

      <AlertDialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Contact Seller</AlertDialogTitle>
            <AlertDialogDescription>
              The seller's email is: {equipment.profiles?.email || "not available"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowContactDialog(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EquipmentDetail;
