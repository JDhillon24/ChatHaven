import React from "react";
import { motion } from "framer-motion";

type Testimonial = {
  text: string;
  imageSrc: string;
  name: string;
  username: string;
};

const testimonials: Testimonial[] = [
  {
    text: "Group chats used to stress me out. Now I actually look forward to them. It's weirdly peaceful here.",
    imageSrc: "/images/testimonial_avatars/jason.png",
    name: "Jason T.",
    username: "@jasont4342",
  },
  {
    text: "I’ve tried a dozen chat apps, but ChatHaven actually feels personal. Fast, clean, and it just works.",
    imageSrc: "/images/testimonial_avatars/amelia.png",
    name: "Amelia R.",
    username: "@Amelia_R",
  },
  {
    text: "I’ve played in Game 7s, but nothing gets my heart racing like a late-night ChatHaven group chat. Elite platform. Changed the game.",
    imageSrc: "/images/testimonial_avatars/lebron.png",
    name: "LeBron James",
    username: "@kingjames",
  },
  {
    text: "Love that it uses WebSockets. You can tell this wasn’t built by a committee. It’s clean, responsive, and actually fun to use.",
    imageSrc: "/images/testimonial_avatars/rami.png",
    name: "Rami D.",
    username: "@drami42",
  },
  {
    text: "The ability to create group chats in seconds has made my writing team so much more organized.",
    imageSrc: "/images/testimonial_avatars/nina.png",
    name: "Nina L.",
    username: "@nina.writes",
  },
  {
    text: "This app breaks the limits of communication like I break domains. Absolutely limitless.",
    imageSrc: "/images/testimonial_avatars/gojo.png",
    name: "Gojo Satoru",
    username: "@hollowpurple",
  },
  {
    text: "The minimal UI makes it easy to focus on the convo, not the clutter. Super underrated.",
    imageSrc: "/images/testimonial_avatars/james.png",
    name: "James S.",
    username: "@jayfromwork",
  },
  {
    text: "This has become my go-to for messaging friends. Feels personal, fast, and reliable.",
    imageSrc: "/images/testimonial_avatars/ricky.png",
    name: "Ricky T.",
    username: "@thompsonricky_1",
  },
  {
    text: "I don’t usually show my face, but this platform makes opening up feel natural, even for a ninja.",
    imageSrc: "/images/testimonial_avatars/kakashi.png",
    name: "Kakashi Hatake",
    username: "@sharingansensei",
  },
];

const firstColumn: Testimonial[] = testimonials.slice(0, 3);
const secondColumn: Testimonial[] = testimonials.slice(3, 6);
const thirdColumn: Testimonial[] = testimonials.slice(6, 9);

//column of testimonials that infinitely scrolls up
const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => (
  <motion.div
    animate={{
      translateY: "-100%",
    }}
    transition={{
      duration: props.duration || 10,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    }}
    className={props.className}
  >
    <div className="flex flex-col gap-6 pb-6">
      {[...new Array(4)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {props.testimonials.map(
            ({ text, imageSrc, name, username }, index) => (
              <div key={index} className="card">
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  <img
                    src={imageSrc}
                    alt={name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">
                      {name}
                    </div>
                    <div className="leading-5 tracking-tight">{username}</div>
                  </div>
                </div>
              </div>
            )
          )}
        </React.Fragment>
      ))}
    </div>
  </motion.div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="bg-white scroll-mt-[124px]">
      <div className="py-24 x-5 mx-auto container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>
          <h2 className="section-title mt-5">What our users say</h2>
          <p className="section-description mt-5">
            A few words from our most enthusiastic (and definitely real) users.
          </p>
        </div>
        {/* Display certain # of columns with varying scroll speed based on screen size */}
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_25%,transparent)] max-h-[738px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
