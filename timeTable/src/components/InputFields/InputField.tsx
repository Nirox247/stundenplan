import React from "react"
import ColorPalets from "../ColorPalets"

interface InputProps{
    TextArea: boolean,
    palcholer: string,
    value?: string,
    type: string,
    className?: string,
    rows?: number,
    colos?: number,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

function InputField (props : InputProps){
    return props.TextArea ? (
        <textarea
            className={`${ColorPalets.inputfield} ${props.className || ""}`}
            style={{}}
            value={props.value || ""}
            onChange={props.onChange}
            placeholder={props.palcholer}
            rows={props.rows || 3}
            cols={props.colos || 30}
        />
    ) : (
        <input
            className={`${ColorPalets.inputfield} ${props.className || ""}`}
            type={props.type}
            style={{
                
            }}
            value={props.value || ""}
            onChange={props.onChange}
            placeholder={props.palcholer}
        />
    );
}
export default InputField