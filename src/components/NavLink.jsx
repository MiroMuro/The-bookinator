import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
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
NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
export default NavLink;
