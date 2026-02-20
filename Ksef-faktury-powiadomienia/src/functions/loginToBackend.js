
const loginToBackend = async (login, password) => {
  const res = await fetch("https://organizerfaktur.pl/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ login, password }),
  });

  // jeśli backend zwraca json z komunikatem
  let data = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const msg =
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `Błąd logowania (${res.status})`;
    throw new Error(msg);
  }
  console.log(data)
  return data; // np. { ok: true } albo user
};

const logout = async () => {
  try {
    await fetch("https://organizerfaktur.pl/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Błąd logout:", err);
  }
};

const getIp  =async() => {
  const r = await fetch("https://organizerfaktur.pl/getip", {
    credentials: "include",
  });

  return (await r.json());
}

export {loginToBackend, logout, getIp}