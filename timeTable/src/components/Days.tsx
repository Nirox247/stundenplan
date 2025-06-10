import React, { useState } from "react";
import "../demoIndex.css";
import HouerSelection from "./HouerSelection";
import ColorPalets from "./ColorPalets";

interface Props {
  onClick: (dayName: string, hour: string) => void;
  onSelectItem: (item: string | null) => void;
  onselectDay?: (day: string) => void;
}

const days = [
  { name: "MONTAG", hours: ["Stunde 1", "Stunde 2", "Stunde 3", "Stunde 4", "Stunde 5", "Stunde 6", "Stunde 7", "Stunde 8"] },
  { name: "DIENSTAG", hours: ["Stunde 1", "Stunde 2", "Stunde 3", "Stunde 4", "Stunde 5", "Stunde 6", "Stunde 7", "Stunde 8"] },
  { name: "MITTWOCH", hours: ["Stunde 1", "Stunde 2", "Stunde 3", "Stunde 4", "Stunde 5", "Stunde 6", "Stunde 7", "Stunde 8"] },
  { name: "DONNERSTAG", hours: ["Stunde 1", "Stunde 2", "Stunde 3", "Stunde 4", "Stunde 5", "Stunde 6", "Stunde 7", "Stunde 8"] },
  { name: "FREITAG", hours: ["Stunde 1", "Stunde 2", "Stunde 3", "Stunde 4"] },
];

function TimeTable({ onClick, onSelectItem }: Props) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleDayClick = (dayName: string) => {
    if (selectedDay === dayName) {
      setSelectedDay(null);
      onSelectItem(null);
    } else {
      setSelectedDay(dayName);
      onClick(dayName, "");
    }
  };

  const bgColor = ColorPalets.primaryLighter;
  const hoverBgColor = ColorPalets.primaryLight;
  const boxShadowHover = "0px 0px 12px 0px rgba(71, 85, 105, 0.35)";

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className={`schedule relative text-slate-800 ${
        selectedDay ? "flex p-8 min-w-4xl max-h-200" : "grid grid-cols-5 p-8"
      } gap-4 rounded-lg shadow-md items-start`}
      style={{ backgroundColor: bgColor }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest(".houer-selection")) return;
        setSelectedDay(null);
        onSelectItem(null);
      }}
    >
      {days
        .filter((day) => selectedDay === null || selectedDay === day.name)
        .map((day, index) => (
          <div
            key={day.name}
            onClick={(e) => {
              e.stopPropagation();
              handleDayClick(day.name);
            }}
            className={`day-items font-bold text-[1.1rem] tracking-wider text-black select-none
              grid grid-cols-1 p-6 gap-4 rounded-lg shadow-[0px_0px_12px_0px_rgba(51,_65,_85,_0.30)]
              text-center transition-all duration-250 ease-in hover:cursor-pointer hover:-mt-2
              ${selectedDay ? "max-w-2xl min-w-1/4 max-w-50 hover:mt-0" : ""}
              transition-[margin,box-shadow,background-color] hover:duration-150 hover:ease-out`}
            style={{ backgroundColor: bgColor, transitionProperty: "margin, box-shadow, background-color" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.backgroundColor = hoverBgColor;
              el.style.boxShadow = boxShadowHover;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.backgroundColor = bgColor;
              el.style.boxShadow = "0px 0px 12px 0px rgba(51, 65, 85, 0.30)";
            }}
          >
            <div>{day.name}</div>
            <ul>
              {day.hours.map((hour, idx) => (
                <li
                  key={idx}
                  className="houer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(day.name, hour);
                    setSelectedDay(day.name);
                    onSelectItem(hour);
                  }}
                >
                  {hour}
                </li>
              ))}
            </ul>
          </div>
        ))}
      {selectedDay && (
        <div className="houer-selection">
          <HouerSelection />
        </div>
      )}
    </div>
  );
}

export default TimeTable;
