import { InputKindDefaults } from "./Input.types";

export const inputKindDefaults: InputKindDefaults = {
    text: { placeholder: "Type something..." },
    email: {
        type: "email",
        inputMode: "email",
        autoComplete: "email",
        placeholder: "you@company.com",
    },
    tel: {
        type: "tel",
        inputMode: "tel",
        autoComplete: "tel",
        placeholder: "+234 800 000 0000",
    },
    url: {
        type: "url",
        inputMode: "url",
        autoComplete: "url",
        placeholder: "https://company.com",
    },
    search: {
        type: "search",
        inputMode: "search",
        autoComplete: "off",
        placeholder: "Search...",
    },
    numeric: {
        type: "text",
        inputMode: "numeric",
        autoComplete: "off",
        placeholder: "Enter a number",
    },
    "password-current": {
        type: "password",
        autoComplete: "current-password", 
        placeholder: "••••••••"
    },
    "password-new": {
        type: "password",
        autoComplete: "new-password",
        placeholder: "Create a password"
    },

    number: {
        type: "number",
        inputMode: "decimal",
        autoComplete: "off",
        placeholder: "0.00",
    },
    date: {
        type: "date",
        inputMode: "none",
        placeholder: "YYYY-MM-DD",
    },
    time: {
        type: "time",
        inputMode: "none",
        placeholder: "HH:MM",
    },
    "datetime-local": {
        type: "datetime-local",
        inputMode: "none",
        placeholder: "YYYY-MM-DDTHH:MM",
    },
    month: {
        type: "month",
        inputMode: "none",
        placeholder: "YYYY-MM",
    },
    week: {
        type: "week",
        inputMode: "none",
        placeholder: "YYYY-Www",
    },
};