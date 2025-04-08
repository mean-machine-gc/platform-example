import { succeed, fail, isFailure, Result, Constrain } from "dc-ts";
import { StoreWasteWf, Waste, WasteWf } from "../waste-bag/workflows";

export const wasteConstrain = (cmd: WasteWf['cmd']) => (state: WasteWf['aggregate']) => {
    switch(cmd.type){
        case "create-waste":
            return succeed(state)
        case "store-waste":
            return applyConstrains([
                _notNullWaste,
                _mustBeWeighted,
                _mustBeCategorized
            ])(cmd)(state)
        case "weight-waste":
        case "categorize-waste":
            return applyConstrains([
                _notNullWaste
            ])(cmd)(state)
    }
}

const _notNullWaste = (cmd: WasteWf['cmd']) => (state: WasteWf['aggregate']) => {
    if(!state.waste){
        return fail('no_waste_provided')
    }
    return succeed(state)
}

const _mustBeWeighted = (cmd: WasteWf['cmd']) => (state: WasteWf['aggregate']) => {
    const waste = state.waste as Waste
    if(!waste.weight){
        return fail('waste_must_be_weighted')
    }
    return succeed(state)
}

const _mustBeCategorized = (cmd: WasteWf['cmd']) => (state: WasteWf['aggregate']) => {
    const waste = state.waste as Waste
    if(!waste.category){
        return fail('waste_must_be_categorized')
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