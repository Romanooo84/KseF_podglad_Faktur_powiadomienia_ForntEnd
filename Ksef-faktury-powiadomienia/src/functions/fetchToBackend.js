const link = 'https://organizerfaktur.pl'

const getInvoices = async () => {
  const res = await fetch(`${link}/invoices`, {
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

const getHarmonogram = async () => {
  const res = await fetch(`${link}/harmonogram`, {
    credentials: "include",
  });

  const harmonogram = await res.json(); // ✅ MUSI BYĆ text()

 return harmonogram

};

const getInvoice = async (invoiceNumber) => {
  const res = await fetch(`${link}/getinvoice?nr=${invoiceNumber}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Błąd pobierania faktury");
  }

  return await res.json();
};



export { getInvoices, getHarmonogram, getInvoice  };