import { composeWf, dtFromMsg, fail, safeParseTBox, succeed } from "dc-ts"
import { StorageInfo, WasteWfState } from "./__schema__"
import { StoreWasteWf } from "../workflows"
import { StorageConfig, StoredWaste } from "../waste"
import { newWasteEVT } from "./constructors"

const _parse = safeParseTBox(WasteWfState)
const _invariant: StoreWasteWf['invariant'] = (cmd) => (state) => {
    return cmd.data.wasteId === state.waste.id ?
    succeed(state) :
    fail('ids_dont_match')
}

const compareStorageWithConfig = (storageInfo: StorageInfo, storageConfig: StorageConfig) => {
    return true
}

const _storageMustMatchCategorySpecs: StoreWasteWf['constrain'] = (cmd) => (state) => {
    const isValid = compareStorageWithConfig(cmd.data.storageInfo, state.storageConfig)
    return isValid ?
    succeed(state) :
    fail('storage_type_not_allowed', {requested: cmd.data.storageInfo, required: state.storageConfig})
}

const _constrains = [_storageMustMatchCategorySpecs]

const _transition: StoreWasteWf['transition'] = (cmd) => (state) => {
    const waste: StoredWaste = {...state.waste, storage: cmd.data.storageInfo}
    const dt = dtFromMsg(cmd)
    const evtRes = newWasteEVT<StoreWasteWf['evt']>()('waste-stored')(dt)({waste})
    return evtRes
}

export const storeWasteWf = composeWf(_parse)(_invariant)(_constrains)(_transition)