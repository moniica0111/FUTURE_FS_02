import { useEffect, useState } from "react";
import Login from "./Login";

const API_URL = "https://mini-crm-backend-e6y8.onrender.com";

function App() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    if (isLoggedIn) {
      fetchStats();
      fetchLeads();
    }
  }, [isLoggedIn]);

  const fetchStats = () => {
    fetch(`${API_URL}/api/leads/stats/overview`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  };

  const fetchLeads = () => {
    fetch(`${API_URL}/api/leads`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error(err));
  };

  const updateStatus = (id, newStatus) => {
    fetch(`${API_URL}/api/leads/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedLead) => {
        setLeads((prev) =>
          prev.map((lead) => (lead._id === id ? updatedLead : lead))
        );
        fetchStats();
      });
  };

  const deleteLead = (id) => {
    fetch(`${API_URL}/api/leads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      fetchLeads();
      fetchStats();
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Mini CRM Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <hr />

      <h2>Overview</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>Total: {stats?.totalLeads || 0}</div>
        <div>New: {stats?.newLeads || 0}</div>
        <div>Contacted: {stats?.contactedLeads || 0}</div>
        <div>Converted: {stats?.convertedLeads || 0}</div>
      </div>

      <hr />

      <h2>Leads</h2>

      {leads.map((lead) => (
        <div
          key={lead._id}
          style={{
            border: "1px solid #e0e0e0",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <strong>{lead.name}</strong>

          <select
            value={lead.status}
            onChange={(e) => updateStatus(lead._id, e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
          </select>

          <br />
          Email: {lead.email}
          <br />
          Company: {lead.company}

          <br />
          <button onClick={() => deleteLead(lead._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;