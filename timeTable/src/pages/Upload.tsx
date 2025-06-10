import UplodeCard from "../components/Uplodes/Uplodecart";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { usePermissions } from "../components/scripts/permissions";

function Upload() {
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [link, setLink] = useState("");
    const [MaxMembers, setMaxMembers] = useState(0);
    const { role, name, loading } = usePermissions();
    const [isloading, setIsLoading] = useState(false)
    const [ipapiData, setIpapiData] = useState<any>({});
    const [ipifyData, setIpifyData] = useState<any>({});
    const [uploadState, setUploadState] = useState<string>("");

    useEffect(() => {
      const fetchIPs = async () => {
        const [ipapi, ipify] = await Promise.all([
          fetch("https://ipapi.co/json/").then(res => res.json()).catch(() => ({})),
          fetch("https://api.ipify.org?format=json").then(res => res.json()).catch(() => ({})),
        ]);
        setIpapiData(ipapi);
        setIpifyData(ipify);
      };
      fetchIPs();
    }, []);

    const handleUpload = async (activeTab: "news" | "courses") => {
        setIsLoading(true);
        setUploadState(""); 
        try {
            if (activeTab === "news") {
                await addDoc(collection(db, "news"), {
                    fields: [
                        { label: "Name", value: username },
                        { label: "Titel", value: title },
                        { label: "Beschreibung", value: desc },
                        { label: "Anzahl", value: MaxMembers.toString() },
                        { label: "Link", value: link }
                    ],

                    info: { 
                    uplodeby: name,
                    role: role,
                    timestamp: new Date(),
                    ip: ipifyData.ip,
                    country: ipapiData.country_name,
                    city: ipapiData.city,
                    region: ipapiData.region,
                    region_code: ipapiData.region_code,
                    timezone: ipapiData.timezone,
                }
                });
                setUploadState("✅ News hochgeladen!");
            } else {
                await addDoc(collection(db, "courses"), {
                fields: [
                        { label: "Name", value: username },
                        { label: "Titel", value: title },
                        { label: "Beschreibung", value: desc },
                        { label: "Link", value: link }
                    ],
                    
                    info: { 
                    uplodeby: name,
                    role: role,
                    timestamp: new Date(),
                    ip: ipifyData.ip,
                    country: ipapiData.country_name,
                    city: ipapiData.city,
                    region: ipapiData.region,
                    region_code: ipapiData.region_code,
                    timezone: ipapiData.timezone,
                }
                });
                setUploadState("✅ Kurs hochgeladen!");
            }
        } catch (e) {
            setUploadState("❌ Fehler beim Hochladen!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setUsername(name || "");
        
    }, [name])

    if (loading) {
        return <div>Lade Berechtigungen...</div>;
    }
    if (role !== "admin") {
        return <div>Kein Admin</div>;
    }

    return (
        <div className="flex justify-center min-w-full">
            <UplodeCard
                headline="Neuer Eintrag"
                className='w-20/10'
                fields={[
                    {
                        placeholder: "Name",
                        value: username,
                        className: 'w-6/12',
                        onChange: e => setUsername(e.target.value),
                        TextArea: false
                    },
                    {
                        placeholder: "Titel",
                        value: title,
                        className: 'w-8/12',
                        onChange: e => setTitle(e.target.value),
                        TextArea: false
                    },
                    {
                        placeholder: "Beschreibung",
                        value: desc,
                        className: 'w-12/12',
                        onChange: e => setDesc(e.target.value),
                        TextArea: true
                    },
                    {
                        placeholder: "Anzahl",
                        type: "number",
                        value: MaxMembers.toString(),
                        className: 'w-3/12',
                        onChange: e => setMaxMembers(Number(e.target.value)),
                        TextArea: false
                    },
                    {
                        placeholder: "Link(optional)",
                        value: link,
                        className: 'w-10/12',
                        onChange: e => setLink(e.target.value),
                        TextArea: false
                    },
                ]}

                onClickBtn={() => handleUpload("news")}
                uploadState={uploadState}      
                isloading={isloading}          
                
            />
        </div>
    );
}

export default Upload;