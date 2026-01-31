function Layout({ title, children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#1e293b",
        color: "white",
        padding: "20px"
      }}>
        <h2>HealthChain</h2>
        <p style={{ marginTop: "30px" }}>Dashboard</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px" }}>
        <h1>{title}</h1>
        <div style={{ marginTop: "20px" }}>
          {children}
        </div>
      </div>

    </div>
  );
}

export default Layout;
