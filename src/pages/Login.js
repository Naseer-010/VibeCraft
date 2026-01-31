import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Blockchain Healthcare System</h1>

      <button onClick={() => navigate("/patient")}>
        Login as Patient
      </button>

      <button onClick={() => navigate("/doctor")}>
        Login as Doctor
      </button>
    </div>
  );
}

export default Login;
