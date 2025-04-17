import React from "react";
import SmallLogo from "../UI/SmallLogo";

const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="px-5 mx-auto container">
        <div className="inline-flex relative before:content-[''] before:top-0 before:bottom-0 before:blur before:h-full before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <SmallLogo classes="w-10 h-10 relative" />
        </div>

        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Testimonials</a>
        </nav>
        <div className="flex justify-center gap-6 mt-6">
          <img src="/images/socials/github.png" alt="GitHub" className="w-10" />
          <img
            src="/images/socials/linkedin.png"
            alt="Linkedin"
            className="w-10"
          />
        </div>
      </div>
      <p className="mt-6">&copy; 2024 ChatHaven, Inc. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
