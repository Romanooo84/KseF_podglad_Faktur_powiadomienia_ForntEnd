import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const link='https://organizerfaktur.pl'
//const link='http://loclahost:3000'

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetch(`${link}/getip`, {
          credentials: "include",
        });

        if (!alive) return;

        if (r.ok) setStatus("authed");
        else setStatus("guest");
      } catch {
        if (!alive) return;
        setStatus("guest");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (status === "loading") return <div>Sprawdzam sesję...</div>;
  if (status === "guest") return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;