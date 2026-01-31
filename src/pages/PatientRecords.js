import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import TimelineCard from "../components/TimelineCard";
import { records as initialRecords } from "../utils/records";

function PatientRecords() {
  const [records, setRecords] = useState(
    initialRecords.map((r) => ({ ...r, visible: true }))
  );

  const toggleVisibility = (id) => {
    const updated = records.map((record) =>
      record.id === id
        ? { ...record, visible: !record.visible }
        : record
    );
    setRecords(updated);
  };

  return (
    <DashboardLayout role="patient" title="My Medical Records">
      {records.length === 0 ? (
        <p>No medical records found.</p>
      ) : (
        records.map((record) => (
          <TimelineCard
            key={record.id}
            type={record.type}
            doctor={record.doctor}
            date={record.date}
            visible={record.visible}
          />
        ))
      )}
    </DashboardLayout>
  );
}

export default PatientRecords;
