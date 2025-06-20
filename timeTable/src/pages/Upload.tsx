import React, { useEffect, useState } from "react";
import UplodeCard from "../components/Uplodes/Uplodecart";
import { db } from "../firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function Upload() {
  const [activeTab, setActiveTab] = useState<"news" | "courses">("news");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [maxMembers, setMaxMembers] = useState(25);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadState, setUploadState] = useState<string>("");

  const [ipapiData, setIpapiData] = useState<any>({});
  const [ipifyData, setIpifyData] = useState<any>({});

  const { user, role } = useAuth();
  const [userRole, setUserRole] = useState<string>("user");

  // Kurszeit-Felder
  const [day, setDay] = useState("Montag");
  const [hour, setHour] = useState("1");
  const [duration, setDuration] = useState(1);

  const fetchIPs = async () => {
    const [ipapi, ipify] = await Promise.all([
      fetch("https://ipapi.co/json/").then(res => res.json()).catch(() => ({})),
      fetch("https://api.ipify.org?format=json").then(res => res.json()).catch(() => ({})),
    ]);
    setIpapiData(ipapi);
    setIpifyData(ipify);
  };

  useEffect(() => {
    fetchIPs();
  }, []);

  useEffect(() => {
    if (user?.displayName) {
      setUsername(user.displayName);
    }
  }, [user]);

  useEffect(() => {
    const fetchRole = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserRole(data.role || "user");
            if (!user.displayName && data.name) {
              setUsername(data.name);
            }
          }
        } catch (error) {
          console.error("Fehler beim Abrufen der Rolle:", error);
        }
      }
    };
    fetchRole();
  }, [user]);

  const handleUpload = async (activeTab: "news" | "courses") => {
    setIsLoading(true);
    setUploadState("");

    try {
      if (!user) {
        setUploadState("❌ Sie müssen eingeloggt sein!");
        return;
      }

      const effectiveRole = role || userRole;
      if (effectiveRole !== "admin") {
        setUploadState("❌ Nur Admins dürfen Inhalte hochladen!");
        return;
      }

      const uploaderName = username || user.displayName || "Unbekannt";

      const commonData = {
        fields: [
          { label: "Name", value: uploaderName },
          { label: "Titel", value: title },
          { label: "Beschreibung", value: desc },
          ...(activeTab === "courses"
            ? [
                { label: "Anzahl", value: maxMembers.toString() },
                { label: "Wochentag", value: day },
                { label: "Stunde", value: hour },
                { label: "Dauer", value: duration.toString() }
              ]
            : []),
          { label: "Link", value: link || "-" }
        ],
        info: {
          uploadedBy: uploaderName,
          role: effectiveRole,
          timestamp: new Date(),
          ip: ipifyData.ip,
          country: ipapiData.country_name,
          city: ipapiData.city,
          region: ipapiData.region,
          region_code: ipapiData.region_code,
          timezone: ipapiData.timezone,
        }
      };

      const targetCollection = activeTab === "news" ? "news" : "courses";
      await addDoc(collection(db, targetCollection), commonData);

      setUploadState(`✅ ${activeTab === "news" ? "News" : "Kurs"} hochgeladen!`);
    } catch (e: any) {
      console.error("❌ Fehler beim Hochladen:", e.message || e);
      setUploadState("❌ Fehler beim Hochladen!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-w-full grid">
      <UplodeCard
        headline="Neuer Eintrag"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className="w-20/10"
        fields={[
          {
            placeholder: "Name",
            value: username,
            className: "w-6/12",
            description: false,
            onChange: e => setUsername(e.target.value),
            TextArea: false,
            type: "text"
          },
          {
            placeholder: "Titel",
            value: title,
            className: "w-8/12",
            description: false,
            onChange: e => setTitle(e.target.value),
            TextArea: false,
            type: "text"
          },
          {
            placeholder: "Beschreibung",
            value: desc,
            className: "w-12/12",
            description: false,
            onChange: e => setDesc(e.target.value),
            TextArea: true,
            type: "text"
          },
          ...(activeTab === "courses"
            ? [
                {
                  placeholder: "Anzahl",
                  type: "number",
                  value: maxMembers.toString(),
                  className: "w-2/12",
                  onChange: e => setMaxMembers(Number(e.target.value)),
                  TextArea: false,
                  description: true,
                },
                {
                  placeholder: "Wochentag",
                  value: day,
                  onChange: e => setDay(e.target.value),
                  TextArea: false,
                  description: true,
                  type: "text",
                  className: "w-3/10",
                  select: true,
                  options: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"]
                },
                {
                  placeholder: "Stunde",
                  value: hour,
                  onChange: e => setHour(e.target.value),
                  TextArea: false,
                  type: "text",
                  className: "w-3/12",
                  select: true,
                  description: true,
                  options: Array.from({ length: 8 }, (_, i) => (i + 1).toString()),
          
                },
                {
                  placeholder: "Dauer",
                  type: "number",
                  value: duration.toString(),
                  className: "w-2/12",
                  onChange: e => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= 8) setDuration(val);
                  },
                  TextArea: false,
                  description: true
                }
              ]
            : []),
          {
            placeholder: "Link (optional)",
            value: link,
            className: "w-10/12",
            onChange: e => setLink(e.target.value),
            TextArea: false,
            type: "text"
          }
        ]}
        onClickBtn={() => handleUpload(activeTab)}
        uploadState={uploadState}
        isloading={isLoading}
      />
    </div>
  );
}

export default Upload;
