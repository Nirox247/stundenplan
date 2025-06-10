import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import ColorPalets from "../components/ColorPalets";
import { usePermissions } from "../components/scripts/permissions"; // Wenn du es hier verwenden möchtest

// --- Neue Typdefinition für ein Nachrichtenelement ---
interface NewsInfo {
    uplodeby: string;
    role: string;
    timestamp: any; // Firestore Timestamp, wird in Date konvertiert
    ip: string;
    country: string;
    city: string;
    region: string;
    region_code: string; // Hinzugefügt, da in deinem Upload-Code
    timezone: string;
}

interface NewsItem {
    id: string;
    title: string;
    description: string;
    link: string;
    name: string; // Der Name aus den Fields
    info: NewsInfo; // Das info-Objekt
}

function DeleteNews() {
    const [data, setData] = useState<NewsItem[]>([]);
    // const { role, name, loading } = usePermissions(); // Wenn du hier Zugriff prüfen möchtest

    // Daten auslesen und Felder extrahieren
    const readData = async () => {
        try {
            const snapshot = await getDocs(collection(db, "news"));
            const items: NewsItem[] = snapshot.docs.map((docSnap) => {
                const docData = docSnap.data(); // Keine 'any' direkt hier
                
                let title = "";
                let description = "";
                let link = "";
                let name = "";
                let info: NewsInfo = { // Standardwerte, falls info fehlt oder unvollständig ist
                    uplodeby: "N/A",
                    role: "N/A",
                    timestamp: null, // Wird unten korrekt behandelt
                    ip: "N/A",
                    country: "N/A",
                    city: "N/A",
                    region: "N/A",
                    region_code: "N/A",
                    timezone: "N/A",
                };

                // Daten aus dem 'fields'-Array extrahieren
                if (Array.isArray(docData.fields)) {
                    for (const field of docData.fields) {
                        if (field.label === "Titel") title = field.value;
                        if (field.label === "Beschreibung") description = field.value;
                        if (field.label === "Link") link = field.value;
                        if (field.label === "Name") name = field.value;
                        // Beachte: "Anzahl" ist in deinen News-Feldern im Upload-Code, aber nicht hier extrahiert.
                        // Für News ist das wahrscheinlich nicht relevant, aber beachte es.
                    }
                }

                // Das 'info'-Objekt direkt zuweisen und ggf. Werte überschreiben
                if (docData.info) {
                    info = {
                        uplodeby: docData.info.uplodeby || "N/A",
                        role: docData.info.role || "N/A",
                        // Firestore Timestamp in ein JavaScript Date Objekt umwandeln
                        timestamp: docData.info.timestamp ? docData.info.timestamp.toDate() : null,
                        ip: docData.info.ip || "N/A",
                        country: docData.info.country || "N/A",
                        city: docData.info.city || "N/A",
                        region: docData.info.region || "N/A",
                        region_code: docData.info.region_code || "N/A",
                        timezone: docData.info.timezone || "N/A",
                    };
                }

                return {
                    id: docSnap.id,
                    title,
                    description,
                    link,
                    name,
                    info, // Das komplette info-Objekt zugewiesen
                };
            });
            setData(items);
        } catch (error) {
            console.error("Fehler beim Lesen der Daten:", error);
            alert("Fehler beim Laden der Nachrichten. Bitte versuchen Sie es später noch einmal.");
        }
    };

    // Löschen eines Dokuments
    const deleteItem = async (id: string) => {
        if (!window.confirm("Sind Sie sicher, dass Sie diese Nachricht löschen möchten?")) {
            return; // Abbruch, wenn der Benutzer nicht bestätigt
        }
        try {
            await deleteDoc(doc(db, "news", id));
            // Daten neu laden, um den gelöschten Eintrag zu entfernen
            readData();
        } catch (error) {
            console.error("Fehler beim Löschen des Dokuments:", error);
            alert('Beim Löschen ist etwas schiefgelaufen. Bitte versuchen Sie es in ein paar Augenblicken erneut.');
        }
    };

    useEffect(() => {
        readData();
    }, []);

    // Optional: Zugriffskontrolle, wenn nur Admins löschen dürfen
    // if (loading) {
    //   return <div>Lade Berechtigungen...</div>;
    // }
    // if (role !== 'admin') { // Beispiel: Nur Admins dürfen löschen
    //   return (
    //     <div style={{ color: ColorPalets.textPrimary, padding: '20px' }}>
    //       <p>Du hast keine Berechtigung, Nachrichten zu löschen.</p>
    //     </div>
    //   );
    // }

     return (
        <div className="p-4 md:p-6 lg:p-8"> {/* Äußerer Container für Padding */}
            <h2 className="text-2xl font-semibold mb-6" style={{ color: ColorPalets.textSecondary }}>
                Nachrichten verwalten:
            </h2>
            {data.length === 0 ? (
                <p style={{ color: ColorPalets.textPrimary }}>Keine Nachrichten zum Anzeigen.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {data.map((item) => (
                        <div
                            className="p-4 rounded-lg shadow-md flex flex-col" // flex flex-col für Button-Ausrichtung
                            style={{
                                backgroundColor: ColorPalets.primaryLight,
                                color: ColorPalets.textPrimary,
                            }}
                            key={item.id}
                        >
                            <div className="message flex-grow"> {/* flex-grow, um Button nach unten zu schieben */}
                                {/* Überschrift für die Nachrichtendetails */}
                                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 mb-2">von {item.name}</p>

                                <div className="news-details grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <p><strong>Beschreibung:</strong> {item.description}</p>
                                    <p><strong>Link:</strong> {item.link || "Kein Link vorhanden"}</p>
                                </div>
                                
                                {/* Info-Bereich */}
                                <div className="info-details mt-4 border-t pt-3 border-gray-300">
                                    <h4 className="font-semibold mb-2">Uploader-Informationen:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                        <p><strong>Uploader:</strong> {item.info.uplodeby}</p>
                                        <p><strong>Rolle:</strong> {item.info.role}</p>
                                        <p><strong>Zeitstempel:</strong> {item.info.timestamp ? item.info.timestamp.toLocaleString() : "N/A"}</p>
                                        <p><strong>IP:</strong> {item.info.ip}</p>
                                        <p><strong>Land:</strong> {item.info.country}</p>
                                        <p><strong>Region:</strong> {item.info.region}</p>
                                        <p><strong>Stadt:</strong> {item.info.city}</p>
                                        <p><strong>Zeitzone:</strong> {item.info.timezone}</p>
                                        {/* `region_code` wird wahrscheinlich nicht direkt angezeigt, kann aber nützlich sein */}
                                    </div>
                                </div>
                            </div> {/* Ende von message flex-grow */}
                            
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mt-4 self-start" // self-start für Ausrichtung
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