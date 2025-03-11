import { newCmd, newEvt, safeParseTBox } from "dc-ts";
import { CreatePrimaryWasteWf, WasteCmd, WasteEvt } from "./__schema__";

export const newWasteCMD =<C extends WasteCmd>() =>{
    return newCmd<C['type'], C['data']>(safeParseTBox(WasteCmd))
} 

export const newWasteEVT =<E extends WasteEvt>() =>{
    return newEvt<E['type'], E['data']>(safeParseTBox(WasteEvt))
} 
