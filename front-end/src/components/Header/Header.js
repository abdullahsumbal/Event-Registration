import React from "react";
import { Link } from "react-router-dom";

const Header = ({ children }) => {
  return (
    <div>
      <h1>Event Registration Application</h1>
      <div style={{ display: "inline-block", width: 400 }}>
        <h3 className="Header-Links">
          <Link to="/">Events </Link>
        </h3>
        <h3>
          <Link to="/create">Create Event</Link>
        </h3>
        <h3>
          <Link to="/login">Login</Link>
        </h3>
        <h3>
          <Link to="/signup">Sign Up</Link>
        </h3>
      </div>
      <hr />
      {children}
    </div>
  );
};

export default Header;
