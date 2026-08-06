import React, { useState } from "react";
import Dropdown from "./DropdownContainer/Dropdown/Dropdown";
import { useNavigate } from "react-router-dom";
import DropdownItem from "./DropdownContainer/DropdownItem/DropdownItem";

function SignupForm({ signup, isLoading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await signup(username, password, role);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  function handleRoleChange(role) {
    setRole(role);
  }

  const roles = ["MANAGER", "EMPLOYEE"];

  return (
    <>
      <h2 className="auth-title">Create an account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <label>Role</label>
        <Dropdown
          buttonText={role || "Select a role"}
          content={
            <>
              {roles.map((role, id) => (
                <DropdownItem key={id} onClick={() => handleRoleChange(role)}>{`${role}`}</DropdownItem>
              ))}
            </>
          }
        />

        <button type="submit">{isLoading ? "Loading..." : "Sign Up"}</button>

        {error && <p>{error}</p>}
      </form>
    </>
  );
}

export default SignupForm;
