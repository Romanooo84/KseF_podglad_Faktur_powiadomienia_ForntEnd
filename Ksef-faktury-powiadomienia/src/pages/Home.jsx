import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import { getInvoices } from '../functions/getInfo'
import { logout } from "../functions/loginToBackend";


function Home() {
  const navigate = useNavigate();
  const [invocesRender, setInvoicesRender] = useState()

   const handleLogout = async() => {
    await logout()
    navigate("/login");
  };

    const getInvoiceData = async()=>{
    const data=await getInvoices()
    const lista = Object.entries(data).map(([numerFaktury, dane], key) => (
    <div key={key}> 
        firma: {dane.NazwaFirmy},
        nr faktury: {numerFaktury},
        kwota: {Number(dane.kwota)},
        termin: {dane.terminPlatnosci}
    </div>
    ));
    setInvoicesRender(lista)
    }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLogout}>Wyloguj</button>
       <>
        <button onClick={getInvoiceData}>Lista faktur</button>
        {invocesRender}
      </>
    </div>
  );
}

export default Home;


