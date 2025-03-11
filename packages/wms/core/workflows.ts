import { CMD, CorePy, CoreWf, EVT } from 'dc-ts'
import { Category, CreatedWaste, PrimaryCreatedWaste, PrimaryStoredWaste, PrimaryWasteCode, ReadyForStorageWaste, SecondaryCategory, SecondaryCreatedWaste, SecondaryWasteCode, StorageConfig, StorageInfo, StoredWaste, TreatedWaste, TreatmentConfig, TreatmentInfo, Weight } from './waste'


export type CreatePrimaryWasteWf = CoreWf<
    CMD<'create-primary-waste', {
        code?: PrimaryWasteCode
        weight?: Weight
        category?: Category
    }>, 
    {}, 
    EVT<'primary-waste-created', {
        waste: PrimaryCreatedWaste
    }>
>

export type WeightWasteWf = CoreWf<
    CMD<'weight-waste', {
        wasteId: string
        weight: Weight
    }>, 
    {
        waste: CreatedWaste
    }, 
    EVT<'waste-weighted', {
        waste: CreatedWaste
    }>
>

export type CategorizeWasteWf = CoreWf<
    CMD<'categorize-waste', {
        wasteId: string
        category: Category
    }>, 
    {
        waste: CreatedWaste
    }, 
    EVT<'waste-categorized', {
        waste: CreatedWaste
    }>
>

export type StoreWasteWf = CoreWf<
    CMD<'store-waste', {
        wasteId: string
        storageInfo: StorageInfo
    }>, 
    { 
        waste: ReadyForStorageWaste, 
        storageConfig: StorageConfig 
    },
    EVT<'waste-stored', {
        waste: StoredWaste
    }>
>

export type TreatWasteWf = CoreWf<
    CMD<'treat-waste', {
        wasteId: string
        treatmentInfo: TreatmentInfo
    }>, 
    { 
        waste: PrimaryStoredWaste, 
        treatmentConfig: TreatmentConfig,
        hfTreatmentCapacity: string[] 
    },
    EVT<'waste-treated', {
        waste: TreatedWaste
    }>
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

export type WastePy = CreateSecondaryWastePy
export type WastePyEvt = WastePy['evt']
export type WastePyState = WastePy['state']
export type WastePyCmd = WastePy['cmd']