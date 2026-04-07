import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer"; // ✅ ADD THIS
import { FaDownload, FaPlus } from "react-icons/fa";


import "../styles/result.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function TableView() {

  const API = import.meta.env.VITE_API_URL;
const location = useLocation();

const [state, setState] = useState(() => {
  if (location.state) return location.state;

  const saved = localStorage.getItem("tableData");
  return saved ? JSON.parse(saved) : null;
});


  if (!state || !state.fields || !state.id) {
    return <h2>No data to display</h2>;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  const docId = state.id;

  const navigate = useNavigate();
// const location = useLocation(); 

  const [rows, setRows] = useState(
    Object.entries(state.fields).map(([key, value]) => ({
      field: key,
      value: Array.isArray(value) ? value.join(", ") : value,
      isEditing: false,
      tempValue: "",
    })),
  );

  const [showModal, setShowModal] = useState(false);

  /* ---------- SAVE ---------- */
  const saveEdit = async (index) => {
    const updated = [...rows];
    updated[index].value = updated[index].tempValue;
    updated[index].isEditing = false;
    setRows(updated);

    const updatedFields = {};
    updated.forEach((r) => (updatedFields[r.field] = r.value));

    await fetch(`${API}/update/${docId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: updatedFields }),
    });
  };

  const deleteRow = async (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);

    const fields = {};
    updated.forEach((r) => (fields[r.field] = r.value));

    await fetch(`${API}/update/${docId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
  };

  /* ---------- DOWNLOAD ---------- */
  const downloadCSV = () => {
    const csv = [
      "Field,Value",
      ...rows.map((r) => `"${r.field}","${r.value}"`),
    ].join("\n");

    downloadFile(csv, "ocr_result.csv", "text/csv");
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text("OCR Extracted Data", 10, 10);
    let y = 20;

    rows.forEach((r) => {
      pdf.text(`${r.field}: ${r.value}`, 10, y);
      y += 8;
    });

    pdf.save("ocr_result.pdf");
    setShowModal(false);
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      rows.map((r) => ({ Field: r.field, Value: r.value })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OCR Data");
    XLSX.writeFile(wb, "ocr_result.xlsx");
    setShowModal(false);
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setShowModal(false);
  };

  // add new filed

  const [newField, setNewField] = useState({
    field: "",
    value: "",
  });

  const addField = async () => {
    if (!newField.field || !newField.value) return;

    if (!docId) {
      console.error("Document ID missing ❌");
      return;
    }

    // 🔴 PREVENT DUPLICATE FIELD NAMES
    const exists = rows.some(
      (r) =>
        r.field.toLowerCase().trim() === newField.field.toLowerCase().trim(),
    );

    if (exists) {
      alert("Field already exists!");
      return;
    }

    const updated = [
      ...rows,
      {
        field: newField.field,
        value: newField.value,
        isEditing: false,
        tempValue: "",
      },
    ];

    setRows(updated);

    const updatedFields = {};
    updated.forEach((r) => {
      updatedFields[r.field] = r.value;
    });

    try {
      const res = await fetch(`${API}/update/${docId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: updatedFields }),
      });

      const data = await res.json();
      console.log("Updated:", data);
    } catch (err) {
      console.error("Error:", err);
    }

    setNewField({ field: "", value: "" });
    setShowAddModal(false);
  };

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <TopBar />

      <div className="dashboard-page">
        <div className="dashboard-container table-container">
          <h2>Extracted Data</h2>
          <p className="file-name">
            <b>File:</b> {state.filename}
          </p>
          <div className="table-glass">
            <table className="dashboard-table-modern">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.field}</td>

                    <td>
                      {row.isEditing ? (
                        <input
                          className="edit-input"
                          value={row.tempValue}
                          onChange={(e) => {
                            const updated = [...rows];
                            updated[index].tempValue = e.target.value;
                            setRows(updated);
                          }}
                        />
                      ) : (
                        row.value
                      )}
                    </td>

                    <td className="action-cell">
                      {row.isEditing ? (
                        <>
                          <button
                            className="save-btn"
                            onClick={() => saveEdit(index)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? { ...r, isEditing: false } : r,
                                ),
                              )
                            }
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="icon-btn edit-btn"
                            onClick={() =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index
                                    ? {
                                        ...r,
                                        isEditing: true,
                                        tempValue: r.value,
                                      }
                                    : r,
                                ),
                              )
                            }
                            title="Edit"
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="icon-btn delete-btn"
                            onClick={() => deleteRow(index)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

<div className="download-section">
  <button
    className="primary-btn"
    // onClick={() => setShowAddModal(true)}
    onClick={() => {
  if (!user) {
          alert("⚠️ Please login to add a new field."); // <-- alert

  localStorage.setItem("redirectAfterLogin", location.pathname);

// 🔥 SAVE DATA
localStorage.setItem("tableData", JSON.stringify(state));

navigate("/login");

  return;
}

  setShowAddModal(true);
}}

  >
    <FaPlus /> Add Field
  </button>

  <button
    className="primary-btn"
    // onClick={() => setShowModal(true)}
   onClick={() => {
  if (!user) {
          alert("⚠️ Please login to Download."); // <-- alert

   localStorage.setItem("redirectAfterLogin", location.pathname);

// 🔥 SAVE DATA
localStorage.setItem("tableData", JSON.stringify(state));

navigate("/login");

    return;
  }
  setShowModal(true);
}}


  >
    <FaDownload /> Download
  </button>
</div>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="download-modal">
            <h3>Select Download Format</h3>

            <button onClick={downloadCSV}>📊 CSV</button>
            <button onClick={downloadExcel}>📘 Excel</button>
            <button onClick={downloadPDF}>📄 PDF</button>

            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="download-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Field</h3>

            <input
              type="text"
              placeholder="Field Name"
              value={newField.field}
              onChange={(e) =>
                setNewField({ ...newField, field: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Value"
              value={newField.value}
              onChange={(e) =>
                setNewField({ ...newField, value: e.target.value })
              }
            />

            <button onClick={addField}>+ Add Field</button>

            <button
              className="cancel-btn"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default TableView;
