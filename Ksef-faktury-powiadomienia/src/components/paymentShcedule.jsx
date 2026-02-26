import { useState } from "react";
import { getHarmonogram } from "../functions/fetchToBackend";
import css from './paymentShcedule.module.css'

export const PaymentSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatPL = (value) =>
  new Intl.NumberFormat("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));

  if (!schedule && !isLoading) {
    setIsLoading(true);
    getHarmonogram()
      .then(setSchedule)
      .finally(() => setIsLoading(false));
  }

  if (isLoading) return <p>Ładuję...</p>;
  if (!schedule) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>Tydzień</th>
          <th>Kwota</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((h) => (
          <tr key={h.weekKey}>
            <td className={css.td}>{h.weekKey}</td>
            <td className={css.td}>{formatPL(h.total)} zł</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};