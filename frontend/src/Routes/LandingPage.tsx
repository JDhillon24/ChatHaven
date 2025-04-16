import Features from "../Components/LandingPage/Features";
import Header from "../Components/LandingPage/Header";
import Hero from "../Components/LandingPage/Hero";
import ProductShowcase from "../Components/LandingPage/ProductShowcase";
const LandingPage = () => {
  return (
    <>
      <div className="bg-[#f0fcfd]">
        <Header />
        <Hero />
        <ProductShowcase />
        <Features />
      </div>
    </>
  );
};

export default LandingPage;
