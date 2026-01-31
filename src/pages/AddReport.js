import { useState } from "react";

function AddReport() {
  const [type, setType] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Report submitted (frontend demo)");
  };

  return (
    <div>
      <h2>Add Medical Report</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Report Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <br /><br />

        <textarea
          placeholder="Doctor Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <br /><br />

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}

export default AddReport;
