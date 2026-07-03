export default function DashboardHeader() {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      <div>
        <h1 className="page-title">
          Delhi Flood Risk Monitoring Dashboard
        </h1>

        <p className="page-subtitle">
          Real-Time Flood Monitoring and Risk Assessment
        </p>
      </div>

      <div
        style={{
          textAlign: "right",
        }}
      >
        <p
          style={{
            color: "#666",
            fontSize: "14px",
          }}
        >
          Last Updated
        </p>

        <h3>{today}</h3>

        <span
          style={{
            color: "#2E7D32",
            fontWeight: 600,
          }}
        >
          ● System Active
        </span>
      </div>
    </div>
  );
}