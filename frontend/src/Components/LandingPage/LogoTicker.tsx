import { motion } from "framer-motion";

// infinitely scrolls through tech stack logos
const LogoTicker = () => {
  return (
    <div className="bg-white">
      <p className="section-title">Built With</p>
      <div className="mt-5 py-8 md:py-12">
        <div className="px-5 mx-auto container">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <motion.div
              className="flex gap-32 flex-none pr-32"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop",
              }}
            >
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/MongoDB_Logo.png"
                alt="MongoDB Logo"
              />
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/Expressjs_Logo.png"
                alt="ExpressJS Logo"
              />
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/React_Logo.png"
                alt="React + TS Logo"
              />
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/Nodejs_Logo.png"
                alt="NodeJS Logo"
              />
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/Tailwind_Logo.png"
                alt="TailwindCSS Logo"
              />

              <img
                className="logo-ticker-image"
                src="/images/stack_logos/MongoDB_Logo.png"
                alt="MongoDB Logo"
              />
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/Expressjs_Logo.png"
                alt="ExpressJS Logo"
              />
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/React_Logo.png"
                alt="React + TS Logo"
              />
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/Nodejs_Logo.png"
                alt="NodeJS Logo"
              />
              <img
                className="logo-ticker-image"
                src="/images/stack_logos/Tailwind_Logo.png"
                alt="TailwindCSS Logo"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
