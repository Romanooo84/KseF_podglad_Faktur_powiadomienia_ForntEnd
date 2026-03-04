import { useEffect, useState } from "react";
import { getHarmonogram } from "../functions/fetchToBackend";
import css from "./paymentShcedule.module.css";

export const PaymentSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatPL = (value) =>
    new Intl.NumberFormat("pl-PL", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));

  // ✅ POBIERANIE DANYCH W useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getHarmonogram();
        setSchedule(data);
      } catch (err) {
        console.error("Błąd harmonogramu:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // tylko do debugowania
  useEffect(() => {
    if (!schedule) return;

    console.log("harmonogram:", schedule);

    Object.entries(schedule).forEach(([key, value]) => {
      console.log(value?.data?.weekKey);
    });
  }, [schedule]);

  if (isLoading) return <p>Ładuję...</p>;
  if (!schedule) return <div>Brak danych</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Tydzień</th>
          <th>Kwota</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(schedule).map(([key, value]) => (
          <tr key={key}>
            <td className={css.td}>{value?.data?.weekKey}</td>
            <td className={css.td}>
              {formatPL(value?.data?.total)} zł
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};