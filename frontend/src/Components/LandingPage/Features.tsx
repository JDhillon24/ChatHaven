import { FaPaperPlane } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

type FeatureTypes = {
  title: string;
  popular: boolean;
  inverse: boolean;
  description: string;
  Icon: IconType;
};

const featureCards: FeatureTypes[] = [
  {
    title: "Effortless Chat",
    popular: false,
    inverse: false,
    description:
      "Experience smooth, real-time messaging powered by WebSockets. No refreshes, no delays. Our responsive chat interface keeps conversations flowing without distractions, no matter your device.",
    Icon: FaPaperPlane,
  },
  {
    title: "Friends & Groups",
    popular: true,
    inverse: true,
    description:
      "Connect effortlessly by adding friends, chatting one-on-one, or starting dynamic group chats. Real-time syncing means everyone stays on the same page as messages roll in, whether you're talking to one person or ten.",
    Icon: FaUserFriends,
  },
  {
    title: "Private by Design",
    popular: false,
    inverse: false,
    description:
      "Your chats stay between you and those you trust. Secure cookie-based sessions, protected routes, and token refresh handling all work together to keep your data private just like it should be.",
    Icon: IoShieldCheckmark,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white scroll-mt-[124px]">
      <div className="px-5 mx-auto container">
        <div className="section-heading">
          <h2 className="section-title">Features</h2>
          <p className="section-description mt-5">
            All the tools you need to chat, connect, and keep the conversation
            going.
          </p>
        </div>
        <div className="flex flex-col gap-6 items-center mt-10 lg:flex-row lg:items-end lg:justify-center">
          {featureCards.map(
            ({ title, popular, inverse, description, Icon }) => (
              <div
                className={twMerge(
                  "card",
                  inverse === true && "border-black bg-black text-white/60"
                )}
              >
                <div
                  className={twMerge(
                    "flex justify-between items-center",
                    popular === false && "justify-center"
                  )}
                >
                  <h3
                    className={twMerge(
                      "text-lg font-bold text-black/50 tracking-tight",
                      inverse === true && "text-white/60"
                    )}
                  >
                    {title}
                  </h3>
                  {popular && (
                    <div className="inline-flex items-center text-sm px-4 py-1.5 rounded-xl border border-white/20">
                      <motion.span
                        animate={{
                          backgroundPositionX: "-100%",
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                          repeatType: "loop",
                        }}
                        className="bg-[linear-gradient(to_right,#DD7DDF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#E1CD86,#BBCB92,#71C2EF,#3BFFFF,#DD7DDF)] [background-size:200%] text-transparent bg-clip-text font-medium"
                      >
                        Social
                      </motion.span>
                    </div>
                  )}
                </div>
                <p className="text-md inline-flex items-center justify-center tracking-tight text-center">
                  {description}
                </p>
                <div className="flex justify-center">
                  <div className="inline-flex mt-5 p-3">
                    {<Icon className="text-ChatBlue" size={36} />}
                  </div>
                </div>
              </div>
            )
          )}
          <div>
            <h3></h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
