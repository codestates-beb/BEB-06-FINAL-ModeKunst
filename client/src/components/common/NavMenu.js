import { Link } from "react-router-dom";

export default function NavMenu({ to, section, handler }) {
  return (
    <li
      onClick={handler}
      className="px-1.5 hover:scale-110 cursor-pointer tablet:text-xl"
    >
      <Link to={`${to}`}>{section}</Link>
    </li>
  );
}
