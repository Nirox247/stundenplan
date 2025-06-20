import React from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase"; // Passe Pfad ggf. an

const subjects: { [key: string]: string } = {
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
  politik: "#1D4ED8"
};

const weekdays = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag"];
const randomName = () => {
  const names = ["Anna Müller", "Max Schmidt", "Laura Becker", "Tobias Braun", "Julia Meier"];
  return names[Math.floor(Math.random() * names.length)];
};

const TestCourseUploader: React.FC = () => {
  const handleUpload = async () => {
    let count = 0;

    try {
      for (const [subject, color] of Object.entries(subjects)) {
        for (let level = 1; level <= 5; level++) {
          for (let i = 0; i < 2; i++) {
            const course = {
              fields: [
                { label: "Titel", value: `${subject} Kurs Stufe ${level}` },
                { label: "Beschreibung", value: `${level} - Testkurs in ${subject} für Level ${level}` },
                { label: "Link", value: "https://roehricht.net/" },
                { label: "Name", value: randomName() },
                { label: "Wochentag", value: weekdays[Math.floor(Math.random() * weekdays.length)] },
                { label: "Anzahl", value: `${Math.floor(Math.random() * 20) + 10}` },
                { label: "Stunde", value: `${Math.floor(Math.random() * 8) + 1}` },
                { label: "Dauer", value: "1" }
              ],
              teacherId: `teacher-${Math.floor(Math.random() * 1000)}`
            };

            await addDoc(collection(db, "courses"), course);
            count++;
          }
        }
      }

      alert(`${count} Kurse erfolgreich hochgeladen.`);
    } catch (error) {
      console.error("Fehler beim Hochladen:", error);
      alert("Fehler beim Hochladen.");
    }
  };

  return (
    <div className="p-6 text-center">
      <button
        onClick={handleUpload}
        className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
      >
        📤 Testkurse hochladen
      </button>
    </div>
  );
};

export default TestCourseUploader;
