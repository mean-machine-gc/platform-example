import { dtFromMsg, isFailure, succeed } from "dc-ts";
import { CategorizeWasteWf, CreateWasteWf, StoreWasteWf, Waste, WasteWf, WeightWasteWf } from "../waste-bag/workflows";
import { newWasteEVT } from "./constructors";
import { v4 as uuid } from 'uuid';


export const decideWaste = (cmd: WasteWf['cmd']) => (state: WasteWf['aggregate']) => {
    switch(cmd.type){
        case "create-waste":
            return _decideCreateWaste(cmd)(state)
        case "weight-waste":
            return _decideWeightWaste(cmd)(state)
        case "categorize-waste":
            return _decideCategorizeWaste(cmd)(state)
        case "store-waste":
            return _decideStoreWaste(cmd)(state)
    }
}

const _decideCreateWaste = (cmd: CreateWasteWf['cmd']) => (state: CreateWasteWf['aggregate']) => {
    const dt = dtFromMsg(cmd)
    const wasteId = uuid()
    const createdEventRes = newWasteEVT<CreateWasteWf['evt']>()('waste-created')(dt)({
        createdBy: cmd.data.userId,
        createdAt: +Date.now(),
        healthFacilityId: cmd.data.helathFacilityId,
        wasteId,
        weight: cmd.data.weight,
        category: cmd.data.category
    })
    if(isFailure(createdEventRes)){
        return createdEventRes
    }
    return succeed([createdEventRes['data']])
}

export const _decideWeightWaste = (cmd: WeightWasteWf['cmd']) => (state: WeightWasteWf['aggregate']) => {
    const waste = state.waste as Waste
    const dt = dtFromMsg(cmd)
    const wasteWeightedEvtRes = newWasteEVT<WeightWasteWf['evt']>()('waste-weighted')(dt)({
        wasteId: cmd.data.wasteId,
        weightedAt: +Date.now(),
        weight: cmd.data.weight,
        weightedBy: cmd.data.userId,
        healthFacilityId: cmd.data.helathFacilityId
    })
    if(isFailure(wasteWeightedEvtRes)){
        return wasteWeightedEvtRes
    }
    return succeed([wasteWeightedEvtRes['data']])
}

const _decideCategorizeWaste = (cmd: CategorizeWasteWf['cmd']) => (state: CategorizeWasteWf['aggregate']) => {
    const waste = state.waste as Waste
    const dt = dtFromMsg(cmd)
    const wasteCategorizedEvtRes = newWasteEVT<CategorizeWasteWf['evt']>()('waste-categorized')(dt)({
        wasteId: cmd.data.wasteId,
        categorizedAt: +Date.now(),
        category: cmd.data.category,
        categorizedBy: cmd.data.userId,
        healthFacilityId: cmd.data.helathFacilityId
    })
    if(isFailure(wasteCategorizedEvtRes)){
        return wasteCategorizedEvtRes
    }
    return succeed([wasteCategorizedEvtRes['data']])
}


const _decideStoreWaste = (cmd: StoreWasteWf['cmd']) => (state: StoreWasteWf['aggregate']) => {
    const dt = dtFromMsg(cmd)
    const wasteStoredEvtRes = newWasteEVT<StoreWasteWf['evt']>()('waste-stored')(dt)({
        storedAt: +Date.now(),
        storedBy: cmd.data.userId,
        healthFacilityId: cmd.data.helathFacilityId,
        wasteId: cmd.data.wasteId,
        storageLocation: cmd.data.storageLocation
    })
    if(isFailure(wasteStoredEvtRes)){
        return wasteStoredEvtRes
    }
    return succeed([wasteStoredEvtRes['data']])
}