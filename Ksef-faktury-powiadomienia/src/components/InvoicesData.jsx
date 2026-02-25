import { useState } from "react";
import { getInvoices } from "../functions/fetchToBackend";
import { InvoiceData } from "./InvoiceData";
import "./InvoicesData.css"

export const InvoicesData = () => {
  const [invoices, setInvoices] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // pobranie raz (przy pierwszym wejściu na widok)
  if (!invoices && !isLoading) {
    setIsLoading(true);
    getInvoices()
      .then(setInvoices)
      .finally(() => setIsLoading(false));
  }
  if (!invoices) return null;

  return (
    <>
    {invoices!==null && 
      <table>
        <thead>
          <tr>
            <th>firma</th>
            <th>nr faktury</th>
            <th>kwota</th>
            <th>kwota netto</th>
            <th>VAT</th>
            <th>data faktury</th>
            <th>termin</th>
          </tr>
        </thead>
          {Object.entries(invoices).map(([numerFaktury]) => (
            <>
              <InvoiceData invoiceNo={numerFaktury}/>
            </>                   
          ))}
          </table>
        }
      </>
    
  );
};