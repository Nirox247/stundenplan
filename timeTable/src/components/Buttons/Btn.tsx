import React from "react";
import ColorPalets from "../ColorPalets";
import { hover } from "framer-motion";

interface BtnProps {
    text: string,
    onClick?: () => void,
    className?: string,
  children?: React.ReactNode;
}

function DefaultButton(props: BtnProps) {
const [hovered, setHovered] = React.useState(false);

    return (
        <button
        className={` rounded-lg hover:mb-3
            ${props.className} `}
        style={{
         backgroundColor: hovered ? ColorPalets.success : ColorPalets.accentLight,
        color: ColorPalets.textPrimary,
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.1s ease-in-out',
        transform: hovered ? ' scale(1.05)' : 'scale(1)',

        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={props.onClick}
        >
            {props.text}
        </button>
    );
}
export default DefaultButton;