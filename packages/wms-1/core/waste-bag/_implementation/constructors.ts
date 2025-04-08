import { newCmd, newEvt, safeParseTBox } from "dc-ts"
import { WasteWf } from "../waste-bag/workflows"
import { WasteWfCmd, WasteWfEvt } from "./_schema"

export const newWasteCMD =<C extends WasteWf['cmd']>() =>{
    return newCmd<C['type'], C['data']>(safeParseTBox(WasteWfCmd))
} 

export const newWasteEVT =<E extends WasteWf['evt']>() =>{
    return newEvt<E['type'], E['data']>(safeParseTBox(WasteWfEvt))
} 