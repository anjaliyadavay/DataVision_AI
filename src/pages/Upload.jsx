import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import TopBar from "../components/TopBar";
  import Footer from "../components/Footer";  // ✅ ADD THIS




function Upload() {

  const PY_API = import.meta.env.VITE_PYTHON_API_URL;

  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${PY_API}/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.status === 409) {
      alert("⚠️ Duplicate file detected");
      return;
    }

    if (!response.ok) {
      alert("Upload failed");
      return;
    }

    const data = await response.json();
    alert("✅ File uploaded successfully!");

    navigate("/result", {
      state: {
        id: data.id,
        filename: data.filename,
        raw_text: data.raw_text,
        fields: data.fields,
      },
    });
  };

  return (

    <>
      <TopBar />

      <div className="dashboard-page">
      <div className="upload-card">
        <h2>📄 Upload Document</h2>
        <p className="upload-subtitle">
          Upload PDF or Image to extract data using AI
        </p>

        <label className="file-box">
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <span>
            {file ? file.name : "Click to choose file"}
          </span>
        </label>

        <button className="upload-btn" onClick={handleUpload}>
          Upload & Process
        </button>
      </div>

    </div>
        <Footer />

        </>

  );
}

export default Upload;
