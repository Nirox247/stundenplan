import React, { useState, useEffect } from "react";
import UserCard from "../components/User/UserCard";
import Days from "../components/Days";
import News from "../components/News";
import { useAuth } from '../context/AuthContext'; 

function TimeTable() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false); 
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const usercard = {
    name: "Max Mustermann",
    hours: "24",
    averageLevel: "B+/2-1",
    favoriteSubjects: ["Mathe", "Informatik", "Sport"],
    nextExam: new Date("2025-06-12T10:00:00"),
    recomendedSubjects: ["Music", "Matematik"],
  };

  return (
    <div>
      {isMobileDevice ? (
        <div className="flex flex-col gap-4 object-fill">
          <Days
            onSelectItem={(item) => setSelectedItem(item)}
            onClick={(day, hour) => console.log(`Clicked ${day} - ${hour}`)}
          />
        </div>
      ) : (
        <div className="flex flex-row gap-4">
          <UserCard user={user} />
          <Days
            userId={user.uid} // <-- HINZUFÜGEN!
            onSelectItem={(item) => setSelectedItem(item)}
            onClick={(day, hour) => console.log(`Clicked ${day} - ${hour}`)}
          />
          <News />
        </div>
      )}
    </div>
  );
}

export default TimeTable;
