import { useEffect, useState } from "react";
import { getInvoice } from "../functions/fetchToBackend";
import css from './InvoiceData.module.css'

const formatPL = (value) => {
    if (!value) return "0";

    const [integer, decimal] = String(value).split(".");

    const withSpaces = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return decimal ? `${withSpaces}.${decimal}` : withSpaces;;
};

// invoiceNo jest opcjonalny: <InvoiceData /> albo <InvoiceData invoiceNo="FV/12/2026" />
export const InvoiceData = ({ invoiceNo = "" }) => {
  // jeśli invoiceNo jest podany, ustawiamy go jako startową wartość
  const [invoiceNumber, setInvoiceNumber] = useState(invoiceNo);
  const [invoice, setInvoice] = useState(null);
  const [isItemsShown, setIsItemsShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoice = async (number) => {
    if (!number) return;

    setError(null);
    setIsLoading(true);
    setIsItemsShown(false);

    try {
      const data = await getInvoice(number);
      setInvoice(data);
      console.log(data)

    } catch (err) {
      setInvoice(null);
      setError("Nie udało się pobrać faktury.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gdy przychodzi invoiceNo (lub się zmieni) -> pobierz automatycznie
  useEffect(() => {
    if (invoiceNo) {
      setInvoiceNumber(invoiceNo); // żeby stan był spójny
      fetchInvoice(invoiceNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceNo]);

  const handleGetInvoice = async (e) => {
    e?.preventDefault?.();
    fetchInvoice(invoiceNumber);
  };

  const items = invoice?.produkty ?? [];
  const showSearch = !invoiceNo; // jeśli nie przekazano numeru -> pokaż wyszukiwarkę

  return (
    <>
      {showSearch && (
        <div className={css.input}>
          <input
            id='search'
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="Wpisz numer faktury"
          />
          <button
            type="button"
            onClick={handleGetInvoice}
            disabled={!invoiceNumber || isLoading}
          >
            {isLoading ? "Szukam..." : "Znajdź fakturę"}
          </button>
        </div>
      )}

      {invoice && (
        <>
          {showSearch ? (
            <table>
              <thead>
                <tr>
                  <th>Nazwa firmy</th>
                  <th>Numer faktury</th>
                  <th>Kwota brutto</th>
                  <th className={css.isHidden}>Kwota netto</th>
                  <th className={css.isHidden}>VAT</th>
                  <th className={css.isHidden}>Data faktury</th>
                  <th className={css.isHidden}>Termin płatności</th>
                  <th>Akcja</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{invoice.NazwaFirmy}</td>
                  <td>{invoice.nrFaktury}</td>
                  <td>{formatPL(invoice.kwota)} zł</td>
                  <td className={css.isHidden}>{formatPL(invoice.kwota_netto)} zł</td>
                  <td className={css.isHidden}>{formatPL(invoice.VAT)} zł</td>
                  <td className={css.isHidden}>{invoice.data_faktury}</td>
                  <td className={css.isHidden}>{invoice.terminPlatnosci??'----'}</td>
                  <td>
                    <button className={css.shownButton} type="button" onClick={() => setIsItemsShown((v) => !v)}>
                      {isItemsShown ? "Ukryj zawartość faktury" : "Pokaż zawartość faktury"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <tr>
              <td>{invoice.NazwaFirmy}</td>
              <td>{invoice.nrFaktury}</td>
              <td>{formatPL(invoice.kwota)} zł</td>
              <td className={css.isHidden}>{formatPL(invoice.kwota_netto)} zł</td>
              <td className={css.isHidden}>{formatPL(invoice.VAT)} zł</td>
              <td className={css.isHidden}>{invoice.data_faktury}</td>
              <td className={css.isHidden}>{invoice.terminPlatnosci??'----'}</td>
              <td>
                <button className={css.shownButton} type="button" onClick={() => setIsItemsShown((v) => !v)}>
                  {isItemsShown ? "Ukryj zawartość faktury" : "Pokaż zawartość faktury"}
                </button>
              </td>
            </tr>
          )}

          

          {isItemsShown && (
            <>
              <thead className={css.invoiceThead} >
                <tr >
                  <th className={`${css.emptyCell} ${css.isHidden}`}></th>
                  <th className={`${css.emptyCell} ${css.isHidden}`}></th>
                  <th >nazwa</th>
                  <th>cena za szt</th>
                  <th>liczba sztuk</th>
                  <th>kwota</th>
                </tr>
              </thead>
              <tbody className={css.invoiceTbody}>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4}>Brak pozycji na fakturze</td>
                  </tr>
                ) : (
                  items.map((item, index) => (
                    <tr key={item.nazwa ? `${item.nazwa}-${index}` : index}>
                      <th className={`${css.emptyCell} ${css.isHidden}`}></th>
                      <th className={`${css.emptyCell} ${css.isHidden}`}></th>
                      <td>{item.nazwa}</td>
                      <td>{formatPL(item.cena_za_szt)}</td>
                      <td>{item.liczba_sztuk}</td>
                      <td>{formatPL(item.kwota)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </>
          )}
        </>
      )}
    </>
  );
};