import { CMD, CorePy, CoreWf, CoreWfFails, EVT, Failure, SafeParseFails } from 'dc-ts'
import { Category, CreatedWaste, PrimaryCreatedWaste, PrimaryStoredWaste, PrimaryWasteCode, ReadyForStorageWaste, SecondaryCategory, SecondaryCreatedWaste, SecondaryWasteCode, StorageConfig, StorageInfo, StoredWaste, TreatedWaste, TreatmentConfig, TreatmentInfo, Waste, Weight } from './waste'
import { createPrimaryWasteWf } from './_implementation/create-primary-waste.wf'


type InitialState = {}
type AggregateState = {
    storageConfig: StorageConfig 
    treatmentConfig: TreatmentConfig,
    hfTreatmentCapacity: string[],
    isEquipmentInGoodOrder: boolean
    waste: Waste
} | InitialState



export type CreatePrimaryWasteWf = CoreWf<
    CMD<'create-primary-waste', {
        userId: string
        hfId: string
        code?: PrimaryWasteCode
        weight?: Weight
        category?: Category
    }>, 
    InitialState, 
    EVT<'primary-waste-created', {
        createdBy: string
        createdAt: number
        wasteId: string
        hfId: string
        code?: PrimaryWasteCode
        weight?: Weight
        category?: Category
    }> |
    EVT<'waste-ready-for-storage', {
        wasteId: number
    }>,
    AggregateState & {
        waste: CreatedWaste | ReadyForStorageWaste
    }
>

export type WeightWasteWf = CoreWf<
    CMD<'weight-waste', {
        userId: string
        wasteId: string
        hfId: string
        weight: Weight
    }>, 
    AggregateState & {
        waste: CreatedWaste | ReadyForStorageWaste
    }, 
    EVT<'waste-weighted', {
        weightedBy: string
        weightedAt: number
        wasteId: string
        hfId: string
        weight: Weight
    }> |
    EVT<'waste-ready-for-storage', {
        wasteId: number
    }>,
    AggregateState & {
        waste: CreatedWaste | ReadyForStorageWaste
    }
>

export type CategorizeWasteWf = CoreWf<
    CMD<'categorize-waste', {
        userId: string
        hfId: string
        wasteId: string
        category: Category
    }>, 
    AggregateState & {
        waste: CreatedWaste | ReadyForStorageWaste
    }, 
    EVT<'waste-categorized', {
        categorizedBy: string
        categorisedAt: number
        wasteId: string
        hfId: string
        category: Category
    }>|
    EVT<'waste-ready-for-storage', {
        wasteId: number
    }>,
    AggregateState & {
        waste: CreatedWaste | ReadyForStorageWaste
    }
>

export type StoreWasteWf = CoreWf<
    CMD<'store-waste', {
        userId: string
        hfId: string
        wasteId: string
        storageInfo: StorageInfo
    }>, 
    AggregateState & { 
        waste: ReadyForStorageWaste, 
    },
    EVT<'waste-stored', {
        storedBy: string
        storedAt: number
        wasteId: string
        hfId: string
        storageInfo: StorageInfo
    }>,
    AggregateState & {
        waste: StoredWaste
    },
    CoreWfFails |
    'invalid_storage:storage_type_must_match_storage_configurations_for_the_waste_category'
>

export type TreatWasteWf = CoreWf<
    CMD<'treat-waste', {
        userId: string
        hfId: string
        wasteId: string
        treatmentInfo: TreatmentInfo
    }>, 
    AggregateState & { 
        waste: StoredWaste, 
        
    },
    EVT<'waste-treated', {
        treatedBy: string
        treatedAt: number
        hfId: string
        wasteId: string
        treatmentInfo: TreatmentInfo
    }>,
    AggregateState & {
        waste: TreatedWaste
    },
    CoreWfFails |
    'invalid_treatement:treatment_must_match_treatment_type_for_the_waste_category' |
    'no_treatment_allowed:this_waste_category_does_not_allow_internal_treatment' |
    'equipment_out_of_order' |
    'treatment_not_allowed:this_health_facility_is_not_enabled_to_perform_the_required_treatment'
>

export type CreateSecondaryWasteWf = CoreWf<
    CMD<'create-secondary-waste', {
        category: SecondaryCategory
        primaryWasteRef: string
    }>, 
    {category: SecondaryCategory}, 
    EVT<'secondary-waste-created', {
        waste: SecondaryCreatedWaste
    }>
>

export type WasteWf = 
    CreatePrimaryWasteWf |
    WeightWasteWf |
    CategorizeWasteWf |
    StoreWasteWf |
    TreatWasteWf |
    CreateSecondaryWasteWf


export type WasteCmd = WasteWf['cmd']
export type WasteEvt = WasteWf['evt']
export type WasteWfState = WasteWf['state']

//POLICIES:
export type CreateSecondaryWastePy = CorePy<
    TreatWasteWf['evt'],
    {
        category: SecondaryCategory
    },
    CreateSecondaryWasteWf['cmd']
>

const evntListener = (e: WasteWf['']) => {
    switch(e.type){
        cas
    }
}

export type WastePy = CreateSecondaryWastePy
export type WastePyEvt = WastePy['evt']
export type WastePyState = WastePy['state']
export type WastePyCmd = WastePy['cmd']




const decider = (cmd: WasteWf['cmd']) => (state: WasteWf['state']) => {
    switch(cmd.type){
        case 'create-primary-waste':
            return createPrimaryWasteWf(cmd)(state)
        case 'weight-waste':
            return createPrimaryWasteWf(state)

        case 'categorize-waste':
            return createPrimaryWasteWf(state)

        case 'store-waste':
            return createPrimaryWasteWf(state)

        case 'treat-waste':
            return createPrimaryWasteWf(state)

        case 'create-secondary-waste':
            return createPrimaryWasteWf(state)

    }
}

const evlolver = (evt: WasteWf['evt']) => (state: WasteWf['state']) => {
    switch(evt.type){
        case 'primary-waste-created':
            return {
                id: 'abc', 
                macro: 'primary', 
                ...evt.data
            }
        case 'waste-weighted':
        case 'waste-categorized':
        case 'waste-stored':
        case 'waste-treated':
        case 'secondary-waste-created':
    }
}