import { composeWf, isFailure, succeed } from "dc-ts";
import { CreateWasteWf } from "../workflows";
import { v4 as uuid } from 'uuid';


//parsestate
const _parseState: CreateWasteWf['parseState'] = ({}) => {
    return succeed({})
}

//constrains
const _constrain: CreateWasteWf['constrain'] = (cmd: CreateWasteWf['cmd']) => (state: {}) => {
    return succeed(state)
}
//decide
const _decide: CreateWasteWf['decide'] = (cmd: CreateWasteWf['cmd']) => (state: CreateWasteWf['inState']) => {
    const createdEvent: CreateWasteWf['evt'] = 
    //if all params provided -> ready to store
    if(cmd.data.weight && cmd.data.category){

    } else {

    }
    //if some params missing -> created

}

const _evolve: CreateWasteWf['evolve'] = (evt: CreateWasteWf['evt']) => (state: CreateWasteWf['inState']) => {
    switch(evt.type){
        case "waste-created":
            return {waste: {
                status: 'created',
                wasteId: uuid(),
                weight: evt.data.weight,
                category: evt.data.category
            }}
        case "waste-ready-for-storage":
            return {waste: {
                status: 'ready-to-store',
                wasteId: uuid(),
                weight: evt.data.weight,
                category: evt.data.category
            }}
    }
}

//evolve

export const createWasteWf = composeWf<CreateWasteWf>(_parseState)([_constrain])(_decide)(_evolve)

//valid cmd
const createWasteCmd: CreateWasteWf['cmd'] = {
    msgType: 'cmd',
    type: 'create-waste',
    correlationid: 'abc',
    causationid: 'abc',
    id: 'abc',
    timestamp: 787,
    data: {
        userId: 'abc',
        helathFacilityId: 'abc',
        weight: {uom: 'kg', weight: 3}
    }
}
//retrieve the state
const wfRes = createWasteWf.execute(createWasteCmd)({})

const saveState = (db, msgBroker) => {
    if(isFailure(wfRes)){
        return wfRes
    }

    const state = wfRes['data'].state
    await db.save(state)
    await msgBroker.publish(wfRes['data'].evt)
}