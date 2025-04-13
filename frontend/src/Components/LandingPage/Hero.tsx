import React from "react";

const Hero = () => {
  return (
    <section>
      <div className="px-5 mx-auto container">
        <div>
          <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
            The wait is over
          </div>
          <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-ChatBlue text-transparent bg-clip-text mt-6">
            Say hello to ChatHaven
          </h1>
          <p className="text-xl text-[#010D3E] tracking-tight mt-6">
            Tired of clunky chat apps that just don’t feel right? ChatHaven is
            built for smoother conversations, cleaner design, and a space that
            feels more like home. Jump in and see how easy staying connected can
            be.
          </p>
          <div className="flex gap-1 items-center mt-[30px]">
            <button>Get started</button>
            <button>Learn more</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
