import { composeWf, dtFromMsg, fail, safeParseTBox, succeed } from "dc-ts"
import { TreatmentConfig, WasteWfState } from "./__schema__"
import { TreatWasteWf } from "../workflows"
import { TreatedWaste, TreatmentInfo } from "../waste"
import { newWasteEVT } from "./constructors"

const _parse = safeParseTBox(WasteWfState)
const _invariant: TreatWasteWf['invariant'] = (cmd) => (state) => {
    return cmd.data.wasteId === state.waste.id ?
    succeed(state) :
    fail('ids_dont_match')
}

const treatmentIsAllowed = (treatment: string, allowedTreatments: string[]) => {
    if(!allowedTreatments.length){
        return false
    }
    return allowedTreatments.indexOf(treatment) > -1
}

const compareTreatmentWithConfig = (treatement, treatmentConfig: TreatmentConfig) => true

const _hfMustHaveTreatmentCapacity: TreatWasteWf['constrain'] = (cmd) => (state) => {
    const hasCapacity = treatmentIsAllowed(cmd.data.treatmentInfo.treatment, state.hfTreatmentCapacity)
    return hasCapacity ?
    succeed(state) :
    fail('hf_has_no_capacity_for_the_selected_treatment', {requested: cmd.data.treatmentInfo, allowed: state.hfTreatmentCapacity})
}

const _treatmentMustMatchTreatmentConfig: TreatWasteWf['constrain'] = (cmd) => (state) => {
    const isValid = compareTreatmentWithConfig(cmd.data.treatmentInfo.treatment, state.hfTreatmentCapacity)
    return isValid ?
    succeed(state) :
    fail('treatment_not_allowed_in_waste_category', {requested: cmd.data.treatmentInfo, allowed: state.treatmentConfig})
}

const _constrains = [
    _hfMustHaveTreatmentCapacity,
    _treatmentMustMatchTreatmentConfig
]

const _transition: TreatWasteWf['transition'] = (cmd) => (state) => {
    const waste: TreatedWaste = {...state.waste, treatmentInfo: {treatment: cmd.data.treatmentInfo.treatment, timestamp: +Date.now()}}
    const dt = dtFromMsg(cmd)
    const evtRes = newWasteEVT<TreatWasteWf['evt']>()('waste-treated')(dt)({waste})
    return evtRes
}

export const treatWasteWf = composeWf(_parse)(_invariant)(_constrains)(_transition)

