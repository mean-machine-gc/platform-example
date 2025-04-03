import {CoreWf, EVT, CMD, CoreWfFails} from 'dc-ts'

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
    storageExpiration: number
}

export type ReadyForStorageEvt = EVT<'waste-ready-for-storage', {
    healthFacilityId: string
    wasteId: string
    weight: Weight
    category: Category
}>

export type Waste = CreatedWaste | ReadyToStore | StoredWaste

export type AggregateState = {} |
{ waste: CreatedWaste }

export type CreateWasteWf = CoreWf<
    CMD<'create-waste', {
        userId: string
        helathFacilityId: string
        weight?: Weight
        category?: Category
    }>,
    {},
    EVT<'waste-created', {
        createdBy: string
        healthFacilityId: string
        createdAt: number
        wasteId: string
        weight?: Weight
        category?: Category
    }> | 
    ReadyForStorageEvt,
    { waste: CreatedWaste  | ReadyToStore}
>

export type WeightWasteWf = CoreWf<
    CMD<'weight-waste', {
        userId: string
        wasteId: string
        helathFacilityId: string
        weight: Weight
    }>,
    AggregateState & {waste: CreatedWaste},
    EVT<'waste-weighted', {
        weightedBy: string
        healthFacilityId: string
        weightedAt: number
        wasteId: string
        weight: Weight
    }> | 
    EVT<'waste-ready-for-storage', {
        healthFacilityId: string
        wasteId: string
    }>,
    AggregateState & { waste: CreatedWaste | ReadyToStore }
>

export type CategorizeWasteWf = CoreWf<
    CMD<'categorize-waste', {
        userId: string
        wasteId: string
        helathFacilityId: string
        category: Category
    }>,
    AggregateState & { waste: CreatedWaste },
    EVT<'waste-categorized', {
        categorizedBy: string
        healthFacilityId: string
        categorizedAt: number
        wasteId: string
        category: Category
    }> | 
    EVT<'waste-ready-for-storage', {
        healthFacilityId: string
        wasteId: string
    }>,
    AggregateState & { waste: CreatedWaste | ReadyToStore }
>

export type StoreWasteWf = CoreWf<
    CMD<'store-waste', {
        userId: string
        wasteId: string
        helathFacilityId: string
        storageLocation: StorageLocation
    }>,
    AggregateState & { waste: ReadyToStore },
    EVT<'waste-stored', {
        storedBy: string
        healthFacilityId: string
        storedAt: number
        wasteId: string
        storageLocation: StorageLocation
    }>,
    AggregateState & { waste: StoredWaste },
    CoreWfFails |
    'waste_is_not_weighted' |
    'waste_is_not_categorized' 
>

export type WasteWf = CreateWasteWf | WeightWasteWf | CategorizeWasteWf | StoreWasteWf
