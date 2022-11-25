import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SearchBar({ closeModal }) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const changeInputHandler = e => {
    setInput(e.target.value);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 w-screen h-screen">
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
            placeholder="원하시는 포스트를 검색해보세요."
            className="my-3 px-6 py-3 w-1/3 border-2 border-slate-600 rounded-md focus:outline-none hover:bg-slate-100"
          />

          <button className="hover:scale-110" onClick={() => closeModal(false)}>
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
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
    </div>
  );
}
