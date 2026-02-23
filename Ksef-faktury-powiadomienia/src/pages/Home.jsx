import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import { getInvoices, getHarmonogram, getInvoice } from '../functions/fetchToBackend'
import { logout } from "../functions/loginToBackend";


function Home() {
  const navigate = useNavigate();
  const [invocesRender, setInvoicesRender] = useState(null)
  const [harmonogramRender, setHarmonogramRender] = useState()
  const [invoiceNumber, setInvoiceNumber] = useState()
  const [invoiceRender, setInvoiceRender] = useState()
  const [invoiceDataRender, setInvoiceDataRender] = useState(null)
  const [produkty, setProdukty]=useState(null)

   const handleLogout = async() => {
    await logout()
    navigate("/login");
  };

    const getInvoicseData = async()=>{
      console.log('pobieram listę faktur')
      const data=await getInvoices()
      const lista = Object.entries(data).map(([numerFaktury, dane], key) => (
      <div key={key}> 
          firma: {dane.NazwaFirmy},
          nr faktury: {numerFaktury},
          kwota: {Number(dane.kwota)},
          termin: {dane.terminPlatnosci}
      </div>
      ));
      console.log(lista)
      setInvoicesRender(lista)
    }

    const getHarmonogramData=async()=>{
      const data = await getHarmonogram ()
      const markup = data.map((harmonogram, key)=>(
        <div key={key}>
          <p>tydzien: {harmonogram.weekKey}</p>
          <p>kwota: {harmonogram.total}</p>
        </div>
      ))
      setHarmonogramRender(markup)
    }

    const showInvoiceData = (produkty) => {
      console.log(produkty)
      const markup=
      <table>
        <tbody>
          <tr>
            <th>nazwa</th>
            <th>cena za szt</th>
            <th>liczba sztuk</th>
            <th>kwota</th>
          </tr>
          {produkty.map((invoice, index) => (
            <tr key={index}>
              <td>{invoice.nazwa}</td>
              <td> {invoice.cena_za_szt}</td>
              <td> {invoice.liczba_sztuk}</td>
              <td> {invoice.kwota}</td>
            </tr>
          ))}
          </tbody>
      </table>
      setInvoiceDataRender(markup);
    };

const getInvoiceData = async (e) => {
  e?.preventDefault?.(); // jeśli odpalasz z <form onSubmit>

  const data = await getInvoice(invoiceNumber);
   setProdukty(data);

  setInvoiceRender(
    <div>
      <p>Nazwa Firmy: {data.NazwaFirmy}</p>
      <p>Kwota Brutto: {data.kwota}</p>
      <p>Kwota Netto: {data.kwota_netto}</p>
      <p>Podatek VAT: {data.VAT}</p>
      <p>Data Faktury: {data.data_faktury}</p>
      <p>Termin Płatnosci: {data.terminPlatnosci}</p>
    </div>
  );
};

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLogout}>Wyloguj</button>
       <>
          {invocesRender ? (
            <div>
              <button type="button" onClick={() => setInvoicesRender(null)}>
                ukryj listę faktur
              </button>
              {invocesRender}
            </div>
          ) : (
            <div>
              <button type="button" onClick={getInvoicseData}>
                Lista faktur
              </button>
            </div>
          )}
          <div>
            <button onClick={getHarmonogramData}>Harmonogram</button>
            {harmonogramRender}
          </div>
         <div>
          <input value={invoiceNumber || ""} onChange={(e) => setInvoiceNumber(e.target.value)} />
          <button type="button" onClick={getInvoiceData}>znajdz fakture</button>
          {invoiceRender}
        </div>
       {invoiceDataRender ? (
          <div>
            <button
              type="button"
              onClick={() => setInvoiceDataRender(null)}
            >
              ukryj zawartość faktury
            </button>

            <div>
              {invoiceDataRender}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => showInvoiceData(produkty.produkty)}
          >
            pokaż zawartość faktury
          </button>
        )}
      </>
    </div>
  );
}

export default Home;


