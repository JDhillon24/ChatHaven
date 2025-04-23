import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section
      id="callToAction"
      className="bg-gradient-to-b from-white to-[#2bb3c0] py-24"
    >
      <div className="px-5 mx-auto container">
        <div className="section-heading">
          <h2 className="section-title">Ready to Chat?</h2>
          <p className="section-description mt-5">
            Create your account today and explore a seamless, intuitive chat
            experience built for real connection.
          </p>
        </div>
        <div className="flex gap-2 mt-10 justify-center">
          <button
            onClick={() => navigate("/Login")}
            className="btn btn-primary"
          >
            Get Started
          </button>
          <a href="#features">
            <button className="btn btn-text gap-1">
              <span>Learn more</span>
              <FaArrowRight className="h-5 w-5" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
