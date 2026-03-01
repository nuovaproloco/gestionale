import {Listitem, Tabs} from "../../common/type/types";
import List from "./list/list.tsx";
import CashFlow from "./cashFlow/cashFlow.tsx";

const Selector = ({tab, list}: {tab: Tabs, list: Listitem[]}) => {
    switch (tab){
        case "magazzino": return <List list={list} path={tab}/>
        case "carrello": return <List list={list} path={tab}/>
        case "incassi": return <CashFlow/>
    }
}

export default Selector;