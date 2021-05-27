import React from "react";

const Calendar = ({ handleLogout }) => {
  return (
    <section>
      <nav>
        <h2>Welcome :D</h2>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </section>
  );
};

export default Calendar;
