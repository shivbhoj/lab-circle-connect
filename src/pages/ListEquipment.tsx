import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const equipmentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  brand: z.string().min(2, "Brand is required"),
  model: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number"),
  condition: z.enum(["new", "excellent", "good", "fair", "poor"]),
  category: z.string().min(2, "Category is required"),
  location: z.string().optional(),
});

const ListEquipment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get("edit");
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: "",
      brand: "",
      model: "",
      description: "",
      price: 0,
      condition: "good",
      category: "",
      location: "",
    },
  });

  useEffect(() => {
    const checkUserAndLoadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "You must be signed in to manage equipment.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      if (equipmentId) {
        setIsEditMode(true);
        const { data, error } = await supabase
          .from("equipment")
          .select()
          .eq("id", equipmentId)
          .single();

        if (error || !data) {
          toast({ title: "Error", description: "Could not load equipment data.", variant: "destructive" });
          navigate("/dashboard");
        } else if (data.user_id !== user.id) {
          toast({ title: "Unauthorized", description: "You do not have permission to edit this equipment.", variant: "destructive" });
          navigate("/dashboard");
        }
        else {
          form.reset(data);
        }
      }
    };
    checkUserAndLoadData();
  }, [navigate, toast, equipmentId, form]);

  const onSubmit = async (values: z.infer<typeof equipmentSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      if (isEditMode) {
        const { error } = await supabase
          .from("equipment")
          .update(values)
          .eq("id", equipmentId);
        if (error) throw error;
        toast({ title: "Success!", description: "Your equipment has been updated." });
      } else {
        const { error } = await supabase.from("equipment").insert([{
          ...values,
          user_id: user.id,
          availability_status: 'available',
          images: [], // Placeholder for image uploads
          tags: [], // Placeholder for tags
        }]);
        if (error) throw error;
        toast({ title: "Success!", description: "Your equipment has been listed." });
      }
      navigate("/dashboard");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">
          {isEditMode ? "Edit Your Equipment" : "List Your Equipment"}
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipment Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Spectrophotometer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Thermo Fisher" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., NanoDrop 2000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the equipment, its features, and any other relevant details." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Microscopy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : (isEditMode ? "Save Changes" : "List Equipment")}
            </Button>
          </form>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default ListEquipment;
