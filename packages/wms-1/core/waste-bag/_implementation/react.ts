import { Constrain, dtFromMsg, fail, isFailure, succeed } from "dc-ts";
import { Policy, SetAsReadyToStoreWf, Waste, WasteReactor } from "../workflows";
import { newWasteCMD } from "./constructors";

const react = (evt: WasteReactor['evt']) => (state: WasteReactor['state']) => {
    switch(evt.type){
        case "waste-created":
        case "waste-weighted":
        case "waste-categorized":
            return applyPolicies([
                _setAsReadyToStore(evt)(state)
            ])(evt)(state)
    }
}

const _setAsReadyToStore = (evt: WasteReactor['evt']) => (state: WasteReactor['state']) => {
    const waste = state.waste as Waste
    if(waste.weight && waste.category){
        const dt = dtFromMsg(evt)
        const cmdRes = newWasteCMD<SetAsReadyToStoreWf['cmd']>()('set-ready-to-store')(dt)({
            wasteId: evt.data.wasteId
        })
        if(isFailure(cmdRes)){
            return cmdRes
        }
        return succeed([cmdRes['data']])
    }
    return fail('not_ready_to_store')
}

const applyPolicies = <E, S, C, F extends string>(fns: Policy<E, S, C, F>[]) => (evt: E) => (state: S) => {
    if(!fns.length){
        const noPolicyFail = fail('no_policies_to_apply')
        return {
            cmd: [],
            fails: [noPolicyFail]
        }
    }
    const acc = fns.reduce((acc: any, fn) => {
        const res = fn(evt)(state);
        if (isFailure(res)) {
            const fails = [...acc.fails, res]
            return {...acc, fails}
        }
        const cmd = [...acc.cmd, ...res['data']]
        return {...acc, cmd};
    }, { cmd: [], fails: [] });

    return acc;
};