import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import ColorPalets from "../components/ColorPalets";

interface NewsInfo {
  uplodeby: string;
  role: string;
  timestamp: Date | null;
  ip: string;
  country: string;
  city: string;
  region: string;
  region_code: string;
  timezone: string;
}

interface NewsItem {
  id: string;
  title: string;
  description: string;
  link: string;
  name: string;
  info: NewsInfo;
}

function DeleteNews() {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const readData = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, "news"));
      const items: NewsItem[] = snapshot.docs.map((docSnap) => {
        const docData = docSnap.data();

        let title = "";
        let description = "";
        let link = "";
        let name = "";

        if (Array.isArray(docData.fields)) {
          for (const field of docData.fields) {
            if (field.label === "Titel") title = field.value || "";
            if (field.label === "Beschreibung") description = field.value || "";
            if (field.label === "Link") link = field.value || "";
            if (field.label === "Name") name = field.value || "";
          }
        }

        const info: NewsInfo = {
          uplodeby: docData.info?.uplodeby || "N/A",
          role: docData.info?.role || "N/A",
          timestamp: docData.info?.timestamp?.toDate() || null,
          ip: docData.info?.ip || "N/A",
          country: docData.info?.country || "N/A",
          city: docData.info?.city || "N/A",
          region: docData.info?.region || "N/A",
          region_code: docData.info?.region_code || "N/A",
          timezone: docData.info?.timezone || "N/A",
        };

        return {
          id: docSnap.id,
          title,
          description,
          link,
          name,
          info,
        };
      });
      setData(items);
    } catch (err) {
      console.error("Fehler beim Lesen der Daten:", err);
      setError("Fehler beim Laden der Nachrichten. Bitte versuchen Sie es später noch einmal.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diese Nachricht löschen möchten?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "news", id));
      readData(); // Daten neu laden, um den gelöschten Eintrag zu entfernen
    } catch (err) {
      console.error("Fehler beim Löschen des Dokuments:", err);
      alert("Beim Löschen ist etwas schiefgelaufen. Bitte versuchen Sie es in ein paar Augenblicken erneut.");
    }
  };

  useEffect(() => {
    readData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8" style={{ color: ColorPalets.textPrimary }}>
        Lade Nachrichten...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-8" style={{ color: ColorPalets.error }}>
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl font-semibold mb-6" style={{ color: ColorPalets.textSecondary }}>
        Nachrichten verwalten:
      </h2>
      {data.length === 0 ? (
        <p style={{ color: ColorPalets.textPrimary }}>Keine Nachrichten zum Anzeigen.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item) => (
            <div
              className="p-4 rounded-lg shadow-md flex flex-col"
              style={{
                backgroundColor: ColorPalets.primaryLight,
                color: ColorPalets.textPrimary,
              }}
              key={item.id}
            >
              <div className="message flex-grow">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-2">von {item.name}</p>

                <div className="news-details grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p>
                    <strong>Beschreibung:</strong> {item.description}
                  </p>
                  <p>
                    <strong>Link:</strong> {item.link || "Kein Link vorhanden"}
                  </p>
                </div>

                <div className="info-details mt-4 border-t pt-3 border-gray-300">
                  <h4 className="font-semibold mb-2">Uploader-Informationen:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                    <p>
                      <strong>Uploader:</strong> {item.info.uplodeby}
                    </p>
                    <p>
                      <strong>Rolle:</strong> {item.info.role}
                    </p>
                    <p>
                      <strong>Zeitstempel:</strong>{" "}
                      {item.info.timestamp ? item.info.timestamp.toLocaleString() : "N/A"}
                    </p>
                    <p>
                      <strong>IP:</strong> {item.info.ip}
                    </p>
                    <p>
                      <strong>Land:</strong> {item.info.country}
                    </p>
                    <p>
                      <strong>Region:</strong> {item.info.region}
                    </p>
                    <p>
                      <strong>Stadt:</strong> {item.info.city}
                    </p>
                    <p>
                      <strong>Zeitzone:</strong> {item.info.timezone}
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mt-4 self-start"
                onClick={() => deleteItem(item.id)}
              >
                Löschen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeleteNews;