import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="nav">
  <div className="nav-left">
    <Link to="/">Feed</Link>
    <Link to="/profile">Profile</Link>
  </div>
  <button onClick={logout}>Logout</button>
</nav>

  );
}
