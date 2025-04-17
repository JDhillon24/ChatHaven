import { FaArrowRight } from "react-icons/fa6";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#2bb3c0] py-24">
      <div className="px-5 mx-auto container">
        <div className="section-heading">
          <h2 className="section-title">Ready to Chat?</h2>
          <p className="section-description mt-5">
            Create your account today and explore a seamless, intuitive chat
            experience built for real connection.
          </p>
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-text gap-1">
            <span>Learn more</span>
            <FaArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
