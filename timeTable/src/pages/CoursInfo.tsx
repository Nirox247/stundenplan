import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ColorPalets from "../components/ColorPalets";
import  InputField  from "../components/InputFields/InputField";
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
  teacherId: string;
}

interface SelectionEntry {
  title: string;
  name: string;
  description: string;
  teacherId: string;
}

interface CourseWithParticipants extends coursItem {
  participants: string[];
}

export default function courseSelectionsInfo() {
  const [loading, setLoading] = useState(true);
  const [dataGruppiert, setDataGruppiert] = useState<{
    [tag: string]: { [stunde: string]: CourseWithParticipants[] };
  }>({});
  const [openCourseKey, setOpenCourseKey] = useState<string | null>(null);
  const [serch, setSerch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Lade Kursdaten
        const courseDocs = await getDocs(collection(db, "courses"));
        const courseItems: coursItem[] = courseDocs.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.fields?.find((f: any) => f.label === "Titel")?.value || "",
            description: data.fields?.find((f: any) => f.label === "Beschreibung")?.value || "",
            link: data.fields?.find((f: any) => f.label === "Link")?.value || "",
            name: data.fields?.find((f: any) => f.label === "Name")?.value || "",
            Wochentag: data.fields?.find((f: any) => f.label === "Wochentag")?.value?.toLowerCase() || "sonst",
            Anzahl: data.fields?.find((f: any) => f.label === "Anzahl")?.value || "",
            Stunde: data.fields?.find((f: any) => f.label === "Stunde")?.value || "",
            Dauer: data.fields?.find((f: any) => f.label === "Dauer")?.value || "",
            teacherId: data.teacherId || "",
          };
        });

        // 2. Initialisiere Gruppierung + Teilnehmer-Felder
        const kursMap: { [key: string]: CourseWithParticipants } = {};
        const gruppiert: { [tag: string]: { [stunde: string]: CourseWithParticipants[] } } = {};

        courseItems.forEach(kurs => {
          const key = kurs.id;
          kursMap[key] = { ...kurs, participants: [] };

          if (!gruppiert[kurs.Wochentag]) gruppiert[kurs.Wochentag] = {};
          if (!gruppiert[kurs.Wochentag][kurs.Stunde]) gruppiert[kurs.Wochentag][kurs.Stunde] = [];
          gruppiert[kurs.Wochentag][kurs.Stunde].push(kursMap[key]);
        });

        // 3. Lade courseSelections
        const selectionDocs = await getDocs(collection(db, "courseSelections"));
        selectionDocs.forEach(doc => {
          const data = doc.data();
          const username = data.name || "Unbekannt";
          const auswahl = data.auswahl || {};

          Object.values(auswahl).forEach((stunden: any) => {
            (Object.values(stunden) as (SelectionEntry | null)[]).forEach((eintrag) => {
              if (!eintrag || !eintrag.teacherId) return;
            
              const kurs = kursMap[eintrag.teacherId];
              if (kurs && !kurs.participants.includes(username)) {
                kurs.participants.push(username);
              }
            });
          });
        });

        setDataGruppiert(gruppiert);
        setLoading(false);
      } catch (error) {
        console.error("Fehler beim Laden:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadSinglePDF = (kurs: CourseWithParticipants) => {
    const doc = new jsPDF();
    doc.text(`Teilnehmer für ${kurs.title}`, 14, 14);
    doc.text(`Lehrkraft: ${kurs.name}`, 14, 22);
    doc.text(`Beschreibung: ${kurs.description}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [["#", "Teilnehmer"]],
      body: kurs.participants.map((name, i) => [i + 1, name]),
    });

    doc.save(`${kurs.title}-Teilnehmer.pdf`);
  };

  const downloadAllPDF = () => {
    const doc = new jsPDF();
    doc.text("Alle Kurse mit Teilnehmern", 14, 14);

    const rows: any[] = [];

    Object.values(dataGruppiert).forEach(stundenObj =>
      Object.values(stundenObj).forEach(kurse =>
        kurse.forEach(kurs => {
          rows.push([
            kurs.Wochentag,
            kurs.Stunde,
            kurs.title,
            kurs.name,
            kurs.participants.join(", ") || "Keine Teilnehmer",
          ]);
        })
      )
    );

    autoTable(doc, {
      startY: 20,
      head: [["Tag", "Stunde", "Kurs", "Lehrkraft", "Teilnehmer"]],
      body: rows,
    });

    doc.save("Alle-Kurse-mit-Teilnehmern.pdf");
  };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSerch(e.target.value)
  }
  //scrolen
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); // 'smooth' für sanftes Scrollen
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">📚 Kursübersicht nach Tagen & Stunden</h1>

      {loading ? (
        <p className="text-center">Lade Daten...</p>
      ) : (
        
        <div className="space-y-10">
                <div className="text-center mt-10">
        <button
          onClick={downloadAllPDF}
          className="px-6 py-2 text-white rounded-xl"
          style={{
            backgroundColor: ColorPalets.primary,
            border: `1px solid ${ColorPalets.primary}`,
            cursor: "pointer",
            margin: "10px 0",
            transition: "background-color 0.3s ease",
          }}
        >
          📄 Alle Kurse als PDF
        </button>
            <div className="flex justify-center gap-4 mb-8">
            {["montag", "dienstag", "mittwoch", "donnerstag", "freitag"].map(tag => (
              <button
                key={tag}
                
                onClick={() => {
                  const element = document.getElementById(`tag-${tag}`);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="px-4 py-2 rounded-xl capitalize text-sm"
                style={{
                  backgroundColor: ColorPalets.primaryLight,
                  color: "white",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
              >
                {tag}
              </button>
            ))}
          </div>


        <InputField
        placeholder="suche nach coursen/Lehrern"
        type="text"
        value={serch}
        onChange={handleInputChange}
      /> 
      </div>
          {["montag", "dienstag", "mittwoch", "donnerstag", "freitag"].map(tag =>
            dataGruppiert[tag] ? (
              <div key={tag} id={`tag-${tag}`} className="mb-12">
                <h2 className="text-xl font-semibold capitalize mb-4">{tag}</h2>
                {["1", "2", "3", "4", "5", "6", "7", "8"].map(stunde =>
                  dataGruppiert[tag][stunde] ? (
                    <div key={`${tag}-${stunde}`} className="mb-6">
                      <h3 className="text-lg font-medium mb-2">🕒 Stunde {stunde}</h3>
                      <div className="flex flex-wrap gap-4 border-2 border-gray-300 border-b-gray-400 p-4 rounded-xl">
                      {dataGruppiert[tag][stunde]
                      .filter(kurs =>
                        kurs.title.toLowerCase().includes(serch.toLowerCase()) ||
                        kurs.name.toLowerCase().includes(serch.toLowerCase())
                      )
                      .map(kurs => {
                          const key = `${kurs.id}`;
                          const isOpen = openCourseKey === key;

                          return (
                            <div key={key} className="w-full max-w-md border rounded-lg p-4 shadow-sm bg-white"
                            onClick={() => setOpenCourseKey(isOpen ? null : key)}>
                              <div
                                className="cursor-pointer"
                                onClick={() => setOpenCourseKey(isOpen ? null : key)}
                              >
                                <h4 className="text-lg font-bold">{kurs.title}</h4>
                                <p className="text-sm text-gray-600">{kurs.description}</p>
                                <p className="text-sm italic text-gray-500">👤 {kurs.name}</p>
                              </div>

                              {isOpen && (
                                <div className="mt-4">
                                  <h5 className="font-medium mb-2">Teilnehmer:</h5>
                                  {kurs.participants.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                      {kurs.participants.map((name, i) => (
                                        <li key={i}>{name}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="italic text-gray-400">Keine Teilnehmer</p>
                                  )}

                                  <button
                                    onClick={() => downloadSinglePDF(kurs)}
                                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  >
                                    📄 PDF für diesen Kurs
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            ) : null
          )}
        </div>
      )}


    </div>
  );
}
