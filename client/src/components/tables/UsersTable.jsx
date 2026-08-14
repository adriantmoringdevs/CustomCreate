import { useState, useEffect } from "react";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Error loading users:", err);
        setError("Couldn't load users.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="table-wrapper">Loading...</div>;
  if (error) return <div className="table-wrapper">{error}</div>;

  return (
    <div className="table-wrapper">
      <h1>Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="expand">
                Username
              </th>
              <th scope="col">Role</th>
              <th scope="col">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.username}</th>
                <td>
                  <span
                    className={`badge badge-${(user.role || "").toLowerCase()}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersTable;
