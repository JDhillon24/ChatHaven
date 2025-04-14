import React from "react";

const ProductShowcase = () => {
  return (
    <section className="bg-gradient-to-b from-[#FFFFFF] to-[#2bb3c0] py-24">
      <div className="px-5 mx-auto container">
        <div className="flex justify-center">
          <div className="tag">Experience real connection</div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tighter bg-gradient-to-b from-black to-ChatBlue text-transparent bg-clip-text mt-5">
          Built to bring people closer with every message
        </h2>
        <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
          Whether you're reconnecting with old friends or starting fresh
          conversations, ChatHaven creates a space where communication feels
          effortless, personal, and genuinely engaging.
        </p>
        <img
          src="/images/desktop_demo.png"
          alt="Desktop Demo"
          className="mt-10"
        />
      </div>
    </section>
  );
};

export default ProductShowcase;
