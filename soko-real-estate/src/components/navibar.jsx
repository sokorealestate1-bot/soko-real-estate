import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo} alt="SOKO Logo" className="logo" />
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Buy</li>
        <li>Rent</li>
        <li>Land</li>
        <li>Agents</li>
        <li>Contact</li>
      </ul>

      <div className="nav-buttons">
        <button className="login-btn">Login</button>
        <button className="post-btn">Post Property</button>
      </div>
    </nav>
  );
}

export default Navbar;