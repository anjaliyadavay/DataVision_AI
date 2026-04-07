import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/splash.css";

function Splash() {
 const navigate = useNavigate();

  return (
    <div className="auth-wrappers">
      <div className="auth-containers">

        {/* 🔥 PROJECT INFO */}
        <div className="project-info">
          <h1>DataVision AI</h1>
          <p>
            Smart Document Intelligence System that extracts, manages,
            and analyzes document data using AI.
          </p>
        </div>

        {/* 🔥 BUTTONS */}
        <div className="role-switch">
          <button onClick={() => navigate("/login")}>
            Login as User
          </button>

          <button onClick={() => navigate("/admin")}>
            Login as Admin
          </button>
        </div>

      </div>
    </div>
  );
}
export default Splash;
