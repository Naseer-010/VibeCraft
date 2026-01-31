import { records } from "../utils/records";

function DoctorPatientView() {
  const publicRecords = records.filter(record => record.visible !== false);

  return (
    <div>
      <h2>Patient Medical History</h2>

      {publicRecords.map((record) => (
        <div
          key={record.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            margin: "10px",
            borderRadius: "8px"
          }}
        >
          <h4>{record.type}</h4>
          <p>Doctor: {record.doctor}</p>
          <p>Date: {record.date}</p>
        </div>
      ))}
    </div>
  );
}

export default DoctorPatientView;
