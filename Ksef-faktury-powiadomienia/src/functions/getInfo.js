const getInvoices = async () => {
  const res = await fetch("https://organizerfaktur.pl/invoices", {
    credentials: "include",
  });

  const text = await res.text(); // ✅ MUSI BYĆ text()

  // Parsuj JSON tylko jeśli wygląda jak JSON:
  if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
    const data = JSON.parse(text);
    return data;
  }

  throw new Error("Serwer nie zwrócił JSON. Zobacz log BODY/CONTENT-TYPE.");
};

export { getInvoices };