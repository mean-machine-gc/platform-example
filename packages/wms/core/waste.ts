export type PrimaryWasteCode = string
export type SecondaryWasteCode = string

export type Weight = {
    weight: number,
    uom: 'kg' | 'g'
}

export type IncinerationInfo = {
    timestamp: number
}

export type AutoclaveInfo = {
    timestamp: number
}

export type MicrowaveInfo = {
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

export type Storage = HazardousStorage | NonHazardousStorage


//primary waste types
export type NonInfectious = 
    'primary:medical:non_infectious:non_expired_pharmaceuticals' | 
    'primary:medical:non_infectious:expired_pharmaceuticals' | 
    'primary:medical:non_infectious:expired_chemical' |
    'primary:medical:non_infectious:chemical' |
    'primary:medical:non_infectious:cytotoxic' |
    'primary:medical:non_infectious:radioactive' |
    'primary:medical:non_infectious:pressurized_container' |
    'primary:medical:non_infectious:heavy_metal'

export type Infectious = 
    'primary:medical:infectious:infectious' |
    'primary:medical:infectious:plastic' |
    'primary:medical:infectious:non_plastic' |
    'primary:medical:infectious:sharp' |
    'primary:medical:infectious:pathology'

export type Unsegregated = 'primary:medical:unsegregated:unsegregated'

export type PrimaryHazardous = 
    'primary:hazardous:electronics' |
    'primary:hazardous:light_electronics' |
    'primary:hazardous:battery' |
    'primary:hazardous:oil'

export type PrimaryNonHazardous = 
    'primary:non_hazardous:plastic' |
    'primary:non_hazardous:non_plastic' |
    'primary:non_hazardous:unsegregated' 

export type ImmunizationInfectious = 
    'primary:immunization:infectious:infectious' |
    'primary:immunization:infectious:sharp' |
    'primary:immunization:infectious:pathology' |
    'primary:immunization:infectious:covid_isolation_infectious'

export type ImmunizationNonInfectious = 
    'primary:immunization:non_infectious:chemical' |
    'primary:immunization:non_infectious:pharmaceuticals' |
    'primary:immunization:non_infectious:vaccination'

export type PrimaryImmunization = ImmunizationInfectious | ImmunizationNonInfectious

export type PrimaryMedical = Infectious | NonInfectious | Unsegregated

export type PrimaryDomestic = 'primary:domestic:organic' | 'primary:domestic:inorganic'


//secondary waste types
export type SecondaryHazardous = 
    'secondary:hazardous:incineration_residue'

export type AutoclaveResidue = 
    'secondary:non_hazardous:autoclave_residue:plastic' |
    'secondary:non_hazardous:autoclave_residue:non_plastic' |
    'secondary:non_hazardous:autoclave_residue:unsegregated'

export type MicrowaveResidue = 
    'secondary:non_hazardous:microwave_residue:plastic' |
    'secondary:non_hazardous:microwave_residue:non_plastic' |
    'secondary:non_hazardous:microwave_residue:unsegregated'

export type SecondaryNonHazardous = AutoclaveResidue | MicrowaveResidue
     



//waste classification
export type PrimaryWasteType = 
    PrimaryMedical | 
    PrimaryHazardous | 
    PrimaryNonHazardous | 
    PrimaryImmunization | 
    PrimaryDomestic

export type SecondaryWasteType = SecondaryHazardous | SecondaryNonHazardous


//created
export type PrimaryWasteCreated = {
    id: string
    code: PrimaryWasteCode
    type?: PrimaryWasteType
    status: 'created'
    weight?: Weight
}

export type SecondaryWasteCreated = {
    id: string
    code: SecondaryWasteCode
    type?: SecondaryWasteType
    status: 'created'
    weight?: Weight
    primaryWasteRef: string
}

//stored
export type PrimaryStoredHazardous = {
    id: string
    code: PrimaryWasteCode
    type: PrimaryWasteType
    status: 'stored'
    weight: Weight
    storage: HazardousStorage
}

export type PrimaryStoredNonHazardous = {
    id: string
    code: PrimaryWasteCode
    type: PrimaryWasteType
    status: 'stored'
    weight: Weight
    storage: NonHazardousStorage
}

export type SecondaryHazardousStoredWaste = {
    id: string
    code: SecondaryWasteCode
    type?: SecondaryWasteType
    status: 'stored'
    weight?: Weight
    primaryWasteRef: string
    storage: HazardousStorage
}

export type SecondaryNonHazardousStoredWaste = {
    id: string
    code: SecondaryWasteCode
    type?: SecondaryWasteType
    status: 'stored'
    weight?: Weight
    primaryWasteRef: string
    storage: NonHazardousStorage
}

export type SecondaryStoredWaste = SecondaryHazardousStoredWaste | SecondaryNonHazardousStoredWaste



//incinerated
export type Incinerated = {
    id: string
    code: PrimaryWasteCode
    type: PrimaryWasteType
    status: 'incinerated'
    weight: Weight
    storage: HazardousStorage
    incinerationInfo: IncinerationInfo
}

export type Autoclaved = {
    id: string
    code: PrimaryWasteCode
    type: PrimaryWasteType
    status: 'autoclaved'
    weight: Weight
    storage: NonHazardousStorage
    autoclaveInfo: AutoclaveInfo
}

export type Microwaved = {
    id: string
    code: PrimaryWasteCode
    type: PrimaryWasteType
    status: 'microwaved'
    weight: Weight
    storage: NonHazardousStorage
    microwaveInfo: MicrowaveInfo
}

export type CreatedWaste = PrimaryWasteCreated | SecondaryWasteCreated

export type PrimaryStoredWaste = PrimaryStoredHazardous | PrimaryStoredNonHazardous

export type StoredWaste = PrimaryStoredWaste | SecondaryStoredWaste

export type Waste = CreatedWaste | StoredWaste | Incinerated | Autoclaved | Microwaved



// export type CreatedPrimaryWaste = {
//     code: PrimaryWasteCode
//     type: PrimaryWasteType
//     weight?: Weight
// }

// export type StoredPrimaryWaste = {

// }

// export type PrimaryWaste = 
//     CreatedPrimaryWaste | 
//     StoredPrimaryWaste | 

// export type SecondaryWaste = {
//     code: SecondaryWasteCode
//     type: SecondaryWasteType
//     primaryWasteId: string 
// }

// export type Waste = PrimaryWaste | SecondaryWaste