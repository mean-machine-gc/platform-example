import { Constrain, fail, isFailure, newAgg, Result, succeed } from 'dc-ts';
import { CompleteTreatmentWf, CreateTreatmentWf, LoadTreatmentWf, StartTreatmentWf, TreatmentWf } from '../treatment'
import { newTreatmentAgg } from './validators';

export const constrainTreatment = (cmd: TreatmentWf['cmd']) => (state: TreatmentWf['inputAg']) => {
    switch(cmd.type){
        case 'create-treatment':
            return applyConstrains([
                _hfMustBeEnabled,
                _equipmentMustBeInGoodOrder
            ])(cmd)(state as CreateTreatmentWf['inputAg'])
        case 'load-treatment':
            return applyConstrains([
                _atLeastOneWasteBagLoaded
            ])(cmd)(state as LoadTreatmentWf['inputAg'])
        case 'start-treatment':
            return applyConstrains([])(cmd)(state as StartTreatmentWf['inputAg'])
        case 'complete-treatment':
            return applyConstrains([])(cmd)(state as CompleteTreatmentWf['inputAg'])
        default:
            return succeed(state)
    }
}

const _hfMustBeEnabled = (cmd: CreateTreatmentWf['cmd']) => (state: CreateTreatmentWf['inputAg']) => {
    const allowedTreatments = cmd.data.healthFacility.allowedTreatments
    const treatmentType = cmd.data.treatmentTypeId
    if(allowedTreatments.indexOf(treatmentType) === -1){
        return fail('health_facility_not_allowed')
    }
    return succeed(state)
}

const _equipmentMustBeInGoodOrder = (cmd: CreateTreatmentWf['cmd']) => (state: CreateTreatmentWf['inputAg']) => {
    const equipment = [...cmd.data.otherEquipment, cmd.data.otherEquipment]
    const accumulator = equipment.reduce((acc, val) => {
        if(!val['inGoodOrder']){
            acc = {
                inGoodOrder: false,
                faulty: val
            }
        }
        return acc
    }, {inGoodOrder: true, faulty: {}})
    if(!accumulator.inGoodOrder){
        return fail('equipment_out_of_order', accumulator.faulty)
    }

    return succeed(state)
}

const _atLeastOneWasteBagLoaded = (cmd: LoadTreatmentWf['cmd']) => (state: LoadTreatmentWf['inputAg']) => {
    const wasteBags = cmd.data.waste
    if(!wasteBags.length){
        return fail('no_waste_bags_provided')
    }
    const allowedCategories = state.data.treatement?.treatmentType.acceptedWasteCategories
    if(!allowedCategories || !allowedCategories.length){
        return fail('no_waste_categories_allowed')
    }
    const allowedBags = wasteBags.reduce((acc: any[], val) => {
        if(allowedCategories.indexOf(val.wasteCategoryId) > -1){
            acc = [...acc, val]
        }
        return acc
    }, [])
    if(!allowedBags.length){
        return fail('waste_category_not_allowed')
    }
    return succeed(state)
}


const applyConstrains = <C, S, F extends string>(fns: Constrain<C, S, F>[]) => (cmd: C) => (currState: S) => {
    if(!fns.length){
        return succeed(currState)
    }
    const acc = fns.reduce((acc: any, fn) => {
        const res = fn(cmd)(currState);
        if (isFailure(res)) {
            if (!acc.failedOnce) {
                acc.failedOnce = true;
                acc.res = res;
            }
        }
        return acc;
    }, { failedOnce: false, res: succeed(currState) });

    return acc.res as Result<S, F>;
};