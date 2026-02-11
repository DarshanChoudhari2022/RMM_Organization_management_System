import Hero from "@/components/landing/Hero";
import AboutSection from "@/components/landing/AboutSection";
import NavySection from "@/components/landing/NavySection";
import VideoSection from "@/components/landing/VideoSection";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  return (
    <div className="bg-background min-h-screen relative overflow-x-hidden" id="main-content">
      <Hero />
      <AboutSection />
      <NavySection />
      <VideoSection />
      <Footer />
    </div>
  );
};

export default Landing;
