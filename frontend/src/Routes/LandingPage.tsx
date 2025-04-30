import CallToAction from "../Components/LandingPage/CallToAction";
import Features from "../Components/LandingPage/Features";
import Footer from "../Components/LandingPage/Footer";
import Header from "../Components/LandingPage/Header";
import Hero from "../Components/LandingPage/Hero";
import LogoTicker from "../Components/LandingPage/LogoTicker";
import ProductShowcase from "../Components/LandingPage/ProductShowcase";
import Testimonials from "../Components/LandingPage/Testimonials";
import { motion } from "framer-motion";
const LandingPage = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        className="bg-[#f0fcfd]"
      >
        <Header />
        <Hero />
        <ProductShowcase />
        <Features />
        <LogoTicker />
        <Testimonials />
        <CallToAction />
        <Footer />
      </motion.div>
    </>
  );
};

export default LandingPage;
