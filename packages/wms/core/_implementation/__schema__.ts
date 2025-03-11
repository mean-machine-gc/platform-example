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

export type TransporterType = Static<typeof TransporterType>
export const TransporterType = Type.Unknown()

export type ProcessorType = Static<typeof ProcessorType>
export const ProcessorType = Type.Union([
  Type.Literal('incinerator'),
  Type.Literal('sterilizer')
])

export type DisposerType = Static<typeof DisposerType>
export const DisposerType = Type.Union([
  Type.Literal('landfill'),
  Type.Literal('recycler')
])

export type StorageConfig = Static<typeof StorageConfig>
export const StorageConfig = Type.Object({})

export type TreatmentConfig = Static<typeof TreatmentConfig>
export const TreatmentConfig = Type.Object({})

export type TreatmentInfo = Static<typeof TreatmentInfo>
export const TreatmentInfo = Type.Object({
  treatment: Type.String()
})

export type RoomCode = Static<typeof RoomCode>
export const RoomCode = Type.String()

export type PrimaryWasteCode = Static<typeof PrimaryWasteCode>
export const PrimaryWasteCode = Type.String()

export type SecondaryWasteCode = Static<typeof SecondaryWasteCode>
export const SecondaryWasteCode = Type.String()

export type Weight = Static<typeof Weight>
export const Weight = Type.Object({
  weight: Type.Number(),
  uom: Type.Union([Type.Literal('kg'), Type.Literal('g')])
})

export type AutoclaveInfo = Static<typeof AutoclaveInfo>
export const AutoclaveInfo = Type.Object({
  treatment: Type.Literal('autoclave'),
  timestamp: Type.Number()
})

export type MicrowaveInfo = Static<typeof MicrowaveInfo>
export const MicrowaveInfo = Type.Object({
  treatment: Type.Literal('microwave'),
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

export type StorageInfo = Static<typeof StorageInfo>
export const StorageInfo = Type.Union([HazardousStorage, NonHazardousStorage])

export type StorageTime = Static<typeof StorageTime>
export const StorageTime = Type.Object({
  num: Type.Number(),
  time: Type.Union([
    Type.Literal('h'),
    Type.Literal('d'),
    Type.Literal('m'),
    Type.Literal('y')
  ])
})

export type IncinerationInfo = Static<typeof IncinerationInfo>
export const IncinerationInfo = Type.Object({
  treatment: Type.Literal('incineration'),
  timestamp: Type.Number()
})

export type Category = Static<typeof Category>
export const Category = Type.Unknown()

export type SecondaryCategory = Static<typeof SecondaryCategory>
export const SecondaryCategory = Type.Unknown()

export type PrimaryCreatedWaste = Static<typeof PrimaryCreatedWaste>
export const PrimaryCreatedWaste = Type.Object({
  id: Type.String(),
  macro: Type.Literal('primary'),
  category: Type.Optional(Category),
  code: Type.Optional(PrimaryWasteCode),
  weight: Type.Optional(Weight)
})

export type PrimaryReadyForStorage = Static<typeof PrimaryReadyForStorage>
export const PrimaryReadyForStorage = Type.Object({
  id: Type.String(),
  macro: Type.Literal('primary'),
  category: Category,
  code: PrimaryWasteCode,
  weight: Weight
})

export type PrimaryStoredWaste = Static<typeof PrimaryStoredWaste>
export const PrimaryStoredWaste = Type.Object({
  id: Type.String(),
  macro: Type.Literal('primary'),
  category: Category,
  code: PrimaryWasteCode,
  weight: Weight,
  storage: StorageInfo
})

export type SecondaryCreatedWaste = Static<typeof SecondaryCreatedWaste>
export const SecondaryCreatedWaste = Type.Object({
  id: Type.String(),
  macro: Type.Literal('secondary'),
  category: SecondaryCategory,
  primaryWasteRef: Type.String(),
  code: Type.Optional(PrimaryWasteCode),
  weight: Type.Optional(Weight)
})

export type SecondaryReadyForStorage = Static<typeof SecondaryReadyForStorage>
export const SecondaryReadyForStorage = Type.Object({
  id: Type.String(),
  macro: Type.Literal('secondary'),
  category: SecondaryCategory,
  primaryWasteRef: Type.String(),
  code: PrimaryWasteCode,
  weight: Weight
})

export type SecondaryStored = Static<typeof SecondaryStored>
export const SecondaryStored = Type.Object({
  id: Type.String(),
  macro: Type.Literal('secondary'),
  category: SecondaryCategory,
  primaryWasteRef: Type.String(),
  code: PrimaryWasteCode,
  weight: Weight,
  storage: StorageInfo
})

export type StoredWaste = Static<typeof StoredWaste>
export const StoredWaste = Type.Union([PrimaryStoredWaste, SecondaryStored])

export type ReadyForStorageWaste = Static<typeof ReadyForStorageWaste>
export const ReadyForStorageWaste = Type.Union([
  PrimaryReadyForStorage,
  SecondaryReadyForStorage
])

export type CreatedWaste = Static<typeof CreatedWaste>
export const CreatedWaste = Type.Union([
  PrimaryCreatedWaste,
  SecondaryCreatedWaste
])

export type TreatedWaste = Static<typeof TreatedWaste>
export const TreatedWaste = Type.Object({
  id: Type.String(),
  macro: Type.Literal('primary'),
  category: Category,
  code: PrimaryWasteCode,
  weight: Weight,
  storage: StorageInfo,
  treatmentInfo: Type.Object({
    treatment: Type.String(),
    timestamp: Type.Number()
  })
})

export type Waste = Static<typeof Waste>
export const Waste = Type.Union([
  CreatedWaste,
  ReadyForStorageWaste,
  StoredWaste,
  TreatedWaste
])

export type CoreWf<
  C extends TSchema,
  S extends TSchema,
  E extends TSchema
> = Static<ReturnType<typeof CoreWf<C, S, E>>>
export const CoreWf = <C extends TSchema, S extends TSchema, E extends TSchema>(
  C: C,
  S: S,
  E: E
) =>
  Type.Object({
    cmd: C,
    state: S,
    evt: E
  })

export type CorePy<
  E extends TSchema,
  S extends TSchema,
  C extends TSchema
> = Static<ReturnType<typeof CorePy<E, S, C>>>
export const CorePy = <E extends TSchema, S extends TSchema, C extends TSchema>(
  E: E,
  S: S,
  C: C
) =>
  Type.Object({
    cmd: C,
    state: S,
    evt: E
  })

export type CreatePrimaryWasteWf = Static<typeof CreatePrimaryWasteWf>
export const CreatePrimaryWasteWf = CoreWf(
  CMD(
    Type.Literal('create-primary-waste'),
    Type.Object({
      code: Type.Optional(PrimaryWasteCode),
      weight: Type.Optional(Weight),
      category: Type.Optional(Category)
    })
  ),
  Type.Object({}),
  EVT(
    Type.Literal('primary-waste-created'),
    Type.Object({
      waste: PrimaryCreatedWaste
    })
  )
)

export type WeightWasteWf = Static<typeof WeightWasteWf>
export const WeightWasteWf = CoreWf(
  CMD(
    Type.Literal('weight-waste'),
    Type.Object({
      wasteId: Type.String(),
      weight: Weight
    })
  ),
  Type.Object({
    waste: CreatedWaste
  }),
  EVT(
    Type.Literal('waste-weighted'),
    Type.Object({
      waste: CreatedWaste
    })
  )
)

export type CategorizeWasteWf = Static<typeof CategorizeWasteWf>
export const CategorizeWasteWf = CoreWf(
  CMD(
    Type.Literal('categorize-waste'),
    Type.Object({
      wasteId: Type.String(),
      category: Category
    })
  ),
  Type.Object({
    waste: CreatedWaste
  }),
  EVT(
    Type.Literal('waste-categorized'),
    Type.Object({
      waste: CreatedWaste
    })
  )
)

export type StoreWasteWf = Static<typeof StoreWasteWf>
export const StoreWasteWf = CoreWf(
  CMD(
    Type.Literal('store-waste'),
    Type.Object({
      wasteId: Type.String(),
      storageInfo: StorageInfo
    })
  ),
  Type.Object({
    waste: ReadyForStorageWaste,
    storageConfig: StorageConfig
  }),
  EVT(
    Type.Literal('waste-stored'),
    Type.Object({
      waste: StoredWaste
    })
  )
)

export type TreatWasteWf = Static<typeof TreatWasteWf>
export const TreatWasteWf = CoreWf(
  CMD(
    Type.Literal('treat-waste'),
    Type.Object({
      wasteId: Type.String(),
      treatmentInfo: TreatmentInfo
    })
  ),
  Type.Object({
    waste: PrimaryStoredWaste,
    treatmentConfig: TreatmentConfig,
    hfTreatmentCapacity: Type.Array(Type.String())
  }),
  EVT(
    Type.Literal('waste-treated'),
    Type.Object({
      waste: TreatedWaste
    })
  )
)

export type CreateSecondaryWasteWf = Static<typeof CreateSecondaryWasteWf>
export const CreateSecondaryWasteWf = CoreWf(
  CMD(
    Type.Literal('create-secondary-waste'),
    Type.Object({
      code: Type.Optional(SecondaryWasteCode),
      weight: Type.Optional(Weight),
      category: Type.Optional(SecondaryCategory),
      primaryWasteRef: Type.String()
    })
  ),
  Type.Object({}),
  EVT(
    Type.Literal('secondary-waste-created'),
    Type.Object({
      waste: SecondaryCreatedWaste
    })
  )
)

export type WasteWf = Static<typeof WasteWf>
export const WasteWf = Type.Union([
  CreatePrimaryWasteWf,
  WeightWasteWf,
  CategorizeWasteWf,
  StoreWasteWf,
  TreatWasteWf,
  CreateSecondaryWasteWf
])

export type WasteCmd = Static<typeof WasteCmd>
export const WasteCmd = Type.Index(WasteWf, Type.Literal('cmd'))

export type WasteEvt = Static<typeof WasteEvt>
export const WasteEvt = Type.Index(WasteWf, Type.Literal('evt'))

export type WasteWfState = Static<typeof WasteWfState>
export const WasteWfState = Type.Index(WasteWf, Type.Literal('state'))

export type CreateSecondaryWastePy = Static<typeof CreateSecondaryWastePy>
export const CreateSecondaryWastePy = CorePy(
  Type.Index(TreatWasteWf, Type.Literal('evt')),
  Type.Object({
    category: SecondaryCategory
  }),
  Type.Index(CreateSecondaryWasteWf, Type.Literal('cmd'))
)

export type WastePy = Static<typeof WastePy>
export const WastePy = CreateSecondaryWastePy

export type WastePyEvt = Static<typeof WastePyEvt>
export const WastePyEvt = Type.Index(WastePy, Type.Literal('evt'))

export type WastePyState = Static<typeof WastePyState>
export const WastePyState = Type.Index(WastePy, Type.Literal('state'))

export type WastePyCmd = Static<typeof WastePyCmd>
export const WastePyCmd = Type.Index(WastePy, Type.Literal('cmd'))
