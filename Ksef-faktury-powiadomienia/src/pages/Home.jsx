import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InvoicesData } from "../components/InvoicesData";
import { PaymentSchedule } from "../components/paymentShcedule";
import { InvoiceData } from "../components/InvoiceData";
import { SearchItem } from "../components/searchItem";
import { logout } from "../functions/loginToBackend";
import css from "./home.module.css";

function Home() {
  const navigate = useNavigate();
  const [active, setActive] = useState(null); // "invoices" | "schedule" | "invoice" | null

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggle = (name) => {
    setActive((prev) => (prev === name ? null : name)); // klik ponownie = chowa
  };

  return (
    <>
    <header>
         <h1>Home</h1>
        <button onClick={handleLogout}>Wyloguj</button>
    </header>
    <main className={css.homeDiv}>
     
      <div className={css.buttonsDiv}>
        <div className={css.menu}>
          <button type="button" onClick={() => toggle("invoices")}>
            {active === "invoices" ? "Ukryj listę faktur" : "Lista faktur"}
          </button>

          <button type="button" onClick={() => toggle("schedule")}>
            {active === "schedule" ? "Ukryj harmonogram" : "Harmonogram płatności"}
          </button>

          <button type="button" onClick={() => toggle("invoice")}>
            {active === "invoice" ? "Ukryj fakturę" : "Szukaj faktury"}
          </button>

          <button type="button" onClick={() => toggle("searchItem")}>
            {active === "searchItem" ? "Ukryj wyszukiwanie" : "Szukaj pozycji na fakturach"}
          </button>
        </div>

        <div className={css.content}>
          {active === "invoices" && <InvoicesData />}
          {active === "schedule" && <PaymentSchedule />}
          {active === "invoice" && <InvoiceData />}
          {active === "searchItem" && <SearchItem />}
        </div>
      </div>
    </main>
    </>
  );
}

export default Home;