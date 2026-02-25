const link = "https://organizerfaktur.pl";

export const fetchWithAuth = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });

  // 🔴 jeśli brak autoryzacji → wracamy do loginu
  if (res.status === 401) {
    window.location.href = "/";
    return;
  }

  return res;
};

export const getInvoices = async () => {
  const res = await fetchWithAuth(`${link}/invoices`);

  const text = await res.text();

  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    return JSON.parse(text);
  }

  throw new Error("Serwer nie zwrócił JSON.");
};

export const getHarmonogram = async () => {
  const res = await fetchWithAuth(`${link}/harmonogram`);
  return await res.json();
};

export const getInvoice = async (invoiceNumber) => {
  const res = await fetchWithAuth(
    `${link}/getinvoice?nr=${invoiceNumber}`
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Błąd pobierania faktury");
  }

  return await res.json();
};

export const getItem = async (item) => {
  const res = await fetchWithAuth(
    `${link}/searchforitem?item=${item}`
  );
 if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Błąd wyszukiwania");
  }
  const data=await res.json()
  console.log(data)
  return data;
};