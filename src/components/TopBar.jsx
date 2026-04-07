import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const TopBar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const profileImg = localStorage.getItem("profileImg");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* CLICK OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>

    <style>{`
  .auth-buttons {
    display: flex;
    gap: 10px;
  }

  .login-btn {
    background: transparent;
    border: 1px solid #6366f1;
    color: #6366f1;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
  }

  .login-btn:hover {
    background: #6366f1;
    color: white;
  }

  .signup-btn {
    background: #6366f1;
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
  }

  .signup-btn:hover {
    background: #4f46e5;
  }
`}</style>

    <header className="topbar">
      {/* LEFT */}
      <div className="topbar-left">
        <img src={logo} alt="logo" className="topbar-logo" />
        <span className="topbar-title">DataVision AI</span>
      </div>

      {/* CENTER MENU ⭐ */}
      <div className="topbar-menu">
        <span onClick={() => navigate("/dashboard")}>Dashboard</span>
        <span onClick={() => navigate("/upload")}>Upload</span>
        <span onClick={() => navigate("/documents")}>Documents</span>
        <span onClick={() => navigate("/analytics")}>Analytics</span>
        
      </div>

      {/* RIGHT */}
      <div className="topbar-right" ref={dropdownRef}>
        {/* <div
          className="topbar-profile"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="topbar-avatar">
            {profileImg ? (
              <img src={profileImg} alt="profile" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <span className="topbar-name">{user?.name}</span>
        </div> */}
{!user ? (
  <div className="auth-buttons">
    <button
      className="login-btn"
      onClick={() => navigate("/login")}
    >
      Login
    </button>

    <button
      className="signup-btn"
      onClick={() => navigate("/register")}
    >
      Sign Up
    </button>
  </div>
) : (
  <div
    className="topbar-profile"
    onClick={() => setOpen((prev) => !prev)}
  >
    <div className="topbar-avatar">
      {profileImg ? (
        <img src={profileImg} alt="profile" />
      ) : (
        user.name.charAt(0).toUpperCase()
      )}
    </div>
    <span className="topbar-name">{user.name}</span>
  </div>
)}

{open && user && (
          <div className="profile-dropdown">
            <div className="profile-info">
              <div className="avatar-lg">
                {profileImg ? (
                  <img src={profileImg} alt="profile" />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4>{user?.name}</h4>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="divider"></div>

            <button className="logout-btn" onClick={handleLogout}>
              🔒 Logout
            </button>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default TopBar;
