import React from "react";
import { Link } from "react-router-dom";

const Header = ({ children }) => {
  return (
    <div>
      <h1>Event Registration Application</h1>
      <div>
        <h3 className="Header-Links">
          <Link to="/">Events</Link>
        </h3>
        <h3>
          <Link to="/create">Create Event</Link>
        </h3>
      </div>
      {children}
    </div>
  );
};

export default Header;
