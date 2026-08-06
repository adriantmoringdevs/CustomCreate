import { useState } from "react";
import { useAuth } from "../context/UserContext";
// import { Button } from "../styles";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function LoginSignup() {
  const { isLoading, login, signup, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-card">
        {showLogin?(
          <>
            <LoginForm login={login} isLoading={isLoading} />
            <p>
              Don't have an account? &nbsp;
              <button color="secondary" onClick={() => setShowLogin(false)}>
                Sign Up
              </button>
            </p>
          </>
        ):(
          <>
            <SignupForm signup={signup} isLoading={isLoading} />
            <p>
              Already have an account? &nbsp;
              <button color="secondary" onClick={() => setShowLogin(true)}>
                Log In
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginSignup
