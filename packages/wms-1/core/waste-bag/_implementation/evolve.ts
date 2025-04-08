import { ReadyToStore, StoredWaste, TreatedWaste, Waste, WasteWf } from "../workflows"
import { v4 as uuid } from 'uuid';


export const evolveWaste = (evt: WasteWf['evt']) => (state: WasteWf['aggregate'] ): WasteWf['aggregate'] => {
    let waste = state.waste as Waste
    switch(evt.type){
        case 'waste-created':
            return {
                waste: {
                    status: 'created',
                    wasteId: uuid(),
                    weight: evt.data.weight,
                    category: evt.data.category,
                }
            }
        case 'waste-ready-for-storage':
            return {
                waste: {
                    ...waste,
                    status: 'ready-to-store'
                } as ReadyToStore
            }
        case 'waste-weighted':
            return {
                waste: {
                    ...waste,
                    status: 'created',
                    weight: evt.data.weight,
                }
            }
        case 'waste-categorized':
            return {
                waste: {
                    ...waste,
                    status: 'created',
                    category: evt.data.category,
                }
            }
        case 'waste-stored':
            return {
                waste: {
                    ...waste,
                    storageLocation: evt.data.storageLocation,
                    status: 'stored'
                } as StoredWaste
            }
        case 'waste-treated': 
            return {
                waste: {
                    ...waste,
                    status: 'treated'
                } as TreatedWaste

            }
    }
}