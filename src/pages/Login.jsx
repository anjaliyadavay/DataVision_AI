import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";
import { useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../api";




function Login() {
  const navigate = useNavigate();

const location = useLocation();

const from =
  location.state?.from ||
  localStorage.getItem("redirectAfterLogin") ||
  "/dashboard";


  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error messages
  const [errors, setErrors] = useState({});

const handleLogin = async () => {
  const newErrors = {};
  if (!email) newErrors.email = "Enter your email";
  if (!password) newErrors.password = "Enter your password";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    const data = await loginUser({ email, password });

    if (!data) {
      alert("Login failed");
      return;
    }

    if (data.user.role === "admin") {
      alert("Admins must login from the admin login page ❌");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate(from);
    localStorage.removeItem("redirectAfterLogin");

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
};


  // show hidden pass

  const [showPassword, setShowPassword] = useState(false);

     return (
    <div className="main-container">
      {/* LEFT IMAGE */}
      <div className="auth-left">
        <div className="auth-left-content">
    <h1 className="welcome-text">Welcome to DataVision AI</h1>
          {/* <p>Extract data from images & PDFs instantly.</p> */}
      <p>
        Quickly convert documents into structured data with OCR technology. 
        Ideal for businesses and professionals who need fast, accurate results.
      </p>
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="auth-right">
        <div className="auth-wrapper">
          <h2>Welcome</h2>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group password-box">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <span
    className="toggle-btn"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
  {errors.password && <p className="error">{errors.password}</p>}
</div>


          <button className="auth-btn pulse" onClick={handleLogin}>
            Login
          </button>

          <p>
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );


}

export default Login;



// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/main.css";

// function Login() {
//   const navigate = useNavigate();
  
//   // track which form to show: "none", "user", or "admin"
//   const [formType, setFormType] = useState("none"); 

//   // user login state
//   const [userEmail, setUserEmail] = useState("");
//   const [userPassword, setUserPassword] = useState("");
//   const [userErrors, setUserErrors] = useState({});
//   const [showUserPassword, setShowUserPassword] = useState(false);

//   // admin login state
//   const [adminEmail, setAdminEmail] = useState("");
//   const [adminPassword, setAdminPassword] = useState("");

//   // User login handler
//   const handleUserLogin = async () => {
//     const errors = {};
//     if (!userEmail) errors.email = "Enter your email";
//     if (!userPassword) errors.password = "Enter your password";
//     setUserErrors(errors);
//     if (Object.keys(errors).length > 0) return;

//     try {
//       const res = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: userEmail, password: userPassword }),
//       });
//       const data = await res.json();
//       if (!res.ok) return alert(data.message);
//       if (data.user.role === "admin") return alert("Admins must login from admin form ❌");

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   // Admin login handler
//   const handleAdminLogin = async () => {
//     if (!adminEmail || !adminPassword) return alert("Email and password are required");
//     try {
//       const res = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: adminEmail, password: adminPassword }),
//       });
//       const data = await res.json();
//       if (!res.ok) return alert(data.message);
//       if (data.user.role !== "admin") return alert("Not an admin ❌");

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       navigate("/admin-dashboard");
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       {formType === "none" && (
//         <div className="login-choice">
//           <h2>Login</h2>
//           <button onClick={() => setFormType("user")}>Login as User</button>
//           <button onClick={() => setFormType("admin")}>Login as Admin</button>
//         </div>
//       )}

//       {formType === "user" && (
//         <div className="auth-container">
//           <h2>User Login</h2>
//           <input
//             type="email"
//             placeholder="Email"
//             value={userEmail}
//             onChange={(e) => setUserEmail(e.target.value)}
//           />
//           {userErrors.email && <p className="error">{userErrors.email}</p>}

//           <div className="password-box">
//             <input
//               type={showUserPassword ? "text" : "password"}
//               placeholder="Password"
//               value={userPassword}
//               onChange={(e) => setUserPassword(e.target.value)}
//             />
//             <span onClick={() => setShowUserPassword(!showUserPassword)}>
//               {showUserPassword ? "🙈" : "👁️"}
//             </span>
//           </div>
//           {userErrors.password && <p className="error">{userErrors.password}</p>}

//           <button onClick={handleUserLogin}>Login</button>
//           <p>Don’t have an account? <Link to="/register">Register</Link></p>
//           <button onClick={() => setFormType("none")}>Back</button>
//         </div>
//       )}

//       {formType === "admin" && (
//         <div className="auth-container">
//           <h2>Admin Login</h2>
//           <input
//             type="email"
//             placeholder="Email"
//             value={adminEmail}
//             onChange={(e) => setAdminEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={adminPassword}
//             onChange={(e) => setAdminPassword(e.target.value)}
//           />
//           <button onClick={handleAdminLogin}>Login</button>
//           <button onClick={() => setFormType("none")}>Back</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Login;

