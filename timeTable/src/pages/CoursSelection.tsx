// Komplettes überarbeitetes Script mit Filtersystem, automatischem Scrollen und Farbgebung

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import ColorPalets from "../components/ColorPalets";

interface coursItem {
  id: string;
  title: string;
  description: string;
  link: string;
  name: string;
  Wochentag: string;
  Anzahl: string;
  Stunde: string;
  Dauer: string;
  teacherId?: string;
}

const subjects = {
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

function CourseListGroupedByDay() {
  const { user } = useAuth();
  const [dataGruppiert, setDataGruppiert] = useState<{
    [tag: string]: { [stunde: string]: coursItem[] };
  }>({});
  const [selectedCourses, setSelectedCourses] = useState<{
    [tag: string]: { [stunde: string]: coursItem | null };
  }>({});
  const [loading, setLoading] = useState(true);
  const [fachFilter, setFachFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState(0);

  useEffect(() => {
    console.log(user)
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const items: coursItem[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.fields?.find((f: any) => f.label === "Titel")?.value || "",
            description:
              data.fields?.find((f: any) => f.label === "Beschreibung")?.value || "",
            link: data.fields?.find((f: any) => f.label === "Link")?.value || "",
            name: data.fields?.find((f: any) => f.label === "Name")?.value || "",
            Wochentag:
              data.fields?.find((f: any) => f.label === "Wochentag")?.value?.toLowerCase() ||
              "sonst",
            Anzahl: data.fields?.find((f: any) => f.label === "Anzahl")?.value || "",
            Stunde: data.fields?.find((f: any) => f.label === "Stunde")?.value || "",
            Dauer: data.fields?.find((f: any) => f.label === "Dauer")?.value || "",
            teacherId: data.teacherId || ""
          };
        });

        const gruppiert: { [tag: string]: { [stunde: string]: coursItem[] } } = {};
        const selection: { [tag: string]: { [stunde: string]: coursItem | null } } = {};

        items.forEach(item => {
          const tag = item.Wochentag;
          const stunde = item.Stunde;
          if (!gruppiert[tag]) gruppiert[tag] = {};
          if (!gruppiert[tag][stunde]) gruppiert[tag][stunde] = [];
          if (!selection[tag]) selection[tag] = {};
          if (!selection[tag][stunde]) selection[tag][stunde] = null;

          gruppiert[tag][stunde].push(item);
        });

        setDataGruppiert(gruppiert);
        setSelectedCourses(selection);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Laden der Kurse:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

const handleSelect = (tag: string, stunde: string, course: coursItem) => {
  setSelectedCourses(prev => ({
    ...prev,
    [tag]: {...prev[tag], [stunde]: course}
  }));
  const next = Number(stunde) + 1;
  const el = document.getElementById(`stunde-${tag}-${next}`);
  if (el) setTimeout(() => el.scrollIntoView({behavior:"smooth", block:"center"}), 200);
};


const handleSave = async () => {
  if (!user) {
    alert("Nicht eingeloggt.");
    return;
  }

  try {
    const docRef = doc(db, "courseSelections", user.uid);
    const auswahl = Object.entries(selectedCourses).reduce((acc, [tag, stunden]) => {
      acc[tag] = Object.entries(stunden).reduce((stundenAcc, [stunde, kurs]) => {
        if (kurs) {
          stundenAcc[stunde] = {
            title: kurs.title,
            name: kurs.name,
            description: kurs.description,
            teacherId: kurs.id,
            start: kurs.Stunde,
            dauer: kurs.Dauer,
          };
        } else {
          stundenAcc[stunde] = null;
        }
        
        return stundenAcc;
      }, {} as any);
      return acc;
    }, {} as any);

    await setDoc(docRef, {
      userId: user.uid,
      name: user.displayName || "Error",
      auswahl,
      timestamp: serverTimestamp()
    });

    alert("Stundenplan gespeichert!");
  } catch (error: any) {
    console.error("Fehler beim Speichern:", error);
    alert("Fehler beim Speichern: " + error.message);
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-12">
        📚 Kursübersicht nach Wochentagen und Stunden
      </h1>

      // oberer Bereich: Filter-Dropdowns
      <div className="flex justify-center gap-4 mb-8">
        <select
          value={fachFilter}
          onChange={e => setFachFilter(e.target.value)}
          className="px-3 py-2 rounded border"
        >
          <option value="">-- Fach wählen --</option>
          {Object.keys(subjects).map(fach => (
            <option key={fach} value={fach}>{fach}</option>
          ))}
        </select>

        <select
          value={levelFilter}
          onChange={e => setLevelFilter(Number(e.target.value))}
          className="px-3 py-2 rounded border"
        >
          <option value={0}>-- Level ab --</option>
          {[1,2,3,4,5].map(l => (
            <option key={l} value={l}>Level {l}+</option>
          ))}
        </select>
      </div>


      {loading ? (
        <p className="text-center">Lade Kurse...</p>
      ) : (
        ["montag", "dienstag", "mittwoch", "donnerstag", "freitag"].map(tag => (
          <div key={tag} className="mb-12">
            <h2 className="text-xl font-semibold mb-4 capitalize">{tag}</h2>
            {["1", "2", "3", "4", "5", "6", "7", "8"].map(stunde => (
              <div
                key={`${tag}-${stunde}`}
                id={`stunde-${tag}-${stunde}`}
                className="mb-6"
              >
                <h3 className="text-lg font-medium mb-2">🕒 Stunde {stunde}</h3>
                <div className="flex flex-wrap gap-4 border-1 border-green-300 rounded-xl p-4">
                  {dataGruppiert[tag]?.[stunde]
                    ?.filter(item => {
                      const fach = item.title.toLowerCase().split(" ")[0];
                      const level = parseInt(item.description);
                      return (
                        (!fachFilter || fach === fachFilter) &&
                        (!levelFilter || (!isNaN(level) && level >= levelFilter))
                      );
                    })
                    .map(item => {
                      const selected = selectedCourses[tag]?.[stunde]?.id === item.id;
                      const fach = item.title.toLowerCase().split(" ")[0];
                      const level = parseInt(item.description);
                      const bg = subjects[fach as keyof typeof subjects] || "#ccc";
                      const levelDark = level >= 4 ? "80" : level >= 3 ? "A0" : "C0";

                      return (
                        <div
                        key={item.id}
                        onClick={() => handleSelect(tag, stunde, item)}
                        className={`
                          cursor-pointer p-4 rounded-lg border shadow-sm flex flex-col
                           transition-shadow w-60 
                          ${selected ? "border-2 border-blue-600 shadow-lg bg-blue-50" : " bg-white border-1 border-gray-200"}
                        `}
                        style={{
                          borderColor: subjects[fach as keyof typeof subjects],
                        }}
                      >
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm">{item.description}</p>
                        <p className="text-sm italic mt-2">👤 {item.name}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      <div className="text-center mt-10">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Stundenplan speichern
        </button>
      </div>
    </div>
  );
}

export default CourseListGroupedByDay;