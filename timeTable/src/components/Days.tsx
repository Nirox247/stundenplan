import React, { useEffect, useState } from "react";
import HouerSelection from "./HouerSelection";
import ColorPalets from "./ColorPalets";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { fetchTimetableData } from "./scripts/courseFetch";

type CourseData = {
  description: string;
  teacherId: string;
  title: string;
};

type TimeTableData = {
  [day: string]: {
    [hour: string]: CourseData | null;
  };
};

interface Props {
  userId: string;
  onClick: (dayName: string, hour: string) => void;
  onSelectItem: (item: string | null) => void;
}

const getSubjectColor = (title: string) => {
  const lowerTitle = title.toLowerCase();
  const subjectKey = Object.keys(subjects).find((key) =>
    lowerTitle.includes(key)
  );
  return subjectKey ? subjects[subjectKey] : "#E5E7EB"; // default: grau
};

const subjects: Record<string, string> = {
  mathe: "#1E3A8A",
  deutsch: "#D97706",
  englisch: "#10B981",
  biologie: "#4B5563",
  chemie: "#9333EA",
  physik: "#F59E0B",
  informatik: "#3B82F6",
  sport: "#EF4444",
  geschichte: "#6B7280",
  erdkunde: "#059669",
  kunst: "#EC4899",
  musik: "#8B5CF6",
  religion: "#F87171",
  philosophie: "#10B981",
  spanisch: "#EA580C",
  französisch: "#BE123C",
  latein: "#4C1D95",
  sozialkunde: "#0EA5E9",
  wirtschaft: "#7C3AED",
  politik: "#1D4ED8",
};

const stunden = ["1", "2", "3", "4", "5", "6", "7", "8"];
const days = [
  { name: "MONTAG", hours: stunden },
  { name: "DIENSTAG", hours: stunden },
  { name: "MITTWOCH", hours: stunden },
  { name: "DONNERSTAG", hours: stunden },
  { name: "FREITAG", hours: ["1", "2", "3", "4"] },
];

function Days({ userId, onClick, onSelectItem }: Props) {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [timetableData, setTimetableData] = useState<TimeTableData>({});

  useEffect(() => {
    // Function to check if it's a mobile device
    const checkIsMobile = () => {
      // A common way to detect mobile is by screen width
      // You can adjust the breakpoint as needed
      return window.innerWidth <= 768; // For example, consider anything 768px or less as mobile
    };

    setIsMobileDevice(checkIsMobile());

    // Add event listener for window resize to update on orientation change etc.
    window.addEventListener("resize", () => setIsMobileDevice(checkIsMobile()));

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", () =>
        setIsMobileDevice(checkIsMobile())
      );
    };
  }, []); // Run only once on mount

  const handleDayClick = (dayName: string) => {
    if (isMobileDevice) {
      // On mobile, clicking a day should expand/collapse its hours
      if (selectedDay === dayName) {
        setSelectedDay(null); // Collapse
        setSelectedHour(null);
        onSelectItem(null);
      } else {
        setSelectedDay(dayName); // Expand
        setSelectedHour(null);
        onClick(dayName, ""); // You might adjust this if you don't want to trigger onClick on day selection on mobile
      }
    } else {
      // On desktop, retain existing behavior or adjust if needed
      if (selectedDay === dayName) {
        setSelectedDay(null);
        setSelectedHour(null);
        onSelectItem(null);
      } else {
        setSelectedDay(dayName);
        setSelectedHour(null);
        onClick(dayName, "");
      }
    }
  };

  const handleHourClick = (dayName: string, hour: string) => {
    setSelectedDay(dayName);
    setSelectedHour(hour);
    onClick(dayName, hour);
    onSelectItem(hour);
  };

  const bgColor = ColorPalets.primaryLighter;
  const hoverBgColor = ColorPalets.primaryLight;
  const boxShadowHover = "0px 0px 12px 0px rgba(71, 85, 105, 0.35)";

  useEffect(() => {
    async function fetchTimetable() {
      if (!user?.uid) return;

      try {
        const db = getFirestore();
        const docRef = doc(db, "courseSelections", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const rawData = docSnap.data().auswahl as {
            [day: string]: { [hour: string]: CourseData | null };
          };

          const normalizedData: TimeTableData = {};

          Object.entries(rawData).forEach(([day, hours]) => {
            const upperDay = day.toUpperCase();
            normalizedData[upperDay] = {};

            Object.entries(hours).forEach(([hourKey, course]) => {
              // Extrahiere z. B. nur die Ziffer aus "Stunde 1" → "1"
              const normalizedHour = hourKey.replace(/[^\d]/g, "");
              normalizedData[upperDay][normalizedHour] = course;
            });
          });

          console.log("🚀 Normalisierte Daten:", normalizedData);
          setTimetableData(normalizedData);
        } else {
          setTimetableData({});
        }
      } catch (error: any) {
        console.error(
          "Fehler beim Laden der Kursauswahl:",
          error.message,
          error.code
        );
      }
    }
    async function loadData() {
      if (!user?.uid) return;
      const data = await fetchTimetableData(user.uid);
      if (data) {
        setTimetableData(data);
      } else {
        setTimetableData({});
      }
    }
  
    loadData();
    fetchTimetable();
  }, [user]);

  return (
    <div>
      {isMobileDevice ? (
        <div
          className={`schedule relative text-slate-800 flex flex-col
             gap-4 p-4 rounded-lg shadow-md items-start min-w-[300px] min-h-[600px]`}
          style={{ backgroundColor: ColorPalets.primaryLighter }}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest(".houer-selection")) return;
            setSelectedDay(null);
            setSelectedHour(null);
            onSelectItem(null);
          }}
        >
          {days.map((day) => (
            <div
              key={day.name}
              onClick={(e) => {
                e.stopPropagation();
                handleDayClick(day.name);
              }}
              className={`day-item-mobile font-bold text-sm text-black select-none
                grid grid-cols-1 p-4 gap-2 rounded-lg 
                shadow-[0px_0px_12px_0px_rgba(51,_65,_85,_0.30)]
                bg-white
                text-center transition-all duration-100 ease-in w-full ${
                  selectedDay === day.name ? "bg-opacity-90" : ""
                }`}
              style={{ backgroundColor: ColorPalets.primaryLight }}
            >
              <div>{day.name}</div>
              {selectedDay === day.name && ( // Only show hours for the selected day
                <ul className="flex flex-col gap-2 mt-2">
                  {day.hours.map((hour, idx) => {
                    const course = timetableData[day.name]?.[hour];
                    return (
                      <li
                        key={idx}
                        className="houer text-sm p-2 rounded-full bg-white" // Increased padding for better touch
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHourClick(day.name, hour);
                        }}
                        style={{
                          cursor: "pointer",
                          border: `2px solid ${
                            course
                              ? getSubjectColor(course.title)
                              : "#CBD5E1"
                          }`,
                          backgroundColor:
                            selectedHour === hour
                              ? ColorPalets.primary
                              : ColorPalets.white,
                          color:
                              selectedHour === hour
                                ? "white"
                                : "black",
                        }}
                      >
                        {course ? `${hour} ${course.title}` : `Stunde ${hour}`}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
          {selectedDay && selectedHour && timetableData[selectedDay]?.[selectedHour] && (
            <div className="houer-selection w-full mt-4">
              <HouerSelection
                day={selectedDay}
                hour={selectedHour}
                data={timetableData[selectedDay][selectedHour]}
              />
            </div>
          )}
        </div>
      ) : (
        // Desktop View (your original layout)
        <div
          className={`schedule relative text-slate-800 grid grid-cols-5 gap-4 p-8 rounded-lg shadow-md items-start`}
          style={{ backgroundColor: ColorPalets.primary }}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest(".houer-selection")) return;
            setSelectedDay(null);
            setSelectedHour(null);
            onSelectItem(null);
          }}
        >
          {days.map((day) => (
            <div
              key={day.name}
              onClick={(e) => {
                e.stopPropagation();
                handleDayClick(day.name);
              }}
              className={`day-items font-bold text-sm tracking-wider text-black select-none
                grid grid-cols-1 p-4 gap-2 rounded-lg 
                shadow-[0px_0px_12px_0px_rgba(51,_65,_85,_0.30)]
                text-center transition-all duration-100 ease-in hover:cursor-pointer 
                hover:-mt-2`}
              style={{ backgroundColor: ColorPalets.primaryLighter }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.backgroundColor = ColorPalets.primaryLight;
                el.style.boxShadow = "0px 0px 12px 0px rgba(71, 85, 105, 0.35)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.backgroundColor = ColorPalets.primaryLighter;
                el.style.boxShadow = "0px 0px 12px 0px rgba(51, 65, 85, 0.30)";
              }}
            >
              <div>{day.name}</div>
              <ul>
                {day.hours.map((hour, idx) => {
                  const course = timetableData[day.name]?.[hour];
                  return (
                    <li
                      key={idx}
                      className="cursor-pointer mt-0 mb-3 bg-indigo-50 text-black border-2 border-dashed border-[#3333] px-5 py-5
                        rounded-[35px] text-center font-2-mono shadow-[0_3px_10px_rgba(122,122,122,0.6)]
                        select-none transition-all duration-100 ease-in-out text-sm p-1 
                        hover:scale-107 min-h-20
                        "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHourClick(day.name, hour);
                      }}
                      style={{
                        cursor: "pointer",
                        border: `2px solid ${
                          course ? getSubjectColor(course.title) : "#CBD5E1"
                        }`,
                        color: "black",
                      }}
                    >
                      {course ? `${hour} ${course.title}` : `Stunde ${hour}`}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {selectedDay && selectedHour && timetableData[selectedDay]?.[selectedHour] && (
            <div className="houer-selection">
              <HouerSelection
                day={selectedDay}
                hour={selectedHour}
                data={timetableData[selectedDay][selectedHour]}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Days;