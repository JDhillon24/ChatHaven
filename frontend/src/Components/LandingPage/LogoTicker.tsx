import React from "react";

const LogoTicker = () => {
  return (
    <div className="bg-white">
      <p className="section-title">Built With</p>
      <div className="mt-5 py-8 md:py-12">
        <div className="px-5 mx-auto container">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <div className="flex gap-14 flex-none">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoTicker;
