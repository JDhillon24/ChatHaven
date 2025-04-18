import { FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#2bb3c0,#f0fcfd_66%)]">
      <div className="px-5 mx-auto container">
        <div className="md:flex items-center">
          <div className="md:w-96 lg:w-full">
            <div className="tag">The wait is over</div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-ChatBlue text-transparent bg-clip-text mt-6">
              Say hello to ChatHaven
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Tired of clunky chat apps that just don’t feel right? ChatHaven is
              built for smoother conversations, cleaner design, and a space that
              feels more like home. Jump in and see how easy staying connected
              can be.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-text gap-1">
                <span>Learn more</span>
                <FaArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 h-[648px] md:flex-1 flex items-center">
            <motion.img
              className="md:h-full md:w-auto md:max-w-none"
              src="/images/mobile_demo-left.png"
              alt="mobile demo"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
