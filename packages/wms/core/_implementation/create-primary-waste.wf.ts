import { composeWf, DomainTrace, dtFromMsg, SafeParse, safeParseTBox, succeed } from "dc-ts";
import { v4 as uuid } from 'uuid';

import { CreatePrimaryWasteWf } from "../workflows";
import { WasteWfState, Weight } from "./__schema__";
import { CreatedWaste } from "../waste";
import { newWasteEVT } from "./constructors";

const _parse = safeParseTBox(WasteWfState)
const _invariant: CreatePrimaryWasteWf['invariant'] = (cmd) => (state) => {
    return succeed(state)
}
const _constrain: CreatePrimaryWasteWf['constrain'] = (cmd) => (state) => {
    return succeed(state)
}

const _constrains: CreatePrimaryWasteWf['constrain'][] = [_constrain]

const _transition: CreatePrimaryWasteWf['transition'] = (cmd) => (state) => {
    const id = uuid()
    const waste: CreatedWaste = {id, macro: 'primary', ...cmd.data}
    const dt: DomainTrace = dtFromMsg(cmd)
    const evtRes = newWasteEVT<CreatePrimaryWasteWf['evt']>()('primary-waste-created')(dt)({waste})
    return evtRes
}

export const createPrimaryWasteWf = composeWf(_parse)(_invariant)(_constrains)(_transition)
