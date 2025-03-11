import { Type, Static, TSchema } from '@sinclair/typebox'

type MsgType = Static<typeof MsgType>
const MsgType = Type.Union([Type.Literal('cmd'), Type.Literal('evt')])

type Msg<M extends TSchema, T extends TSchema, D extends TSchema> = Static<
  ReturnType<typeof Msg<M, T, D>>
>
const Msg = <M extends TSchema, T extends TSchema, D extends TSchema>(
  M: M,
  T: T,
  D: D
) =>
  Type.Object({
    id: Type.String(),
    msgType: M,
    type: T,
    timestamp: Type.Number(),
    correlationid: Type.String(),
    causationid: Type.Union([Type.String(), Type.Undefined()]),
    data: D
  })

export type CMD<T extends TSchema, D extends TSchema> = Static<
  ReturnType<typeof CMD<T, D>>
>
export const CMD = <T extends TSchema, D extends TSchema>(T: T, D: D) =>
  Msg(Type.Literal('cmd'), T, D)

export type EVT<T extends TSchema, D extends TSchema> = Static<
  ReturnType<typeof EVT<T, D>>
>
export const EVT = <T extends TSchema, D extends TSchema>(T: T, D: D) =>
  Msg(Type.Literal('evt'), T, D)

export type DomainTrace = Static<typeof DomainTrace>
export const DomainTrace = Type.Object({
  correlationid: Type.Union([Type.String(), Type.Undefined()]),
  causationid: Type.Union([Type.String(), Type.Undefined()])
})

export type PrimaryWasteCode = Static<typeof PrimaryWasteCode>
export const PrimaryWasteCode = Type.String()

export type SecondaryWasteCode = Static<typeof SecondaryWasteCode>
export const SecondaryWasteCode = Type.String()

export type Weight = Static<typeof Weight>
export const Weight = Type.Object({
  weight: Type.Number(),
  uom: Type.Union([Type.Literal('kg'), Type.Literal('g')])
})

export type IncinerationInfo = Static<typeof IncinerationInfo>
export const IncinerationInfo = Type.Object({
  timestamp: Type.Number()
})

export type AutoclaveInfo = Static<typeof AutoclaveInfo>
export const AutoclaveInfo = Type.Object({
  timestamp: Type.Number()
})

export type MicrowaveInfo = Static<typeof MicrowaveInfo>
export const MicrowaveInfo = Type.Object({
  timestamp: Type.Number()
})

export type StorageType = Static<typeof StorageType>
export const StorageType = Type.Union([
  Type.Literal('hazardous'),
  Type.Literal('non_hazardous')
])

export type HazardousStorage = Static<typeof HazardousStorage>
export const HazardousStorage = Type.Object({
  coldStorageUnitId: Type.String(),
  locationId: Type.String(),
  storageType: Type.Literal('hazardous')
})

export type NonHazardousStorage = Static<typeof NonHazardousStorage>
export const NonHazardousStorage = Type.Object({
  locationId: Type.String(),
  storageType: Type.Literal('non_hazardous')
})

export type Storage = Static<typeof Storage>
export const Storage = Type.Union([HazardousStorage, NonHazardousStorage])

export type NonInfectious = Static<typeof NonInfectious>
export const NonInfectious = Type.Union([
  Type.Literal('primary:medical:non_infectious:non_expired_pharmaceuticals'),
  Type.Literal('primary:medical:non_infectious:expired_pharmaceuticals'),
  Type.Literal('primary:medical:non_infectious:expired_chemical'),
  Type.Literal('primary:medical:non_infectious:chemical'),
  Type.Literal('primary:medical:non_infectious:cytotoxic'),
  Type.Literal('primary:medical:non_infectious:radioactive'),
  Type.Literal('primary:medical:non_infectious:pressurized_container'),
  Type.Literal('primary:medical:non_infectious:heavy_metal')
])

export type Infectious = Static<typeof Infectious>
export const Infectious = Type.Union([
  Type.Literal('primary:medical:infectious:infectious'),
  Type.Literal('primary:medical:infectious:plastic'),
  Type.Literal('primary:medical:infectious:non_plastic'),
  Type.Literal('primary:medical:infectious:sharp'),
  Type.Literal('primary:medical:infectious:pathology')
])

export type Unsegregated = Static<typeof Unsegregated>
export const Unsegregated = Type.Literal(
  'primary:medical:unsegregated:unsegregated'
)

export type PrimaryHazardous = Static<typeof PrimaryHazardous>
export const PrimaryHazardous = Type.Union([
  Type.Literal('primary:hazardous:electronics'),
  Type.Literal('primary:hazardous:light_electronics'),
  Type.Literal('primary:hazardous:battery'),
  Type.Literal('primary:hazardous:oil')
])

export type PrimaryNonHazardous = Static<typeof PrimaryNonHazardous>
export const PrimaryNonHazardous = Type.Union([
  Type.Literal('primary:non_hazardous:plastic'),
  Type.Literal('primary:non_hazardous:non_plastic'),
  Type.Literal('primary:non_hazardous:unsegregated')
])

export type ImmunizationInfectious = Static<typeof ImmunizationInfectious>
export const ImmunizationInfectious = Type.Union([
  Type.Literal('primary:immunization:infectious:infectious'),
  Type.Literal('primary:immunization:infectious:sharp'),
  Type.Literal('primary:immunization:infectious:pathology'),
  Type.Literal('primary:immunization:infectious:covid_isolation_infectious')
])

export type ImmunizationNonInfectious = Static<typeof ImmunizationNonInfectious>
export const ImmunizationNonInfectious = Type.Union([
  Type.Literal('primary:immunization:non_infectious:chemical'),
  Type.Literal('primary:immunization:non_infectious:pharmaceuticals'),
  Type.Literal('primary:immunization:non_infectious:vaccination')
])

export type PrimaryImmunization = Static<typeof PrimaryImmunization>
export const PrimaryImmunization = Type.Union([
  ImmunizationInfectious,
  ImmunizationNonInfectious
])

export type PrimaryMedical = Static<typeof PrimaryMedical>
export const PrimaryMedical = Type.Union([
  Infectious,
  NonInfectious,
  Unsegregated
])

export type PrimaryDomestic = Static<typeof PrimaryDomestic>
export const PrimaryDomestic = Type.Union([
  Type.Literal('primary:domestic:organic'),
  Type.Literal('primary:domestic:inorganic')
])

export type SecondaryHazardous = Static<typeof SecondaryHazardous>
export const SecondaryHazardous = Type.Literal(
  'secondary:hazardous:incineration_residue'
)

export type AutoclaveResidue = Static<typeof AutoclaveResidue>
export const AutoclaveResidue = Type.Union([
  Type.Literal('secondary:non_hazardous:autoclave_residue:plastic'),
  Type.Literal('secondary:non_hazardous:autoclave_residue:non_plastic'),
  Type.Literal('secondary:non_hazardous:autoclave_residue:unsegregated')
])

export type MicrowaveResidue = Static<typeof MicrowaveResidue>
export const MicrowaveResidue = Type.Union([
  Type.Literal('secondary:non_hazardous:microwave_residue:plastic'),
  Type.Literal('secondary:non_hazardous:microwave_residue:non_plastic'),
  Type.Literal('secondary:non_hazardous:microwave_residue:unsegregated')
])

export type SecondaryNonHazardous = Static<typeof SecondaryNonHazardous>
export const SecondaryNonHazardous = Type.Union([
  AutoclaveResidue,
  MicrowaveResidue
])

export type PrimaryWasteType = Static<typeof PrimaryWasteType>
export const PrimaryWasteType = Type.Union([
  PrimaryMedical,
  PrimaryHazardous,
  PrimaryNonHazardous,
  PrimaryImmunization,
  PrimaryDomestic
])

export type SecondaryWasteType = Static<typeof SecondaryWasteType>
export const SecondaryWasteType = Type.Union([
  SecondaryHazardous,
  SecondaryNonHazardous
])

export type PrimaryWasteCreated = Static<typeof PrimaryWasteCreated>
export const PrimaryWasteCreated = Type.Object({
  id: Type.String(),
  code: PrimaryWasteCode,
  type: Type.Optional(PrimaryWasteType),
  status: Type.Literal('created'),
  weight: Type.Optional(Weight)
})

export type SecondaryWasteCreated = Static<typeof SecondaryWasteCreated>
export const SecondaryWasteCreated = Type.Object({
  id: Type.String(),
  code: SecondaryWasteCode,
  type: Type.Optional(SecondaryWasteType),
  status: Type.Literal('created'),
  weight: Type.Optional(Weight),
  primaryWasteRef: Type.String()
})

export type PrimaryStoredHazardous = Static<typeof PrimaryStoredHazardous>
export const PrimaryStoredHazardous = Type.Object({
  id: Type.String(),
  code: PrimaryWasteCode,
  type: PrimaryWasteType,
  status: Type.Literal('stored'),
  weight: Weight,
  storage: HazardousStorage
})

export type PrimaryStoredNonHazardous = Static<typeof PrimaryStoredNonHazardous>
export const PrimaryStoredNonHazardous = Type.Object({
  id: Type.String(),
  code: PrimaryWasteCode,
  type: PrimaryWasteType,
  status: Type.Literal('stored'),
  weight: Weight,
  storage: NonHazardousStorage
})

export type SecondaryHazardousStoredWaste = Static<
  typeof SecondaryHazardousStoredWaste
>
export const SecondaryHazardousStoredWaste = Type.Object({
  id: Type.String(),
  code: SecondaryWasteCode,
  type: Type.Optional(SecondaryWasteType),
  status: Type.Literal('created'),
  weight: Type.Optional(Weight),
  primaryWasteRef: Type.String(),
  storage: HazardousStorage
})

export type SecondaryNonHazardousStoredWaste = Static<
  typeof SecondaryNonHazardousStoredWaste
>
export const SecondaryNonHazardousStoredWaste = Type.Object({
  id: Type.String(),
  code: SecondaryWasteCode,
  type: Type.Optional(SecondaryWasteType),
  status: Type.Literal('created'),
  weight: Type.Optional(Weight),
  primaryWasteRef: Type.String(),
  storage: NonHazardousStorage
})

export type SecondaryStoredWaste = Static<typeof SecondaryStoredWaste>
export const SecondaryStoredWaste = Type.Union([
  SecondaryHazardousStoredWaste,
  SecondaryNonHazardousStoredWaste
])

export type Incinerated = Static<typeof Incinerated>
export const Incinerated = Type.Object({
  id: Type.String(),
  code: PrimaryWasteCode,
  type: PrimaryWasteType,
  status: Type.Literal('incinerated'),
  weight: Weight,
  storage: HazardousStorage,
  incinerationInfo: IncinerationInfo
})

export type Autoclaved = Static<typeof Autoclaved>
export const Autoclaved = Type.Object({
  id: Type.String(),
  code: PrimaryWasteCode,
  type: PrimaryWasteType,
  status: Type.Literal('autoclaved'),
  weight: Weight,
  storage: NonHazardousStorage,
  autoclaveInfo: AutoclaveInfo
})

export type Microwaved = Static<typeof Microwaved>
export const Microwaved = Type.Object({
  id: Type.String(),
  code: PrimaryWasteCode,
  type: PrimaryWasteType,
  status: Type.Literal('microwaved'),
  weight: Weight,
  storage: NonHazardousStorage,
  microwavedInfo: MicrowaveInfo
})

export type CreatedWaste = Static<typeof CreatedWaste>
export const CreatedWaste = Type.Union([
  PrimaryWasteCreated,
  SecondaryWasteCreated
])

export type PrimaryStoredWaste = Static<typeof PrimaryStoredWaste>
export const PrimaryStoredWaste = Type.Union([
  PrimaryStoredHazardous,
  PrimaryStoredNonHazardous
])

export type StoredWaste = Static<typeof StoredWaste>
export const StoredWaste = Type.Union([
  PrimaryStoredWaste,
  SecondaryStoredWaste
])

export type Waste = Static<typeof Waste>
export const Waste = Type.Union([
  CreatedWaste,
  StoredWaste,
  Incinerated,
  Autoclaved,
  Microwaved
])

export type CreatePrimaryWasteParams = Static<typeof CreatePrimaryWasteParams>
export const CreatePrimaryWasteParams = Type.Object({
  code: Type.Optional(PrimaryWasteCode),
  weight: Type.Optional(Weight),
  type: Type.Optional(PrimaryWasteType)
})

export type CreatePrimaryWasteData = Static<typeof CreatePrimaryWasteData>
export const CreatePrimaryWasteData = CreatePrimaryWasteParams

export type CreatePrimaryWasteState = Static<typeof CreatePrimaryWasteState>
export const CreatePrimaryWasteState = Type.Object({
  params: CreatePrimaryWasteParams
})

export type IncinerateWasteData = Static<typeof IncinerateWasteData>
export const IncinerateWasteData = Type.Object({
  wasteId: Type.String(),
  incinerationInfo: IncinerationInfo
})

export type CreatePrimaryWasteCmd = Static<typeof CreatePrimaryWasteCmd>
export const CreatePrimaryWasteCmd = CMD(
  Type.Literal('create-primary-waste'),
  CreatePrimaryWasteData
)

export type IncinerateWasteCmd = Static<typeof IncinerateWasteCmd>
export const IncinerateWasteCmd = CMD(
  Type.Literal('incinerate-waste'),
  IncinerateWasteData
)

export type WasteCmd = Static<typeof WasteCmd>
export const WasteCmd = Type.Union([CreatePrimaryWasteCmd, IncinerateWasteCmd])

export type WasteIncineratedData = Static<typeof WasteIncineratedData>
export const WasteIncineratedData = Type.Object({
  waste: Incinerated
})

export type PrimaryWasteCreatedData = Static<typeof PrimaryWasteCreatedData>
export const PrimaryWasteCreatedData = Type.Object({
  wasteId: Type.String()
})

export type WasteIncineratedEvt = Static<typeof WasteIncineratedEvt>
export const WasteIncineratedEvt = EVT(
  Type.Literal('waste-incinerated'),
  WasteIncineratedData
)

export type PrimaryWasteCreatedEvt = Static<typeof PrimaryWasteCreatedEvt>
export const PrimaryWasteCreatedEvt = EVT(
  Type.Literal('primary-waste-created'),
  PrimaryWasteCreatedData
)

export type WasteEvt = Static<typeof WasteEvt>
export const WasteEvt = Type.Union([
  WasteIncineratedEvt,
  PrimaryWasteCreatedEvt
])

export type IncinerateWasteState = Static<typeof IncinerateWasteState>
export const IncinerateWasteState = Type.Object({
  isHealthFacilityEnabled: Type.Boolean(),
  waste: PrimaryStoredHazardous
})
