import { safeParseTBox, succeed, fail, dtFromMsg, composeWf } from "dc-ts";
import { WasteWfState } from "./__schema__";
import { WeightWasteWf } from "../workflows";
import { CreatedWaste } from "../waste";
import { newWasteEVT } from "./constructors";

const _parse = safeParseTBox(WasteWfState)
const _invariant: WeightWasteWf['invariant'] = (cmd) => (state) => {
    return cmd.data.wasteId === state.waste.id ?
    succeed(state) :
    fail('ids_dont_match')
}
const _constrain: WeightWasteWf['constrain'] = (cmd) => (state) => {
    return succeed(state)
}

const _transition: WeightWasteWf['transition'] = (cmd) => (state) => {
    const waste: CreatedWaste = {...state.waste, weight: cmd.data.weight}
    const dt = dtFromMsg(cmd)
    const evtRes = newWasteEVT<WeightWasteWf['evt']>()('waste-weighted')(dt)({waste})
    return evtRes
}

export const weightWasteWf = composeWf(_parse)(_invariant)([_constrain])(_transition)
