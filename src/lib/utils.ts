import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// TODO : unsure if this is the correct way
export function toDateString(date: string) {
    return new Date(date).toLocaleDateString();
}

export function toTimeString(date: string) {
    return new Date(date).toLocaleTimeString();
}

export function currencyToSymbol(currency: string) {
    switch (currency) {
        case "GBP":
            return "£";
        case "EUR":
            return "€";
        case "USD":
            return "$";
        default:
            return "??";
    }
}
