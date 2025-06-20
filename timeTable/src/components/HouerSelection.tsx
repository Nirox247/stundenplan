// HouerSelection.tsx
import React from "react"; // No useState or useEffect needed if purely display

type CourseData = {
  title: string;
  name?: string;
  description?: string;
  teacherId: string;
  subject?: string | null;
  duration?: number | null;
  start?: number | null;
};

interface HouerSelectionProps {
  day: string;
  hour: string;
  data: CourseData | null;
  // Removed onSave prop
}

const HouerSelection: React.FC<HouerSelectionProps> = ({ day, hour, data }) => {
  if (!data) {
    return (
      <div className="p-4 border rounded shadow-lg bg-white text-center">
        <h4>{day}, {hour}</h4>
        <p className="text-gray-600">Freistunde</p>
        <p className="text-sm text-gray-500 mt-2">Wähle einen Kurs in der Kursauswahl, um diesen Slot zu belegen.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow-lg bg-white">
      <h4>Details für {day}, {hour}</h4>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Titel:</label>
        <p className="mt-1 text-lg font-semibold text-gray-900">{data.title}</p>
      </div>
      {data.description && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Beschreibung:</label>
          <p className="mt-1 text-gray-800">{data.description}</p>
        </div>
      )}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Lehrer-ID:</label>
        <p className="mt-1 text-gray-800">{data.teacherId}</p>
      </div>
      {data.subject && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Fach:</label>
          <p className="mt-1 text-gray-800">{data.subject}</p>
        </div>
      )}
      {data.duration && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Dauer:</label>
          <p className="mt-1 text-gray-800">{data.duration} Minuten</p>
        </div>
      )}
      {data.start && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Stunde:</label>
          <p className="mt-1 text-gray-800">{data.start}. Stunde</p>
        </div>
      )}
      {/* If 'name' is distinct from 'description' and you want to display it */}
      {data.name && data.name !== data.description && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <p className="mt-1 text-gray-800">{data.name}</p>
        </div>
      )}
    </div>
  );
};

export default HouerSelection;