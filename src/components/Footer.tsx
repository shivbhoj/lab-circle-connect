import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">LabExchange</h3>
            <p className="text-background/70 leading-relaxed">
              The trusted marketplace for used scientific laboratory equipment. 
              Connecting researchers with quality, certified instruments worldwide.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-background hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Quick Links</h4>
            <ul className="space-y-2 text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Browse Equipment</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Sell Equipment</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Verified Sellers</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Equipment Categories</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Certification Process</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Support</h4>
            <ul className="space-y-2 text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Buyer Protection</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Warranty Info</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-background">Stay Updated</h4>
            <p className="text-background/70">
              Get notified about new equipment, special deals, and industry insights.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Your email" 
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button variant="secondary" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3 text-background/70">
            <Mail className="h-5 w-5" />
            <span>support@labexchange.com</span>
          </div>
          <div className="flex items-center gap-3 text-background/70">
            <Phone className="h-5 w-5" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-3 text-background/70">
            <MapPin className="h-5 w-5" />
            <span>Boston, MA, USA</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-background/70 text-sm">
          <p>&copy; 2024 LabExchange. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-background transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;