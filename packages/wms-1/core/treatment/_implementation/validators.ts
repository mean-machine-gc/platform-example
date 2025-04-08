import { newAgg, newCmd, newEvt, safeParseTBox } from "dc-ts"
import { TreatmentWf } from "../treatment"
import { TreatmentAggregate, TreatmentCmd, TreatmentEvt } from "./_schema"

export const newTreatmentCMD =<C extends TreatmentWf['cmd']>() =>{
    return newCmd<C['type'], C['data']>(safeParseTBox(TreatmentCmd))
} 

export const newTreatmentEVT =<E extends TreatmentWf['evt']>() =>{
    return newEvt<E['type'], E['data']>(safeParseTBox(TreatmentEvt))
} 

export const newTreatmentAgg = <A extends TreatmentWf['aggregate']>() => {
    return newAgg<A>(safeParseTBox(TreatmentAggregate))
}