import { useEffect, useState } from "react";
  import TopBar from "../components/TopBar";
  import Footer from "../components/Footer";  // ✅ ADD THIS


function Analytics() {
  const [stats, setStats] = useState(null);
  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
fetch(`${API}/analytics`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, [API]);

  if (!stats) return <p>Loading analytics...</p>;

  return (
    <>
      <TopBar />

      <div className="dashboard-page">
        <div className="dashboard-container analytics-container">
          <h2>OCR Analytics</h2>

          <div className="analytics-grid">
            <div className="analytics-card">
              <span>Total Documents</span>
              <h3>{stats.total_documents}</h3>
            </div>

            <div className="analytics-card">
              <span>PDF Files</span>
              <h3>{stats.pdf_files}</h3>
            </div>

            <div className="analytics-card">
              <span>Image Files</span>
              <h3>{stats.image_files}</h3>
            </div>

            <div className="analytics-card highlight">
              <span>Avg OCR Confidence</span>
              <h3>{stats.average_confidence}%</h3>
            </div>

            <div className="analytics-card wide">
              <span>Last Upload</span>
              <h4>{stats.last_upload}</h4>
            </div>
          </div>
        </div>
      </div>
          <Footer />

    </>
  );
}

export default Analytics;
