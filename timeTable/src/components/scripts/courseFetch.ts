// utils/fetchTimetable.ts
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Typdefinitionen
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

export async function fetchTimetableData(userId: string): Promise<TimeTableData | null> {
  try {
    const db = getFirestore();
    const docRef = doc(db, "courseSelections", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const rawData = docSnap.data().auswahl as {
      [day: string]: { [hour: string]: CourseData | null };
    };

    const normalizedData: TimeTableData = {};

    Object.entries(rawData).forEach(([day, hours]) => {
      const upperDay = day.toUpperCase();
      normalizedData[upperDay] = {};

      Object.entries(hours).forEach(([hourKey, course]) => {
        const normalizedHour = hourKey.replace(/[^\d]/g, "");
        normalizedData[upperDay][normalizedHour] = course;
      });
    });

    return normalizedData;
  } catch (error: any) {
    console.error("Fehler beim Laden der Kursauswahl:", error.message, error.code);
    return null;
  }
}
