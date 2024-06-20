import { useLocation, Link } from "react-router-dom";
const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link className="p-1" to={to}>
      <button className={`linksOnHover ${isActive ? "active" : ""}`}>
        <h2>{label}</h2>
      </button>
    </Link>
  );
};
export default NavLink;
