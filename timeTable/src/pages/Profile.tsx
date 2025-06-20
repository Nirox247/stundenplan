import React, { useEffect, useState } from 'react';
import { fetchTimetableData, type TimeTableData } from "../components/scripts/courseFetch";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [timetableData, setTimetableData] = useState<TimeTableData | null>(null);

  useEffect(() => {
    console.log(user)
    async function loadData() {
      if (!user) return; 
      const data = await fetchTimetableData(user.uid);
      setTimetableData(data);
      if (!data) return;
      console.log("Geladene Stundenplan-Daten:", data.title);
    }
    loadData();
  }, [user]);

  return (
    <div>
     {timetableData && Object.entries(timetableData).map(([day, courses]) => (
  typeof courses === "string" ? (
    <div key={day}>
      <h3>{day}</h3>
      <p>{courses}</p>
    </div>
  ) : (
    <div key={day}>
      <h3>{day}</h3>
      <ul>
        {Object.entries(courses).map(([hour, course]) => (
          <li key={hour}>
            Stunde {hour}: {course ? course.title : "Kein Kurs"}
          </li>
        ))}
      </ul>
    </div>
  )
))}

    </div>
  );
};

export default Profile;
