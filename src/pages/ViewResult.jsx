import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
  import Footer from "../components/Footer";  // ✅ ADD THIS


function ViewResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/document/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDoc(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="empty-text">Loading OCR result...</p>;
  }

  if (!doc) {
    return <p className="empty-text">No data found</p>;
  }

  return (
    <>
      <TopBar />

      <div className="dashboard-page">
        <div className="dashboard-container table-container">
          <h2>OCR Result</h2>

          <p className="file-info">
            <b>File:</b> {doc.filename}
          </p>

          {doc.fields && Object.keys(doc.fields).length > 0 ? (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>

              <tbody>
                {Object.entries(doc.fields).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>
                      {Array.isArray(value) ? value.join(", ") : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-text">No extracted data found</p>
          )}

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              className="primary-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
          <Footer />

    </>
  );
}

export default ViewResult;
