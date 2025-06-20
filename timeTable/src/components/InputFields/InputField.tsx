import React from "react"
import ColorPalets from "../ColorPalets"

interface InputProps {
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
  

function InputField ({ description = false, ...props }: InputProps){
 return props.select ? (
    <div>
    <select
        className={`${ColorPalets.inputfield} ${props.className || ""}`}
        value={props.value || ""}
        onChange={props.onChange}
    >
        {props.options?.map((option, index) => (
            <option key={index} value={option}>
                {option}
            </option>
        ))}
    </select>
    {description ? <p>{props.placeholder}</p> :
        null}
</div>
) : props.TextArea ? (
        <div>
            <textarea
                className={`${ColorPalets.inputfield} ${props.className || ""}`}
                style={{}}
                value={props.value || ""}
                onChange={props.onChange}
                placeholder={props.placeholder}
                rows={props.rows || 3}
                cols={props.colos || 30}
            />
 {description ? <p>{props.placeholder}</p> :
        null}
           
        </div>
    ) : (
        <div>
            <input
                className={`${ColorPalets.inputfield} ${props.className || ""}`}
                type={props.type}
                style={{
            
                }}
                value={props.value || ""}
                onChange={props.onChange}
                placeholder={props.placeholder}
            />
 {description ? <p>{props.placeholder}</p> :
        null}
        </div>
       
    );
}
export default InputField