import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";  // ✅ ADD THIS
import "../styles/result.css";



function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");


  const navigate = useNavigate();

  const fetchDocuments = (searchQuery = "") => {
  setLoading(true);

  fetch(`http://127.0.0.1:5000/documents?search=${searchQuery}`)
    .then((res) => res.json())
    .then((data) => {
      setDocuments(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
};


  useEffect(() => {
    fetchDocuments();
  }, []);

  

  /* ---------- DELETE SINGLE ---------- */
  const deleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    await fetch(`http://127.0.0.1:5000/document/${id}`, {
      method: "DELETE",
    });

    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  /* ---------- DELETE ALL ---------- */
  const deleteAllDocuments = async () => {
    if (!window.confirm("⚠️ This will delete ALL documents. Continue?")) return;

    await fetch("http://127.0.0.1:5000/documents", {
      method: "DELETE",
    });

    setDocuments([]);
  };

  useEffect(() => {
  const delay = setTimeout(() => {
    fetchDocuments(search);
  }, 400);

  return () => clearTimeout(delay);
}, [search]);



const highlightText = (text, search) => {
  if (!search) return text;

  const regex = new RegExp(`(${search})`, "gi");

  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        style={{
          background: "linear-gradient(135deg, #facc15, #fde68a)",
          color: "#000",
          padding: "2px 6px",
          borderRadius: "5px",
          fontWeight: "600"
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};


const filteredDocuments = documents.filter((doc) => {
  const formattedDate = new Date(doc.created_at).toLocaleString();
  const isoDate = new Date(doc.created_at).toISOString();

  const text = `
    ${doc.filename} 
    ${formattedDate}
    ${isoDate}
  `.toLowerCase();

  return text.includes(search.toLowerCase());
});





  

  return (
    <>
      <TopBar />

      <div className="dashboard-page">
        <div className="dashboard-container table-container">
          <div className="table-header">
            <h2>Upload History</h2>


            {documents.length > 0 && (
              <button className="danger-btn" onClick={deleteAllDocuments}>
                Delete All
              </button>
            )}
          </div>

          {/* SEARCH BELOW */}
  <input
    type="text"
    placeholder=" Search documents..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="search-input"
  />

{loading ? (
  <p className="empty-text">Loading history...</p>

) : documents.length === 0 ? (
  // 👉 CASE 1: No data at all
  <p className="empty-text">No documents uploaded yet</p>

) : filteredDocuments.length === 0 ? (
  // 👉 CASE 2: Search but no match
  <p className="empty-text">
    No results found for "<b>{search}</b>"
  </p>

) : (
  // 👉 CASE 3: Show table
  <table className="dashboard-table">
    <thead>
      <tr>
        <th>Filename</th>
        <th>Upload Date</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredDocuments.map((doc) => (
        <tr key={doc.id}>
          <td>{highlightText(doc.filename, search)}</td>
<td>
  {highlightText(
    new Date(doc.created_at).toLocaleString(),
    search
  )}
</td>
          <td className="action-cell">
            <button
              className="primary-btn"
              onClick={() => navigate(`/view/${doc.id}`)}
            >
              View
            </button>

            <button
              className="danger-btn small"
              onClick={() => deleteDocument(doc.id)}
            >
              Delete
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

export default Documents;
