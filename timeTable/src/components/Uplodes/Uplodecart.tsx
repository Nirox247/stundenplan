import React from 'react';
import ColorPalets from '../ColorPalets';
import InputField from '../InputFields/InputField';
import DefaultButton from "../Buttons/Btn";

interface FieldProps {
  TextArea?: boolean;
  placeholder: string;
  value?: string;
  type: string;
  className?: string;
  rows?: number;
  colos?: number;
  description?: boolean;
  select?: boolean;
  options?: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

interface CardProps {
  headline: string;
  className?: string;
  fields: FieldProps[];
  ButtonText?: string;
  onClickBtn?: () => void;
  uploadState?: string;
  isloading?: boolean;
  activeTab: "news" | "courses";
  setActiveTab: (tab: "news" | "courses") => void;
}

function UplodeCard({
  headline,
  className = "",
  fields,
  ButtonText = "🚀 Hochladen",
  onClickBtn,
  uploadState,
  isloading,
  activeTab,
  setActiveTab
}: CardProps) {
  return (
    <div
      className={`card max-w-xl mx-auto mt-10 p-6 rounded-xl shadow-md ${className}`}
      style={{
        background: ColorPalets.primaryLight,
        color: ColorPalets.textPrimary,
      }}
    >
      <div className="flex gap-4 mb-6">
        {["news", "courses"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "news" | "courses")}
            style={{
              background:
                activeTab === tab
                  ? ColorPalets.primaryDark
                  : ColorPalets.primaryLight,
              color:
                activeTab === tab
                  ? ColorPalets.white
                  : ColorPalets.textPrimary,
              borderRadius: "0.5rem",
              padding: "0.5rem 1.5rem",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow:
                activeTab === tab
                  ? `0 2px 8px 0 ${ColorPalets.primaryDark}33`
                  : "none",
            }}
          >
            {tab === "news" ? "Upload News" : "Upload Course"}
          </button>
        ))}
      </div>

      <div className='flex flex-col gap-5 bg-white p-6 rounded-xl shadow-md'>
        <p className='mb-4 text-2xl font-bold'>
          {activeTab === "news" ? "📰 Nachricht erstellen" : "📚 Kurs erstellen"}
        </p>

        {/* Kurs-Felder nebeneinander anzeigen */}
{activeTab === "courses" && (
  <>
    <div className="flex flex-wrap gap-4">
      {fields
        .filter(field =>
          ["Anzahl", "Wochentag", "Stunde", "Dauer"].includes(field.placeholder)
        )
        .map((field, idx) => (
          <div className={field.className || "w-full"} key={idx}>
            <InputField {...field} />
          </div>
        ))}
    </div>

        {fields
          .filter(field =>
            !["Anzahl", "Wochentag", "Stunde", "Dauer"].includes(field.placeholder)
          )
          .map((field, idx) => (
            <div className={field.className || "w-full"} key={idx}>
              <InputField {...field} />
            </div>
          ))}
      </>
    )}

    {activeTab === "news" &&
      fields
        .filter(field =>
          !["Anzahl", "Wochentag", "Stunde", "Dauer"].includes(field.placeholder)
        )
        .map((field, idx) => (
          <div className={field.className || "w-full"} key={idx}>
            <InputField {...field} />
          </div>
        ))}


        <DefaultButton
          className='mt-5 w-full'
          text={ButtonText}
          onClick={onClickBtn}
        />

        <div className="w-full text-center mt-2">
          {isloading && <span>Lade...</span>}
          {uploadState && <span>{uploadState}</span>}
        </div>
      </div>
    </div>
  );
}

export default UplodeCard;
