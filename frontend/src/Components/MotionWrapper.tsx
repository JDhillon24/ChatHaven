import { motion } from "framer-motion";

type props = {
  children: React.ReactNode;
};

//adds basic animation to children element
const MotionWrapper: React.FC<props> = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
