const link = "https://organizerfaktur.pl";
//const link = "http://localhost:3000";

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
  console.log(`${link}/invoices`)
  const res = await fetchWithAuth(`${link}/invoices`);

  const text = await res.text();

  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    return JSON.parse(text);
  }

  throw new Error("Serwer nie zwrócił JSON.");
};

export const getHarmonogram = async () => {
  const res = await fetchWithAuth(`${link}/harmonogram`);
  const data = await res.json();
  console.log(data)
  return data;
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

export const getFileToImport = async (invoiceNumber) => {
  const res = await fetchWithAuth(
    `${link}/importfile?invoicenumber=${encodeURIComponent(invoiceNumber)}`
  );

  if (!res.ok) {
    // backend zwraca JSON przy błędzie
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Błąd pobierania pliku");
  }

  // ✅ to jest plik → blob
  const blob = await res.blob();

  // opcjonalnie: nazwa z nagłówka Content-Disposition
  const cd = res.headers.get("content-disposition") || "";
  const match = cd.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)(?:")?/i);
  const filename = match ? decodeURIComponent(match[1]) : `${invoiceNumber}.txt`;

  // wymuś pobranie
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);

  return { ok: true, filename };
};