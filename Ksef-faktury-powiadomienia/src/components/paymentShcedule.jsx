import { useState } from "react";
import { getHarmonogram } from "../functions/fetchToBackend";

export const PaymentSchedule = () => {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
            <td>{h.weekKey}</td>
            <td>{h.total} zł</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};