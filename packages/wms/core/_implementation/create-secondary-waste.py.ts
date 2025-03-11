import { composePy, dtFromMsg, safeParseTBox, succeed } from "dc-ts";
import { v4 as uuid } from 'uuid';

import { WastePyState } from "./__schema__";
import { CreateSecondaryWastePy, CreateSecondaryWasteWf } from "../workflows";
import { newWasteCMD } from "./constructors";
import { SecondaryCategory } from "../waste";

const _parse = safeParseTBox(WastePyState)
const _invariant: CreateSecondaryWastePy['invariant'] = (evt) => (state) => {
    return succeed(state)
}

const _constrain: CreateSecondaryWastePy['constrain'] = (evt) => (state) => {
    return succeed(state)
}

const _execute: CreateSecondaryWastePy['execute'] = (evt) => (state) => {
    const data = {
        primaryWasteRef: evt.data.waste.id,
        category: state.category as SecondaryCategory
    }

    const dt = dtFromMsg(evt)
    const cmdRes = newWasteCMD<CreateSecondaryWasteWf['cmd']>()('create-secondary-waste')(dt)(data)
    return cmdRes
}

export const createSecondaryWastePy = composePy(_parse)(_invariant)([_constrain])(_execute)