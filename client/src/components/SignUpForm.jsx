import { Button, Error, FormField, Input, Label, Textarea } from "../styles";
import React, { useState } from "react";
import Dropdown from "./Dropdown";

function SignUpForm({ signup, isLoading }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);
        setSubmitting(true);
        try {
            await signup(username, password, role);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false)
        }

        function handleRoleChange (e) {
            setRole(e.target.value)
        }

        const roles = ['MANAGER', 'EMPLOYEE']

        return (
            <form onSubmit={handleSubmit}>
                <FormField>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      type="text"
                      id="username"
                      autoComplete="off"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      />
                </FormField>
                <FormField>
                    <Label htmlFor="password">Password</Label>
                    <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={() => setPassword(e.target.value)}
                    autoComplete="current-password"
                    />
                </FormField>
                <FormField>
                    <Label htmlFor="role">Role</Label>
                    <Dropdown items={roles} handleChange={handleRoleChange}></Dropdown>
                </FormField>
                      <FormField>
                        <Button type="submit">{isLoading ? "Loading..." : "Sign Up"}</Button>
                        </FormField>
                        <FormField>
                        {errors.map((err) => (
                        <Error key={err}>{err}</Error>
        ))}
      </FormField>    
            </form>
        )
    }
    



}