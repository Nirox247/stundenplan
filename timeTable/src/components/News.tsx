import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ColorPalets from "./ColorPalets";

type NewsItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  name: string;
};

function News() {
  const [dataNews, setDataNews] = useState<NewsItem[]>([]);

  const readData = async () => {
    const snapshot = await getDocs(collection(db, "news"));
    const items = snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      // Felder aus dem fields-Array extrahieren:
      let title = "";
      let description = "";
      let link = "";
      let name = "";
      if (Array.isArray(data.fields)) {
        for (const field of data.fields) {
          if (field.label === "Titel") title = field.value;
          if (field.label === "Beschreibung") description = field.value;
          if (field.label === "Link") link = field.value;
          if (field.label === "Name") name = field.value;
        }
      }
      return {
        id: doc.id,
        title,
        description,
        link,
        name,
      };
    });
    setDataNews(items);
  };

  useEffect(() => {
    readData();
  }, []);

  return (
    <div
      className="news p-1 w-80 rounded-3xl shadow-md flex flex-col gap-4
     justifiy-center items-center 
     max-h-[calc(100vh-7rem)] pb-6"
      style={{ backgroundColor: ColorPalets.primaryLight, color: ColorPalets.textPrimary }}
    >
      <h2 style={{ color: ColorPalets.primaryDark, marginBottom: "1rem" }}>News</h2>
      <ul className="flex-1 h-full overflow-auto scrollbar-hide p-1
      flex flex-col items-center ">
        {dataNews.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <li
              key={item.id}
              className="p-4 rounded-lg shadow-sm mb-4 transition-all
            max-w-[calc(44vh-7rem)] mt-3 min-w-[calc(44vh-7rem)]
            hover:shadow-xl
             duration-200 ease-in-out hover:scale-105 hover:shadow-lg hover:rounded-2xl"
              style={{
                backgroundColor: isEven ? ColorPalets.primary : ColorPalets.primaryDark,
                color: isEven ? ColorPalets.textPrimary : ColorPalets.white,
              }}
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <p className="text-xs" style={{ color: ColorPalets.textSecondary }}>
                  von {item.name}
                </p>
                {isEven && (
                  <span style={{ fontSize: "0.75rem", color: ColorPalets.primaryDark, marginLeft: "0.5rem" }}>
                    Weiterlesen
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default News;