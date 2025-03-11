import { safeParseTBox, succeed, fail, dtFromMsg, composeWf } from "dc-ts";
import { v4 as uuid } from 'uuid';

import { WasteWfState } from "./__schema__";
import { CreateSecondaryWasteWf } from "../workflows";
import { SecondaryCreatedWaste } from "../waste";
import { newWasteEVT } from "./constructors";

const _parse = safeParseTBox(WasteWfState)
const _invariant: CreateSecondaryWasteWf['invariant'] = (cmd) => (state) => {
    return succeed(state)
}

const matchCategory = (given: any, required: any) => true

const _checkMatchingSecondaryCategory: CreateSecondaryWasteWf['constrain'] = (cmd) => (state) => {
    const isValid = matchCategory(cmd.data.category, state.category)
    return isValid ?
    succeed(state) :
    fail('secondary_category_does_not_match_primary_waste_configuration', {given: cmd.data.category, expected: state.category})
}

const _constrains = [_checkMatchingSecondaryCategory]

const _transition: CreateSecondaryWasteWf['transition'] = (cmd) => (state) => {
    const id = uuid()
    const waste: SecondaryCreatedWaste = {
        id,
        macro: 'secondary',
        category: cmd.data.category,
        primaryWasteRef: cmd.data.primaryWasteRef
    }
    const dt = dtFromMsg(cmd)
    const evtRes = newWasteEVT<CreateSecondaryWasteWf['evt']>()('secondary-waste-created')(dt)({waste})
    return evtRes
}

export const createSecondaryWasteWf = composeWf(_parse)(_invariant)(_constrains)(_transition)