import { useEffect, useState } from "react";

function App() {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    company: "",
  });

  const API = "https://mini-crm-backend-e6y8.onrender.com";

  useEffect(() => {
    fetchStats();
    fetchLeads();
  }, []);

  const fetchStats = () => {
    fetch(`${API}/api/leads/stats/overview`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  };

  const fetchLeads = () => {
    fetch(`${API}/api/leads`)
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error(err));
  };

  const addLead = () => {
    fetch(`${API}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLead),
    })
      .then((res) => res.json())
      .then(() => {
        setNewLead({ name: "", email: "", company: "" });
        fetchLeads();
        fetchStats();
      });
  };

  const deleteLead = (id) => {
    fetch(`${API}/api/leads/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetchLeads();
      fetchStats();
    });
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
      <h1>Mini CRM Dashboard</h1>

      <hr />

      <h2>Add Lead</h2>
      <input
        placeholder="Name"
        value={newLead.name}
        onChange={(e) =>
          setNewLead({ ...newLead, name: e.target.value })
        }
      />
      <input
        placeholder="Email"
        value={newLead.email}
        onChange={(e) =>
          setNewLead({ ...newLead, email: e.target.value })
        }
      />
      <input
        placeholder="Company"
        value={newLead.company}
        onChange={(e) =>
          setNewLead({ ...newLead, company: e.target.value })
        }
      />
      <button onClick={addLead}>Add</button>

      <hr />

      <h2>Overview</h2>
      <div>
        Total: {stats?.totalLeads || 0} | New:{" "}
        {stats?.newLeads || 0} | Contacted:{" "}
        {stats?.contactedLeads || 0} | Converted:{" "}
        {stats?.convertedLeads || 0}
      </div>

      <hr />

      <h2>Leads</h2>

      {leads.map((lead) => (
        <div
          key={lead._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>{lead.name}</strong> ({lead.status})
          <br />
          {lead.email}
          <br />
          {lead.company}
          <br />
          <button onClick={() => deleteLead(lead._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;