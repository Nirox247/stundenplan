import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import ColorPalets from "../ColorPalets";
import { usePermissions } from "../scripts/permissions";
import { setUserId } from "firebase/analytics";
import DefaultButton from "../Buttons/Btn";

function ChangeNews() {
  const [UploadState, setUploadState] = useState("");
  const [Username, setUserName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isloading, setLoading] = useState(false);
  const { role, name, loading } = usePermissions();

  const changeName = () => {
    setUserName(name ?? "");

  };
  const handleUpload = async () => {
    setLoading(true);

    const dataToUpload = {
      name: Username,
      title,
      description,
      link,
      timestamp: new Date(),
      
    };
      try {
      if (dataToUpload.name && dataToUpload.title && dataToUpload.description) {
        const docRef = await addDoc(collection(db, "news"), dataToUpload);
        console.log("Dokument geschrieben mit ID:", docRef.id);
        setUploadState("✅ Daten erfolgreich hochgeladen!");
        setUserName("");
        setTitle("");
        setDescription("");
        setLink("");
      } else {
        setUploadState("❌ Bitte alle Pflichtfelder ausfüllen.");
      }
    } catch (e) {
      console.error("Fehler beim Hinzufügen des Dokuments:", e);
      setUploadState("❌ Fehler beim Hochladen der Daten.");
    } finally {
      setLoading(false);
    }
  };
  
    useEffect(() => {
    changeName();
  }, [])

  if(loading){ 
    changeName
    return (
    <p style={{ color: ColorPalets.textPrimary }}>Lade Daten...</p>) 
    }

    
    return (
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          📰 News hinzufügen
        </h2>
        <div className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              className="p-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              value={Username ?? ""}
              onChange={(e) => setUserName(e.target.value)}
            
            />
          </div>
          <input
            type="text"
            placeholder="Titel"
            className="p-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Beschreibung"
            className="p-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Link (optional)"
            className="p-3 rounded-lg border border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <DefaultButton 
          className="mt-5 "
          text={isloading ? "⏳ Hochladen..." : "🚀 Hochladen"}
          onClick={handleUpload}
        />
        </div>

        

          

        {UploadState && (
          <p className="mt-4 text-sm font-medium text-slate-700">{UploadState}</p>
        )}
      </div>
    );
}


export default ChangeNews;
