import Sidebar from "./Sidebar";
import WalletConnect from "./WalletConnect";

function DashboardLayout({ role, title, children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main content */}
      <div style={{ flex: 1, padding: "30px" }}>
        
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
          }}
        >
          <h1>{title}</h1>
          <WalletConnect />
        </div>

        {/* Page content */}
        {children}

      </div>
    </div>
  );
}

export default DashboardLayout;
