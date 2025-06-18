import {Tabs} from "../type/types";

export function getTabColor(tab: Tabs){
    switch (tab){
        case "carrello": return 'var(--mantine-color-blue-5)'
        case "incassi": return 'var(--mantine-color-teal-5)'
        case "magazzino": return 'var(--mantine-color-red-5)'
    }
}