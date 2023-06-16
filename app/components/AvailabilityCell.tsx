"use client";

import "./AvailabilityCell.css";
import { useState } from "react";

interface AvailabilityCellProps {
  cellData: {
    timeslot_id: number;
    day_id: number;
    timeslot_string: string;
    day_string: string;
    available_shayan: boolean;
    available_vitalina: boolean;
    available_khadija: boolean;
    available_oleh: boolean;
    available_baz: boolean;
  };
}

export default function AvailabilityCell({ cellData }: AvailabilityCellProps) {
  const [cellState, setCellState] = useState(cellData);

  async function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    try {
      // console.log(event.target);
      const { dataset } = event.target as HTMLButtonElement;
      // console.log(dataset);
      const { dayString, timeslotString, name } = dataset;
      // console.log(dayString, timeslotString, name);

      const body = {
        // day_id: dayId,
        daystring: dayString,
        // timeslot_id: timeslotId,
        timeslotstring: timeslotString,
        name: name,
      };
      // console.log("body:", body);

      const response = await fetch("http://localhost:3000/api/availability", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // console.log(response);
      const responseJson = await response.json();
      // console.log(responseJson);
      const newCellState = responseJson[0];
      // console.log(newCellState);
      setCellState(newCellState);
    } catch (error) {
      console.log(error);
    }
  }

  function isToday(dayName: string) {
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = new Date().getDay();
    const todayName = daysOfWeek[today];

    return dayName === todayName;
  }

  return (
    <td className={isToday(cellState.day_string) ? "today" : ""}>
      {Object.entries(cellState).map(([key, value], index) => {
        if (key.includes("available")) {
          return (
            <button
              key={index}
              // data-day-id={item["day_id"]}
              data-day-string={cellState["day_string"]}
              // data-timeslot-id={item["timeslot_id"]}
              data-timeslot-string={cellState["timeslot_string"]}
              data-name={key.split("_")[1]}
              onClick={handleClick}
              className={`availability-button ${
                value ? "available-yes" : "available-no"
              }`}
            >
              {key.split("_")[1]}
            </button>
          );
        }
      })}
    </td>
  );
}
