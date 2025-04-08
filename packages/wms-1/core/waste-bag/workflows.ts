import {CoreWf, EVT, CMD, CoreWfFails, Constrain, Result} from 'dc-ts'


//waste bag
//create, weight, categorize, store

//POST create, POST weight, POST categorize, POST store

export type Weight = {
    uom: 'kg' | 'g',
    weight: number
}

export type StorageType = 'temporary' | 'coldstorage'

export type StorageLocation = {
    locationId: string
    storageType: StorageType
}

export type Category = {
    name: string,
    tratment: 'pyrolisis' | 'autoclave'
    storageType: StorageType
    maxTemporaryStorage: number
    minTemporaryStorage: number
}
export type CreatedWaste = {
    status: 'created'
    wasteId: string
    weight?: Weight
    category?: Category
}

export type ReadyToStore = {
    status: 'ready-to-store'
    wasteId: string
    weight: Weight
    category: Category
}

export type StoredWaste = {
    status: 'stored'
    wasteId: string
    weight: Weight
    category: Category
    storageLocation: StorageLocation
}

export type TreatedWaste = {
    status: 'treated'
    wasteId: string
    weight: Weight
    category: Category
    storageLocation: StorageLocation
    treatmentId: string
}

export type Waste = CreatedWaste | 
    ReadyToStore | 
    StoredWaste |
    TreatedWaste

export type WasteAggregate = 
{ waste: Waste | null}

export type CreateWasteWf = CoreWf<
    CMD<'create-waste', {
        userId: string
        helathFacilityId: string
        weight?: Weight
        category?: Category
    }>,
    WasteAggregate,
    EVT<'waste-created', {
        createdBy: string
        healthFacilityId: string
        createdAt: number
        wasteId: string
        weight?: Weight
        category?: Category
    }>,
    CoreWfFails
>

export type WeightWasteWf = CoreWf<
    CMD<'weight-waste', {
        userId: string
        wasteId: string
        helathFacilityId: string
        weight: Weight
    }>,
    WasteAggregate,
    EVT<'waste-weighted', {
        weightedBy: string
        healthFacilityId: string
        weightedAt: number
        wasteId: string
        weight: Weight
    }>,
    never
>

export type CategorizeWasteWf = CoreWf<
    CMD<'categorize-waste', {
        userId: string
        wasteId: string
        helathFacilityId: string
        category: Category
    }>,
    WasteAggregate,
    EVT<'waste-categorized', {
        categorizedBy: string
        healthFacilityId: string
        categorizedAt: number
        wasteId: string
        category: Category
    }>,
    never
>

export type SetAsReadyToStoreWf = CoreWf<
    CMD<'set-ready-to-store', {
        wasteId: string
    }>,
    WasteAggregate,
    EVT<'waste-ready-for-storage', {
        wasteId: string
    }>,
    never
>

export type StoreWasteWf = CoreWf<
    CMD<'store-waste', {
        userId: string
        wasteId: string
        helathFacilityId: string
        storageLocation: StorageLocation
    }>,
    WasteAggregate,
    EVT<'waste-stored', {
        storedBy: string
        healthFacilityId: string
        storedAt: number
        wasteId: string
        storageLocation: StorageLocation
    }>,
    CoreWfFails |
    'waste_is_not_weighted' |
    'waste_is_not_categorized' 
>

export type TreatWasteWf = CoreWf<
    CMD<'treat-waste', {
        wasteId: string
        treatmentId: string
    }>,
    WasteAggregate,
    EVT<'waste-treated', {
        wasteId: string
        treatmentId: string
    }>,
    CoreWfFails |
    'waste_cannont_be_treated_internally' |
    'health_facility_is_not_equipped' 
>

export type WasteWf = CreateWasteWf | 
    WeightWasteWf | 
    CategorizeWasteWf | 
    StoreWasteWf |
    SetAsReadyToStoreWf |
    TreatWasteWf

export type WasteWfCmd = WasteWf['cmd']
export type WasteWfEvt = WasteWf['evt']

type Reactor<E, S, C, F extends string> = {
    evt: E
    state: S 
    fails: F
    constrain: Constrain<E, S, F>
    policy: Policy<E, S, C, F>
}

export type Policy<E, S, C, F extends string> = (e: E) => (s: S) => Result<C[], F>

type CorePolicyFails = CoreWfFails

export type ObservedEvts = WasteWf['evt']

export type MarkAsReadyToStoreReactor = Reactor<
    CreateWasteWf['evt'] |
    WeightWasteWf['evt'] |
    CategorizeWasteWf['evt'],
    WasteWf['aggregate'],
    SetAsReadyToStoreWf['cmd'],
    CorePolicyFails | 
    'not_ready_to_store'
>

export type WasteReactor = MarkAsReadyToStoreReactor
