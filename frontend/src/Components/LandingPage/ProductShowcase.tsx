const ProductShowcase = () => {
  return (
    <section className="bg-gradient-to-b from-[#f0fcfd] to-[#2bb3c0] py-24">
      <div className="px-5 mx-auto container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Experience real connection</div>
          </div>
          <h2 className="section-title mt-5">
            Built to bring people closer with every message
          </h2>
          <p className="section-description mt-5">
            Whether you're reconnecting with old friends or starting fresh
            conversations, ChatHaven creates a space where communication feels
            effortless, personal, and genuinely engaging.
          </p>
        </div>
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
