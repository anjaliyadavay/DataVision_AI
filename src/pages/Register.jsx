import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Register() {
  const navigate = useNavigate();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Error messages
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    const newErrors = {};
    if (!name) newErrors.name = "Enter your name";
    if (!email) newErrors.email = "Enter your email";
    if (!password) newErrors.password = "Enter your password";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // stop if errors

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message); // backend error
      } else {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

   return (
    <div className="main-container">

      {/* LEFT IMAGE */}
<div className="auth-left">
  <div className="auth-left-content">
    {/* Biggest line */}
    {/* Slightly smaller */}
    <h2 className="title">Create Your Account</h2>

    {/* Description, can wrap into 2 lines */}
    <p className="description">
      Join thousands of professionals using AI-powered OCR to extract and analyze data instantly. 
      Secure, fast, and effortless.
    </p>
  </div>
</div>



      {/* RIGHT REGISTER FORM */}
      <div className="auth-right">
        <div className="auth-wrapper">
          <h2>Register</h2>

          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

{/* PASSWORD FIELD */}
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

{/* CONFIRM PASSWORD FIELD */}
<div className="form-group password-box">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />
  <span
    className="toggle-btn"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
  {errors.confirmPassword && (
    <p className="error">{errors.confirmPassword}</p>
  )}
</div>


          <button className="auth-btn" onClick={handleRegister}>
            Create Account
          </button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Register;