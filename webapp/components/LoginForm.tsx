import { useState } from "react";
import { login } from "utils/auth";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="wrapper">
      <div>Username:</div>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <div>Password:</div>
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <button
        type="submit"
        onClick={() =>
          login(username, password, () => window.location.reload())
        }
      >
        Login
      </button>
      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          width: 200px;
          margin: auto;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
