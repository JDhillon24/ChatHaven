import SmallLogo from "../UI/SmallLogo";

const Footer = () => {
  return (
    <footer
      id="footer"
      className="bg-black text-[#BCBCBC] text-sm py-10 text-center"
    >
      <div className="px-5 mx-auto container">
        {/* Logo with rainbow gradient background */}
        <div className="inline-flex relative before:content-[''] before:top-0 before:bottom-0 before:blur before:h-full before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <SmallLogo classes="w-10 h-10 relative" />
        </div>

        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
        </nav>
        <div className="flex justify-center gap-6 mt-6">
          <a
            href="https://github.com/JDhillon24"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/socials/github.png"
              alt="GitHub"
              className="w-10 cursor-pointer hover:scale-110 transition-all"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/jdhillon24/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/images/socials/linkedin.png"
              alt="Linkedin"
              className="w-10 cursor-pointer hover:scale-110 transition-all"
            />
          </a>
        </div>
      </div>
      <p className="mt-6">&copy; 2025 ChatHaven, Inc. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
