import SmallLogo from "../UI/SmallLogo";
import { FaArrowRight } from "react-icons/fa6";
import { PiListDashesBold } from "react-icons/pi";

const Header = () => {
  return (
    <header className="sticky top-0">
      <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
        <p className="text-white/60 hidden md:block">
          Real-time messaging without the extra noise
        </p>
        <div className="inline-flex gap-1 items-center">
          <p>Get started</p>
          <FaArrowRight className="h-4 w-4 inline-flex justify-center items-center" />
        </div>
      </div>
      <div className="py-5">
        <div className="px-5 mx-auto container">
          <div className="flex items-center justify-between">
            <SmallLogo classes="w-10 h-10" />
            <PiListDashesBold className="h-5 w-5 md:hidden" />
            <nav className="hidden md:flex gap-6 text-black/60 items-center">
              <a href="#">Home</a>
              <a href="#">Features</a>
              <a href="#">How It Works</a>
              <a href="#">About</a>
              <a href="#">Testimonials</a>
              <a href="#">Contact</a>
              <button className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex align-items justify-center tracking-tight">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
