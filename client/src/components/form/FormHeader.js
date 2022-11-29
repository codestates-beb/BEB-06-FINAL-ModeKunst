import { useNavigate } from "react-router-dom";

function FormHeader({ title }) {
  const navigate = useNavigate();

  return (
    <div className="w-full relative mb-10 tablet:w-3/5 tablet:mb-20 desktop:w-1/2 desktop:mb-24">
      <button
        className="p-1 absolute top-2 left-0"
        onClick={() => navigate(-1)}
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 tablet:w-5 tablet:h-5 desktop:w-6 desktop:h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>
      <h1 className="text-3xl font-title text-center tablet:text-4xl desktop:text-5xl">
        {title}
      </h1>
    </div>
  );
}

export { FormHeader };
