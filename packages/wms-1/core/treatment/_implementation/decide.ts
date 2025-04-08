import { dtFromMsg, isFailure, succeed } from "dc-ts";
import { TreatmentWf, CreateTreatmentWf } from "../treatment";
import { newTreatmentEVT } from "./validators";
import { v4 as uuid } from 'uuid';

export const decideTreatment = (cmd: TreatmentWf['cmd']) => (state: TreatmentWf['aggregate']) => {
    switch(cmd.type){
        case "create-treatment":
            return _decideCreateTreatment(cmd)(state as CreateTreatmentWf['inputAg'])
        case "load-treatment":
        case "start-treatment":
        case "complete-treatment":
    }
}

const _decideCreateTreatment = (cmd: CreateTreatmentWf['cmd']) => (state: CreateTreatmentWf['inputAg']) => {
    const dt = dtFromMsg(cmd)
    const treatmentCreatedEvtRes = newTreatmentEVT<CreateTreatmentWf['evt']>()('treatment-created')(dt)({
        createdBy: cmd.data.userId,
        createdAt: +Date.now(),
        treatmentId: uuid(),
        treatmentType: state.data.treatement.treatmentType,
        healthFacilityId: cmd.data.healthFacility.healthFacilityId,
        loadingEquipment: {
            ...cmd.data.loadingEquipment,
            currentLoad: {
                weight: {weight: 0, uom: 'g'},
                weightPercent: 0,
                volume: {uom: 'liters', volume: 0},
                volumePercent: 0
            }
        },
        otherEquipment: cmd.data.otherEquipment
    })
    if(isFailure(treatmentCreatedEvtRes)){
        return treatmentCreatedEvtRes
    }
    return succeed([treatmentCreatedEvtRes['data']])
}