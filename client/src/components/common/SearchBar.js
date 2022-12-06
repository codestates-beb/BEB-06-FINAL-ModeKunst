import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const searchbarVar = {
  enter: { opacity: 0, width: 0 },
  visible: { opacity: 1, width: "100%" },
  invisible: {
    opacity: 0,
    x: window.innerWidth,
    transition: { duration: 0.2 },
  },
};

export default function SearchBar({ closeModal, innerRef }) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const changeInputHandler = e => {
    setInput(e.target.value);
  };

  return (
    <motion.div
      variants={searchbarVar}
      initial="enter"
      animate="visible"
      exit="invisible"
      ref={innerRef}
      className="fixed top-0 right-0 bottom-0 left-0 w-screen h-screen"
    >
      <div
        onClick={() => closeModal(false)}
        className="fixed top-0 right-0 bottom-0 left-0 w-screen h-screen bg-black opacity-50"
      />
      <div className="absolute bg-white w-full">
        <div className="flex justify-center items-center space-x-2">
          <button
            className="hover:scale-105"
            onClick={() => {
              navigate(`/search/${input}`);
              closeModal(false);
            }}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-slate-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
          <input
            type="text"
            onChange={changeInputHandler}
            className="w-1/2 my-4 px-3 py-0.5 border-b-2 border-b-slate-600 focus:border-b-[3px] focus:outline-none tablet:my-8"
          />
          <button className="hover:scale-110" onClick={() => closeModal(false)}>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
