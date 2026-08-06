// import { Button, Error, FormField, Input, Label, Textarea } from "../styles";
import React, { useState } from "react";
import Dropdown from "./Dropdown/Dropdown";
import { useNavigate } from "react-router-dom"
import DropDownItem from "./DropdownItem/DropdownItem";


function SignupForm({ signup, isLoading }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    console.log("submitting")
    try {
      await signup(username, password, role);
      navigate("/dashboard", { replace: true })
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    }
  }

  function handleRoleChange(role) {
    setRole(role);
  }

  const roles = ["MANAGER", "EMPLOYEE"];

  return (
    <div>
      <p>Hello from signup!</p>
      <form onSubmit={handleSubmit}>
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

        <label htmlFor="role">Role</label>
        <Dropdown content={
          <>
            {roles.map(role => (
              <DropDownItem key={role}>{`Role ${role}`}</DropDownItem>
            ))}
            </>
          } handleChange={handleRoleChange} buttonText="Dropdown Button" />

        <button type="submit">{isLoading ? "Loading..." : "Sign Up"}</button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default SignupForm;
