import React, { useState } from "react";
import UserCard from "../components/User/UserCard";
import Days from "../components/Days";
import News from "../components/News";

function TimeTable() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const user = {
    name: "Max Mustermann",
    hours: "24",
    averageLevel: "B+/2-1",
    favoriteSubjects: ["Mathe", "Informatik", "Sport"],
    nextExam: new Date("2025-06-12T10:00:00"),
    recomendedSubjects: ["Music", "Matematik"],
  };
  const news = [
       {
      title: "Wichtige Ankündigung",
      description: "Die Schulbibliothek hat neue Öffnungszeiten.",
      link: "https://example.com/news1",
      name: "Schulbibliothek",
    },
  ];

  return (
    <div>
      <div className="flex gap-4">
        <UserCard user={user} />

        <Days
          onSelectItem={(item) => setSelectedItem(item)}
          onClick={(day, hour) => console.log(`Clicked ${day} - ${hour}`)}
        />
        <News/>
      </div>
    </div>
  );
}

export default TimeTable;
