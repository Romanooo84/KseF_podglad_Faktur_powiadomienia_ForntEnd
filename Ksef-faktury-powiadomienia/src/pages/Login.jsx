import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginToBackend as loginApi } from "../functions/loginToBackend";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginApi(login, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Nie udało się zalogować");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Logowanie</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="login"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="hasło"
          type="password"
        />

        <button disabled={loading} type="submit">
          {loading ? "Loguję..." : "Zaloguj"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}