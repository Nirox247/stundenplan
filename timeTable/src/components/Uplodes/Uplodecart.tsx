import React, { useState, useEffect } from 'react';
import ColorPalets from '../ColorPalets';
import InputField from '../InputFields/InputField';
import DefaultButton from "../Buttons/Btn";
import { usePermissions } from '../scripts/permissions';

interface CardProps {
    headline: string,
    className?: string,
    fields: {
        placeholder: string;
        value: string;
        className?: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
        type?: string;
        TextArea: boolean
    }[];
    ButtonText?: string,
    onClickBtn?: () => void,
    uploadState?: string, 
    isloading?: boolean        
}
function uplodeCard(props: CardProps) {
    const [activeTab, setActiveTab] = useState<"news" | "courses">("news");
    const { role, name, loading } = usePermissions();

    if (loading) {
        return <div>Lade Berechtigungen...</div>;
    }
    if (role !== "admin") {
        return (
            <h1>kein admin</h1> 
        );
    }
    

    return (
        <div className={`card max-w-xl mx-auto mt-10 p-6 rounded-xl shadow-md ${props.className || ""}`}
            style={{
                background: ColorPalets.primaryLight,
                color: ColorPalets.textPrimary,
            }}>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("news")}
                    style={{
                        background:
                            activeTab === "news"
                                ? ColorPalets.primaryDark
                                : ColorPalets.primaryLight,
                        color:
                            activeTab === "news"
                                ? ColorPalets.white
                                : ColorPalets.textPrimary,
                        borderRadius: "0.5rem",
                        padding: "0.5rem 1.5rem",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow:
                            activeTab === "news"
                                ? `0 2px 8px 0 ${ColorPalets.primaryDark}33`
                                : "none",
                    }}
                >
                    Uplode News
                </button>
                <button
                    onClick={() => setActiveTab("courses")}
                    style={{
                        background:
                            activeTab === "courses"
                                ? ColorPalets.primaryDark
                                : ColorPalets.primaryLight,
                        color:
                            activeTab === "courses"
                                ? ColorPalets.white
                                : ColorPalets.textPrimary,
                        borderRadius: "0.5rem",
                        padding: "0.5rem 1.5rem",
                        border: "none",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow:
                            activeTab === "courses"
                                ? `0 2px 8px 0 ${ColorPalets.primaryDark}33`
                                : "none",
                    }}
                >
                    Uplode Course
                </button>
            </div>
            <div className='flex flex-col gap-5 bg-white p-6 rounded-xl shadow-md'>
                <p className='mb-4 text-2xl font-bold'>
                    {activeTab === "news" ? "📰 Nachricht erstellen" : "📚 Kurs erstellen"}
                </p>
                {props.fields
                    .filter(field =>
                        activeTab === "news"
                            ? field.placeholder !== "Anzahl"
                            : true
                    )
                    .map((field, idx) => (
                        <div className={field.className} key={idx}>
                            <InputField
                                className=""
                                palcholer={field.placeholder}
                                value={field.value}
                                onChange={field.onChange}
                                type={field.type || "text"}
                                TextArea={field.TextArea}
                            />
                        </div>
                    ))}
                <DefaultButton
                    className='mt-5 w-full'
                    text={props.ButtonText || "🚀 Hochladen"}
                    onClick={props.onClickBtn}
                />
                <div className="w-full text-center mt-2">
                    {props.isloading && <span>Lade...</span>}
                    {props.uploadState && <span>{props.uploadState}</span>}
                </div>
            </div>
        </div>
    );
}
export default uplodeCard;