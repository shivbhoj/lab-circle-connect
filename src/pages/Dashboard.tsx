import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { User } from "@supabase/supabase-js";

type Equipment = {
  id: string;
  name: string;
  brand: string;
  price: number;
  condition: string;
  availability_status: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEquipment, setUserEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState<string | null>(null);

  const fetchUserEquipment = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipment')
        .select('id, name, brand, price, condition, availability_status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserEquipment(data || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load your equipment.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Error", description: "You must be logged in to view this page.", variant: "destructive" });
        navigate("/auth");
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [navigate, toast]);

  useEffect(() => {
    if (user) {
      fetchUserEquipment();
    }
  }, [user, fetchUserEquipment]);

  const handleEdit = (equipmentId: string) => {
    navigate(`/list-equipment?edit=${equipmentId}`);
  };

  const handleDeleteClick = (equipmentId: string) => {
    setEquipmentToDelete(equipmentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!equipmentToDelete) return;

    try {
      const { error } = await supabase.from('equipment').delete().eq('id', equipmentToDelete);
      if (error) throw error;
      toast({ title: "Success", description: "Equipment listing deleted." });
      fetchUserEquipment(); // Refresh the list
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete listing.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setDeleteDialogOpen(false);
      setEquipmentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <Button onClick={() => navigate('/list-equipment')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            List New Equipment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Equipment Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : userEquipment.length === 0 ? (
              <p>You have not listed any equipment yet.</p>
            ) : (
              <div className="space-y-4">
                {userEquipment.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">${item.price.toLocaleString()}</p>
                      <span className="text-sm capitalize text-muted-foreground">{item.condition}</span>
                      <span className={`text-sm capitalize ${item.availability_status === 'available' ? 'text-green-500' : 'text-red-500'}`}>
                        {item.availability_status}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(item.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Equipment Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
