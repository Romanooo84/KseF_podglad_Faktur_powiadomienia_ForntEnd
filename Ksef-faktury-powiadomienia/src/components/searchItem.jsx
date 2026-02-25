import { useState } from "react";
import { getItem } from "../functions/fetchToBackend";
import { InvoiceData } from "./InvoiceData";

export const SearchItem = () => {
  const [search, setSearch] = useState("");
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      setIsLoading(true);
      const data = await getItem(search);
      setItem(data);
    } catch (err) {
      console.error("Błąd:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Wpisz nazwę / EAN / index"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Szukaj</button>
      </form>

      {isLoading && <div>Ładuję…</div>}

      {item && (
        <table>
          <thead>
            <tr>
                  <th>Nazwa firmy</th>
                  <th>Numer faktury</th>
                  <th>Kwota brutto</th>
                  <th>Kwota netto</th>
                  <th>VAT</th>
                  <th>Data faktury</th>
                  <th>Termin płatności</th>
                
            </tr>
          </thead>
          <tbody>
           {item.map((data, index) => {
                return (
            
                        <InvoiceData
                            invoiceNo={data.numerFaktury}
                            dataFaktury={data.dataFaktury}
                        />

                );
             })}
          </tbody>
        </table>
      )}
    </div>
  );
};