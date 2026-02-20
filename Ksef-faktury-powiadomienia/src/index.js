import { useState } from 'react'
import { login, getIp } from './functions/loginToBackend'
import { getInvoices } from './functions/getInfo'
import './App.css'

const App=()=> {
  const [form, setForm] = useState({
    login: "",
    password: ""
  });

  const [ip, setIp] = useState({
    ip:'',
    forwarded: '',
    remote: '',
  })

  const [ipRender, setIpRender]=useState()
  const [invocesRender, setInvoicesRender] = useState()
 

   const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await login(form.login, form.password);

    const ipData = await getIp();
    setIp(ipData);
    console.log('login succesfull')
    setIpRender(
        <div>
          <p>{ip.ip}</p>
          <p>{ip.forwarded}</p>
          <p>{ip.remote}</p>
        </div>
    )

  } catch (err) {
    console.error(err);
  }
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
    <>
      <form onSubmit={handleSubmit}>
        <label>
          login: 
          <input
            type="text"
            name="login"
            value={form.login}
            onChange={handleChange}
          />
        </label>
        <label>
          password: 
          <input
            type="text"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Wyślij</button>
    </form>
    {ipRender}
    <button onClick={getInvoiceData}>Lista faktur</button>
    {invocesRender}
    </>
  )
}

export default App
