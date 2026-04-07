import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
  import Footer from "../components/Footer";  // ✅ ADD THIS

import "../styles/result.css";


function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data || !data.raw_text) {
    return (
      <>
        <TopBar />
        <div className="dashboard-page">
          <div className="dashboard-container result-container">
            <h2>No extracted data found</h2>
            <button className="primary-btn" onClick={() => navigate("/upload")}>
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />

      <div className="dashboard-page">
        <div className="dashboard-container result-container">
          <h2>OCR Result</h2>

          <div className="ocr-box">
            <h4>Raw OCR Output</h4>

            <pre>{data.raw_text}</pre>
          </div>

          <div className="result-actions">
            <button
              className="secondary-btn"
              onClick={() => navigate("/upload")}
            >
              Upload Another
            </button>

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/table", {
                  state: {
                    id: data.id,
                    filename: data.filename,
                    fields: data.fields,
                  },
                })
              }
            >
              View in Table
            </button>
          </div>
        </div>
      </div>
          <Footer />

    </>
  );
}

export default Result;
