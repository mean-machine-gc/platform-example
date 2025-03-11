//third party
export type TransporterType = unknown
export type ProcessorType = 'incinerator' | 'sterilizer' 
export type DisposerType = 'landfill' | 'recycler' 



export type StorageConfig = {}
export type TreatmentConfig = {}
export type TreatmentInfo = {
    treatment: string
}
export type RoomCode = string


export type PrimaryWasteCode = string
export type SecondaryWasteCode = string

export type Weight = {
    weight: number,
    uom: 'kg' | 'g'
}


export type AutoclaveInfo = {
    treatment: 'autoclave'
    timestamp: number
}

export type MicrowaveInfo = {
    treatment: 'microwave'
    timestamp: number
}

export type StorageType = 'hazardous' | 'non_hazardous'

export type HazardousStorage = {
    coldStorageUnitId: string,
    locationId: string,
    storageType: 'hazardous'
}

export type NonHazardousStorage = {
    locationId: string,
    storageType: 'non_hazardous'
}

export type StorageInfo = HazardousStorage | NonHazardousStorage

export type StorageTime = {
    num: number
    time: 'h' | 'd' | 'm' | 'y'
}

export type IncinerationInfo = {
    treatment: 'incineration'
    timestamp: number
}

export type Category = unknown
export type SecondaryCategory = unknown

export type PrimaryCreatedWaste = {
    id: string
    macro: 'primary'
    category?: Category
    code?: PrimaryWasteCode
    weight?: Weight
}

export type PrimaryReadyForStorage = {
    id: string
    macro: 'primary'
    category: Category
    code: PrimaryWasteCode
    weight: Weight
}

export type PrimaryStoredWaste = {
    id: string
    macro: 'primary'
    category: Category
    code: PrimaryWasteCode
    weight: Weight
    storage: StorageInfo
}

export type SecondaryCreatedWaste = {
    id: string
    macro: 'secondary'
    category: SecondaryCategory
    primaryWasteRef: string 
    code?: PrimaryWasteCode
    weight?: Weight
}

export type SecondaryReadyForStorage = {
    id: string
    macro: 'secondary'
    category: SecondaryCategory
    primaryWasteRef: string 
    code: PrimaryWasteCode
    weight: Weight
}

export type SecondaryStored = {
    id: string
    macro: 'secondary'
    category: SecondaryCategory
    primaryWasteRef: string 
    code: PrimaryWasteCode
    weight: Weight
    storage: StorageInfo
}

export type StoredWaste = PrimaryStoredWaste | SecondaryStored

export type ReadyForStorageWaste = PrimaryReadyForStorage | SecondaryReadyForStorage

export type CreatedWaste = PrimaryCreatedWaste | SecondaryCreatedWaste

export type TreatedWaste = {
    id: string
    macro: 'primary'
    category: Category
    code: PrimaryWasteCode
    weight: Weight
    storage: StorageInfo
    treatmentInfo: {treatment: string, timestamp: number}
}

export type Waste = CreatedWaste | ReadyForStorageWaste | StoredWaste | TreatedWaste

