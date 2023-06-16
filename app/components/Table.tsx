"use client";

import "./Table.css";
import { useState, useEffect } from "react";
import AvailabilityCell from "./AvailabilityCell";

export default function Table() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getAvailability() {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await fetch("http://localhost:3000/api/availability");
        // console.log("response:", response);
        const responseJson = await response.json();
        // console.log("responseJson:", responseJson);
        setData(responseJson);
        setIsError(false);
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    getAvailability();
  }, []);

  const tableHeadings = [
    "Hour",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlotHeadings = [
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          {tableHeadings.map((tableHeading, index) => (
            <th key={index}>{tableHeading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {timeSlotHeadings.map((timeSlotHeading, index) => {
          return (
            <tr key={index}>
              <td className="timeslot-heading">{timeSlotHeading}</td>
              {data &&
                data
                  .filter((item) => item["timeslot_string"] === timeSlotHeading)
                  .map((item, index) => (
                    <AvailabilityCell key={index} cellData={item} />
                  ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
