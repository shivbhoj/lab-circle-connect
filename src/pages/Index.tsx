import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedEquipment from "@/components/FeaturedEquipment";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Categories />
      <FeaturedEquipment />
      <TrustSection />
      <Footer />
    </div>
  );
};

export default Index;
