import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
const NavLink = ({ to, label, dataTest }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link data-test={dataTest} className="p-1" to={to}>
      <button className={`linksOnHover ${isActive ? "active" : ""}`}>
        <h2>{label}</h2>
      </button>
    </Link>
  );
};
NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  dataTest: PropTypes.string,
};
export default NavLink;
