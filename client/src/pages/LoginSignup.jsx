import { useState } from "react";
import { useAuth } from "../context/UserContext";
import { Button } from "../styles";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

function Login() {
  const { user, isLoading, login, signup, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {showLogin ? (
        <>
          <LoginForm login={login} isLoading={isLoading} />
          <p>
            Don't have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(false)}>
              Sign Up
            </Button>
          </p>
        </>
      ) : (
        <>
          <SignUpForm signup={signup} isLoading={isLoading} />
          <p>
            Already have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(true)}>
              Log In
            </Button>
          </p>
        </>
      )}
    </div>
  );
}
