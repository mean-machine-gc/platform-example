import { composeWf, dtFromMsg, fail, safeParseTBox, succeed } from "dc-ts"
import { WasteWfState } from "./__schema__"
import { CategorizeWasteWf } from "../workflows"
import { CreatedWaste } from "../waste"
import { newWasteEVT } from "./constructors"

const _parse = safeParseTBox(WasteWfState)
const _invariant: CategorizeWasteWf['invariant'] = (cmd) => (state) => {
    return cmd.data.wasteId === state.waste.id ?
    succeed(state) :
    fail('ids_dont_match')
}

const _constrain: CategorizeWasteWf['constrain'] = (cmd) => (state) => {
    return succeed(state)
}

const _transition: CategorizeWasteWf['transition'] = (cmd) => (state) => {
    const waste: CreatedWaste = {...state.waste, category: cmd.data.category}
    const dt = dtFromMsg(cmd)
    const evtRes = newWasteEVT<CategorizeWasteWf['evt']>()('waste-categorized')(dt)({waste})
    return evtRes
}

export const categorizeWsteWf = composeWf(_parse)(_invariant)([_constrain])(_transition)