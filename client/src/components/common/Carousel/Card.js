import { motion } from "framer-motion";

const cardVariant = {
  initial: { x: 0 },
  action: { x: 10, transition: { duration: 0.15 } },
};

export default function Card({ imageUrl }) {
  return (
    <motion.div
      variants={cardVariant}
      initial="initial"
      whileHover="action"
      className="w-48 h-64 mx-auto"
    >
      <div className="rounded-md h-full p-1 bg-black">
        <img
          alt="user_pic"
          src={imageUrl}
          className="inline-block w-full h-full"
        />
      </div>
    </motion.div>
  );
}
