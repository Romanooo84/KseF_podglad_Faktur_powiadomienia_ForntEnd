import { useEffect, useState } from "react";
import { getInvoices, getFileToImport } from "../functions/fetchToBackend";
import { Fragment } from "react";
import { FaFileDownload } from "react-icons/fa"
import { TfiViewListAlt } from "react-icons/tfi"
import { FaWindowClose } from "react-icons/fa";
import css from "./InvoicesData.module.css";

const formatPL = (value) => {
    if (!value) return "0";

    const [integer, decimal] = String(value).split(".");

    const withSpaces = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

    return decimal ? `${withSpaces}.${decimal}` : withSpaces;;
};

export const InvoicesData = () => {
   const [isList, setIsList]= useState(false)
  const [invoices, setInvoices] = useState(null);           // obiekt { "14564": {...}, ... }
  const [filteredInvoices, setFilteredInvoices] = useState([]); // zawsze entries: [ [key, inv], ... ]
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [invoiceNr, setInvoiceNr] = useState('')

  // pobranie raz
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getInvoices();      // <-- obiekt faktur
        setInvoices(data);
        setFilteredInvoices(Object.entries(data)); // <-- entries na start
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  // (opcjonalnie) debug
  useEffect(() => {
    // entries -> [key, inv]
    filteredInvoices.forEach(([key, inv]) => {
      // console.log(key, inv?.nrFaktury);
    });
  }, [filteredInvoices]);

  const handleSearch = (e) => {
    e.preventDefault();

    const q = search.trim().toLowerCase();
    const source = Object.entries(invoices || {});

    // pusty input -> pokaż wszystko
    if (!q) {
      setFilteredInvoices(source);
      return;
    }

    const includes = (val) => String(val ?? "").toLowerCase().includes(q);

    const result = source
      .map(([key, inv]) => {
        // match na poziomie faktury
        const invoiceHit =
          includes(key) ||
          includes(inv.nrFaktury) ||
          includes(inv.nrKSeF) ||
          includes(inv.NazwaFirmy) ||
          includes(inv.index_dostawcy);

        // match w produktach
        const products = Array.isArray(inv.produkty) ? inv.produkty : [];
        const matchedProducts = products.filter((p) => {
          return (
            includes(p.nazwa) ||
            includes(p.index_dostawcy) ||
            includes(p.kod_EAN)
          );
        });

        if (!invoiceHit && matchedProducts.length === 0) return null;

        // zachowujemy format entries: [key, inv]
        // jeśli trafienie było tylko w produkcie -> podstaw produkty = matchedProducts
        const nextInv = {
          ...inv,
          produkty: invoiceHit ? products : matchedProducts,
        };

        return [key, nextInv];
      })
      .filter(Boolean);

    setFilteredInvoices(result);
  };

  if (isLoading) return <div>Ładowanie...</div>;
  if (!invoices) return null;

  return (
    <div>
      <form onSubmit={handleSearch} className={css.input}>
        <input
          type="text"
          id="searchItem"
          placeholder="Wpisz nr faktury / KSeF / firmę / EAN / index / nazwę produktu"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Szukaj</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>firma</th>
            <th>nr faktury</th>
            <th>kwota</th>
            <th className={css.isHidden}>kwota netto</th>
            <th className={css.isHidden}>VAT</th>
            <th className={css.isHidden}>data faktury</th>
            <th className={css.isHidden}>termin</th>
            <th>akcja</th>
          </tr>
        </thead>
        <tbody>
            {filteredInvoices.map(([numerFaktury, inv]) => (
              <Fragment key={numerFaktury}>

                {/* GŁÓWNY WIERSZ FAKTURY */}
                <tr>
                  <td>{inv.NazwaFirmy}</td>
                  <td>{numerFaktury}</td>
                  <td>{formatPL(inv.kwota)} zł</td>
                  <td className={css.isHidden}>{formatPL(inv.kwota_netto)} zł</td>
                  <td className={css.isHidden}>{formatPL(inv.VAT)} zł</td>
                  <td className={css.isHidden}>{inv.data_faktury}</td>
                  <td className={css.isHidden}>{inv.terminPlatnosci ?? "—"}</td>
                  <td className={css.buttonsTd}>
                    <button
                        type="button"
                        className={css.showButton}
                        onClick={() => {
                          setInvoiceNr(prev => (prev === numerFaktury ? "" : numerFaktury));
                        }}
                      >
                        {invoiceNr === numerFaktury
                          ? <FaWindowClose className={css.iconClose} />
                          : <TfiViewListAlt className={css.iconOpen} />}
                      </button>
                    <button type="button"
                      className={css.showButton}
                      onClick={() =>
                        getFileToImport(numerFaktury)
                        
                      }
                    >
                      <FaFileDownload className={css.icon}/>
                    </button>
                  </td>
                </tr>

                {/* WIERSZE PRODUKTÓW */}
               {invoiceNr === numerFaktury && (
                  <> 
                      <tr className={css.trItems}>
                        <th className={`${css.emptyCell} ${css.isHidden}`}></th>
                        <th className={`${css.emptyCell} ${css.isHidden}`}></th>
                        <th>Nazwa</th>
                        <th className={css.isHidden}>Cena za sztukę</th>
                        <th className={css.backroundColorPhone}>Liczba sztuk</th>
                        <th className={css.backroundColorPhone2}>Kwota</th>
                        <th className={`${css.emptyCell} ${css.isHidden}`}></th>
                        <th className={`${css.emptyCell} ${css.isHidden}`}></th>
                      </tr>
                  

                    
                      {inv.produkty.map((product, index) => (
                        <tr key={index} className={css.productRow}>
                          <td className={`${css.emptyCell} ${css.isHidden}`}></td>
                          <td className={`${css.emptyCell} ${css.isHidden}`}></td>

                          <td>{product.nazwa}</td>

                          {/* tutaj poprawka */}
                          <td className={css.isHidden}>
                            {formatPL(product.cena_za_szt)}
                          </td>

                          <td>{product.liczba_sztuk}</td>
                          <td>{formatPL(product.kwota)}</td>

                          <td className={`${css.emptyCell} ${css.isHidden}`}></td>
                          <td className={`${css.emptyCell} ${css.isHidden}`}></td>
                        </tr>
                      ))}
                  
                  </>
                )}

              </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};