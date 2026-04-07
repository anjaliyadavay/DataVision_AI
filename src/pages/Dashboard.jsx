import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import { FaUpload } from "react-icons/fa";

import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  
    // Redirect if not logged in OR if admin
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login"); // not logged in
  //   } else if (user.role === "admin") {
  //     navigate("/admin-dashboard"); // admin should not see user dashboard
  //   }
  // }, [navigate, user]);

  useEffect(() => {
  if (user?.role === "admin") {
    navigate("/admin-dashboard");
  }
}, [navigate, user]);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Fetch history from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/documents")
      .then((res) => res.json())
      .then((data) => setDocs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <TopBar />

      <div className="dashboard-page">
        <div className="dashboard-container">
          <h2>Dashboard</h2>

          <hr />

          {/* Upload History */}
          <h3>Upload History</h3>

          {docs.length === 0 ? (
            <div className="empty-state">
              <h3>No documents uploaded yet</h3>
              <p>Upload your first document</p>

              <button
                className="primary-btn"
                // onClick={() => navigate("/upload")}
                onClick={() => navigate("/upload")}

              >
                <FaUpload /> Upload Document
              </button>
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Uploaded At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.filename}</td>
                    <td>{doc.created_at}</td>
                    <td>
                      <button
                        className="reprocess-btn"
                        onClick={() =>
                          fetch(`http://127.0.0.1:5000/document/${doc.id}`)
                            .then((res) => res.json())
                            .then((data) =>
                              navigate("/result", {
                                state: {
                                  id: doc.id,
                                  filename: data.filename,
                                  fields: data.fields,
                                  raw_text: data.raw_text,
                                },
                              }),
                            )
                            .catch((err) => console.error(err))
                        }
                      >
                        Reprocess
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Dashboard;
