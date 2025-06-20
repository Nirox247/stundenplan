// src/utils/firebaseUtils.ts

import { getFirestore, doc, getDoc } from "firebase/firestore";

// Typdefinitionen (können auch in einer gemeinsamen Typdatei liegen, aber hier zur Verdeutlichung)
export type CourseData = {
  description: string;
  teacherId: string;
  title: string;
};

export type TimeTableData = {
  [day: string]: {
    [hour: string]: CourseData | null;
  };
};


/**
 * Holt den Stundenplan eines Nutzers aus Firestore und normalisiert ihn.
 * Diese Funktion hat eine Abhängigkeit zu Firebase Firestore.
 * @param userId UID des Nutzers
 * @returns Ein Objekt vom Typ TimeTableData
 */
export async function fetchTimetable(userId: string): Promise<TimeTableData> {
  const db = getFirestore();
  const docRef = doc(db, "courseSelections", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return {};

  const rawData = docSnap.data().auswahl as {
    [day: string]: { [hour: string]: CourseData | null };
  };

  const normalizedData: TimeTableData = {};

  Object.entries(rawData).forEach(([day, hours]) => {
    const upperDay = day.toUpperCase();
    normalizedData[upperDay] = {};

    Object.entries(hours).forEach(([hourKey, course]) => {
      const normalizedHour = hourKey.replace(/[^\d]/g, ""); // z. B. "Stunde 1" → "1"
      normalizedData[upperDay][normalizedHour] = course;
    });
  });

  return normalizedData;
}

// Exportiere die Typen, falls sie auch anderswo benötigt werden
export type { CourseData, TimeTableData };