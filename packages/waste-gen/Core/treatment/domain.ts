import { CMD, CoreWf, CoreWfFails, EVT, AGG } from "dc-ts";

export type Weight = {
    uom: 'kg' | 'g',
    weight: number
}

export type Volume = {
    uom: 'liters'
    volume: number
}

export type LoadingCapacity = {
    minWeightCapacity: Weight
    maxWeightCapacity: Weight
    minVolumeCapacity: Volume
    maxVolumeCapacity: Volume
}

export type CurrentLoad = {
    weight: Weight
    weightPercent: number
    volume: Volume
    volumePercent: number
}

export type Equipment = {
    equipmentId: string
    healthFacilityId: string
    status: 'ok' | 'out-of-order'
    loadingCapacity: LoadingCapacity
}

export type ResidueWasteCategories = {
    inputCategories: string[]
    outputCategories: string[]
}

export type TreatmentType = {
    treatmentTypeId: string
    treatmentName: string
    duration: number
    acceptedWasteCategories: string[]
    residueWasteCategories: ResidueWasteCategories[]
    loadingEquipmentType: string[]
    otherEquipmentType: string[]
}

export type HealthFacility = {
    healthFacilityId: string
    allowedTreatments: TreatmentType
}



export type BaseWasteBag = {
    wasteBagId: string
    statusBeforeTreatment: 'stored'
    treatmentId: string
    weight: Weight
    volume: Volume
    wasteCategoryId: string
}

export type LoadedForTreatmentWaste = BaseWasteBag & {
    status: 'loaded-for-treatment' 
}

export type UnderTreatmentWaste = BaseWasteBag & {
    status: 'under-treatment'
}

export type TreatedWaste = BaseWasteBag & {
    status: 'treated'
}

export type WasteBag = LoadedForTreatmentWaste |
    UnderTreatmentWaste |
    TreatedWaste



export type BaseTreatment = {
    treatmentId: string
    treatmentType: TreatmentType
    loadingEquipment: {
        equipmentId: string
        loadingCapacity: LoadingCapacity
        currentLoad: CurrentLoad
    }
    otherEquipment: {
        equipmentId: string
        healthFacilityId: string
        equipmentType: string
        inGoodOrder: boolean
    }[]
    healthFacilityId: string
    createdAt: number
    createdBy: string
}

export type CreatedTreatment = BaseTreatment & {
    status: 'created'
}

export type LoadingTreatment = BaseTreatment & {
    status: 'loading'
    wasteBags: LoadedForTreatmentWaste[]
}

export type ReadyToStartTreatment = BaseTreatment & {
    status: 'ready-to-start'
    wasteBags: LoadedForTreatmentWaste[]
}

export type InProgressTreatment = BaseTreatment & {
    status: 'in-progress'
    wasteBags: UnderTreatmentWaste[]
    startedAt: number
    startedBy: string
}

export type CompletedTreatment = BaseTreatment & {
    status: 'completed'
    wasteBags: TreatedWaste[]
    startedAt: number
    startedBy: string
    completedAt: number
    completedBy: string 
    duration: number
}

export type Treatment = 
    { treatmentType: TreatmentType } |
    CreatedTreatment |
    LoadingTreatment |
    ReadyToStartTreatment |
    InProgressTreatment |
    CompletedTreatment

export type CreateTreatmentWf = CoreWf<
    'create-treatment-wf',
    CMD<'create-treatment', {
        userId: string
        healthFacility: {
            healthFacilityId: string
            allowedTreatments: string[]
        }
        loadingEquipment: {
            equipmentId: string
            healthFacilityId: string
            equipmentType: string
            inGoodOrder: boolean
            loadingCapacity: LoadingCapacity
        }
        otherEquipment: {
            equipmentId: string
            healthFacilityId: string
            equipmentType: string
            inGoodOrder: boolean
        }[]
        treatmentTypeId: string
    }>,
    AGG<'initial', {
        treatement: { treatmentType: TreatmentType }
    }>,
    EVT<'treatment-created', {
        createdBy: string
        createdAt: number
        treatmentId: string
        treatmentType: TreatmentType
        healthFacilityId: string
        loadingEquipment: {
            equipmentId: string
            healthFacilityId: string
            equipmentType: string
            inGoodOrder: boolean
            loadingCapacity: LoadingCapacity
            currentLoad: CurrentLoad
        }
        otherEquipment: {
            equipmentId: string
            healthFacilityId: string
            equipmentType: string
            inGoodOrder: boolean
        }[]
    }>,
    AGG<'created', {
        treatement: CreatedTreatment
    }>,
    CoreWfFails |
    'health_facility_not_allowed' |
    'equipment_not_allowed_for_this_treatment_type' |
    'equipment_out_of_order'
>

export type LoadTreatmentWf = CoreWf<
    'load-treatment-wf',
    CMD<'load-treatment', {
        userId: string
        healthFacilityId: string
        treatmentId: string
        waste: {
            wasteBagId: string
            statusBeforeTreatment: 'stored'
            weight: Weight
            volume: Volume
            wasteCategoryId: string
        }[]
    }>, 
    AGG<'can-load', {
        treatement: CreatedTreatment
    }>,
    EVT<'waste-added-to-treatment', {
        treatmentId: string
        addedBy: string
        addedAt: string
        healthFacilityId: string
        waste: {
            wasteBagId: string
            statusBeforeTreatment: 'stored'
            weight: Weight
            volume: Volume
            wasteCategoryId: string
        }[]
    }> | 
    EVT<'loading-partially-rejected', {
        treatmentId: string
        loadedBy: string
        rejectedAt: string
        healthFacilityId: string
        waste: {
            wasteBagId: string
            statusBeforeTreatment: 'stored'
            weight: Weight
            volume: Volume
            wasteCategoryId: string
        }[]
    }>,
    AGG<'loading', {
        treatement: LoadingTreatment
    }>,
    CoreWfFails |
    'no_waste_categories_allowed' |
    'no_waste_bags_provided' |
    'loading_equipment_is_at_full_capacity' |
    'waste_category_not_allowed'
>

export type StartTreatmentWf = CoreWf<
    'start-treatment-wf',
    CMD<'start-treatment', {
        userId: string
        healthFacilityId: string
        treatmentId: string
    }>, 
    AGG<'can-start', {
        treatement: ReadyToStartTreatment
    }>,
    EVT<'treatment-started', {
        treatmentId: string
        startedBy: string
        startedAt: number
        healthFacilityId: string
    }>,
    AGG<'started', {
        treatement: InProgressTreatment
    }>,
    CoreWfFails
>

export type CompleteTreatmentWf = CoreWf<
    'complete-treatment-wf',
    CMD<'complete-treatment', {
        userId: string
        healthFacilityId: string
        treatmentId: string
    }>, 
    AGG<'can-complete', {
        treatement: InProgressTreatment
    }>,
    EVT<'treatment-completed', {
        treatmentId: string
        completedBy: string
        completedAt: number
        healthFacilityId: string
        duration: number
    }>,
    AGG<'completed', {
        treatement: CompletedTreatment
    }>,
    CoreWfFails
>

export type TreatmentWf = CreateTreatmentWf |
    LoadTreatmentWf |
    StartTreatmentWf |
    CompleteTreatmentWf

export type TreatmentCmd = TreatmentWf['cmd']
export type TreatmentEvt = TreatmentWf['evt']
export type TreatmentAggregate = TreatmentWf['aggregate']
export type TreatmentFails = TreatmentWf['fails']



