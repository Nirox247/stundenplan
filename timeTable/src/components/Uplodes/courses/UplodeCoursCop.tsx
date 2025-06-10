import React, { useState,useEffect } from 'react';
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { usePermissions } from "../../scripts/permissions";
import ColorPalets from '../../ColorPalets';


function UplodeCours() {
  const [isLoading, setIsLoading] = useState(false);
  const [UploadState, setUploadState] = useState('');
  const [Username, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const { role, name, loading } = usePermissions();
  
  const changeName = () => {
    setName(name ?? "");
  };

  useEffect(() => {
    changeName();
  }, []);

  const handleUpload = async () => {
    setIsLoading(true);

    const dataToUpload = {
      name: Username,
      title,
      description,
      link,
      timestamp: new Date()
    };
    try {
      if (dataToUpload.name && dataToUpload.title && dataToUpload.description) {
        const docRef = await addDoc(collection(db, "news"), dataToUpload);
        console.log("Dokument geschrieben mit ID:", docRef.id);
        setUploadState('✅ Daten erfolgreich hochgeladen!');
        setName('');
        setTitle('');
        setDescription('');
        setLink('');
      } else {
        setUploadState('❌ Bitte alle Pflichtfelder ausfüllen.');
      }
    } catch (e) {
      console.error("Fehler beim Hinzufügen des Dokuments:", e);
      setUploadState('❌ Fehler beim Hochladen der Daten.');
    } finally {
      setIsLoading(false);
    }
  };

if(loading){
  <p>Loding permissions</p>
}

  return (
    <div>
      <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">📰 News hinzufügen</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            className={`${ColorPalets.inputfield}`}
            value={Username}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Titel"
            className={`${ColorPalets.inputfield}`}            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Beschreibung"
            className={`${ColorPalets.inputfield}`}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Link (optional)"
           className={`${ColorPalets.inputfield}`}
            value={link}
            onChange={e => setLink(e.target.value)}
          />
        </div>

        <button
          className="mt-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded transition"
          onClick={handleUpload}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Hochladen...' : 'Hochladen'}
        </button>

        {UploadState && (
          <p className="mt-4 text-sm font-medium text-slate-700">{UploadState}</p>
        )}
      </div>
    </div>
  );
}

export default UplodeCours;