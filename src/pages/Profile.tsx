import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { formatError, sanitizeInput } from "@/lib/utils";

const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name must not exceed 100 characters.")
    .regex(/^[a-zA-Z\s'-]+$/, "Full name can only contain letters, spaces, hyphens, and apostrophes."),
  company: z
    .string()
    .max(100, "Company name must not exceed 100 characters.")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      company: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    const getUserAndProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error(`Authentication error: ${formatError(userError)}`);
        }

        if (!user) {
          toast({ 
            title: "Authentication Required", 
            description: "You must be logged in to view this page.", 
            variant: "destructive" 
          });
          navigate("/auth");
          return;
        }

        if (!isMounted) return;
        setUser(user);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is acceptable for new users
          throw new Error(`Failed to load profile: ${formatError(profileError)}`);
        }

        if (isMounted && profile) {
          form.reset({
            full_name: profile.full_name || "",
            company: profile.company || "",
          });
        }
      } catch (err) {
        const errorMessage = formatError(err);
        setError(errorMessage);
        toast({ 
          title: "Error Loading Profile", 
          description: errorMessage, 
          variant: "destructive" 
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getUserAndProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate, toast, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      toast({ 
        title: "Error", 
        description: "User session not found. Please log in again.", 
        variant: "destructive" 
      });
      navigate("/auth");
      return;
    }

    try {
      // Sanitize inputs before sending to database
      const sanitizedData = {
        full_name: sanitizeInput(values.full_name),
        company: values.company ? sanitizeInput(values.company) : null,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("profiles")
        .update(sanitizedData)
        .eq("user_id", user.id);

      if (updateError) {
        throw new Error(formatError(updateError));
      }

      toast({ 
        title: "Success", 
        description: "Profile updated successfully.",
        variant: "default"
      });
    } catch (err) {
      const errorMessage = formatError(err);
      toast({ 
        title: "Update Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center" role="status" aria-live="polite">
            <p className="text-lg">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Error Loading Profile</CardTitle>
              <CardDescription className="text-destructive">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Update your personal information here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" aria-label="Profile form">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="full_name">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          id="full_name"
                          placeholder="Your full name" 
                          aria-required="true"
                          aria-invalid={!!form.formState.errors.full_name}
                          aria-describedby={form.formState.errors.full_name ? "full_name-error" : undefined}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage id="full_name-error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="company">Company</FormLabel>
                      <FormControl>
                        <Input 
                          id="company"
                          placeholder="Your company (optional)" 
                          aria-invalid={!!form.formState.errors.company}
                          aria-describedby={form.formState.errors.company ? "company-error" : undefined}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage id="company-error" />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input 
                    id="email"
                    value={user?.email || ""} 
                    disabled 
                    aria-label="Email address (read-only)"
                  />
                  <p className="text-sm text-muted-foreground">You cannot change your email address.</p>
                </FormItem>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                  aria-busy={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
