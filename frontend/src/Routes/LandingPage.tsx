import CallToAction from "../Components/LandingPage/CallToAction";
import Features from "../Components/LandingPage/Features";
import Footer from "../Components/LandingPage/Footer";
import Header from "../Components/LandingPage/Header";
import Hero from "../Components/LandingPage/Hero";
import LogoTicker from "../Components/LandingPage/LogoTicker";
import ProductShowcase from "../Components/LandingPage/ProductShowcase";
import Testimonials from "../Components/LandingPage/Testimonials";
const LandingPage = () => {
  return (
    <>
      <div className="bg-[#f0fcfd]">
        <Header />
        <Hero />
        <ProductShowcase />
        <Features />
        <LogoTicker />
        <Testimonials />
        <CallToAction />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
