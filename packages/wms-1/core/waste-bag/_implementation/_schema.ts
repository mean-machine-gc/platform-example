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

export type AsyncResult<T extends TSchema, F extends TSchema> = Static<
  ReturnType<typeof AsyncResult<T, F>>
>
export const AsyncResult = <T extends TSchema, F extends TSchema>(T: T, F: F) =>
  Type.Promise(Result(T, F))

export type Result<T extends TSchema, F extends TSchema> = Static<
  ReturnType<typeof Result<T, F>>
>
export const Result = <T extends TSchema, F extends TSchema>(T: T, F: F) =>
  Type.Union([Success(T), Failure(F)])

export type Success<T extends TSchema> = Static<ReturnType<typeof Success<T>>>
export const Success = <T extends TSchema>(T: T) =>
  Type.Object({
    outcome: Type.Literal('success'),
    data: T
  })

export type Failure<F extends TSchema> = Static<ReturnType<typeof Failure<F>>>
export const Failure = <F extends TSchema>(F: F) =>
  Type.Object({
    outcome: Type.Literal('failure'),
    cause: Type.Array(Cause(F))
  })

export type Cause<F extends TSchema> = Static<ReturnType<typeof Cause<F>>>
export const Cause = <F extends TSchema>(F: F) =>
  Type.Object({
    msg: F,
    data: Type.Optional(Type.Any())
  })

export type SafeParse<T extends TSchema> = Static<
  ReturnType<typeof SafeParse<T>>
>
export const SafeParse = <T extends TSchema>(T: T) =>
  Type.Function([T], Result(T, SafeParseFails))

export type SafeParseFails = Static<typeof SafeParseFails>
export const SafeParseFails = Type.Literal('parse_error')

export type CoreWfFails = Static<typeof CoreWfFails>
export const CoreWfFails = Type.Union([SafeParseFails, Type.String()])

export type CoreWf<
  C extends TSchema,
  A extends TSchema,
  E extends TSchema,
  F extends TSchema
> = Static<ReturnType<typeof CoreWf<C, A, E, F>>>
export const CoreWf = <
  C extends TSchema,
  A extends TSchema,
  E extends TSchema,
  F extends TSchema
>(
  C: C,
  A: A,
  E: E,
  F: F
) =>
  Type.Object({
    cmd: C,
    aggregate: A,
    evt: E,
    fails: F
  })

export type Weight = Static<typeof Weight>
export const Weight = Type.Object({
  uom: Type.Union([Type.Literal('kg'), Type.Literal('g')]),
  weight: Type.Number()
})

export type StorageType = Static<typeof StorageType>
export const StorageType = Type.Union([
  Type.Literal('temporary'),
  Type.Literal('coldstorage')
])

export type StorageLocation = Static<typeof StorageLocation>
export const StorageLocation = Type.Object({
  locationId: Type.String(),
  storageType: StorageType
})

export type Category = Static<typeof Category>
export const Category = Type.Object({
  name: Type.String(),
  tratment: Type.Union([Type.Literal('pyrolisis'), Type.Literal('autoclave')]),
  storageType: StorageType,
  maxTemporaryStorage: Type.Number(),
  minTemporaryStorage: Type.Number()
})

export type CreatedWaste = Static<typeof CreatedWaste>
export const CreatedWaste = Type.Object({
  status: Type.Literal('created'),
  wasteId: Type.String(),
  weight: Type.Optional(Weight),
  category: Type.Optional(Category)
})

export type ReadyToStore = Static<typeof ReadyToStore>
export const ReadyToStore = Type.Object({
  status: Type.Literal('ready-to-store'),
  wasteId: Type.String(),
  weight: Weight,
  category: Category
})

export type StoredWaste = Static<typeof StoredWaste>
export const StoredWaste = Type.Object({
  status: Type.Literal('stored'),
  wasteId: Type.String(),
  weight: Weight,
  category: Category,
  storageLocation: StorageLocation,
  storageExpiration: Type.Number()
})

export type Waste = Static<typeof Waste>
export const Waste = Type.Union([CreatedWaste, ReadyToStore, StoredWaste])

export type WasteAggregate = Static<typeof WasteAggregate>
export const WasteAggregate = Type.Object({
  waste: Waste
})

export type CreateWasteWf = Static<typeof CreateWasteWf>
export const CreateWasteWf = CoreWf(
  CMD(
    Type.Literal('create-waste'),
    Type.Object({
      userId: Type.String(),
      helathFacilityId: Type.String(),
      weight: Type.Optional(Weight),
      category: Type.Optional(Category)
    })
  ),
  WasteAggregate,
  Type.Union([
    EVT(
      Type.Literal('waste-created'),
      Type.Object({
        createdBy: Type.String(),
        healthFacilityId: Type.String(),
        createdAt: Type.Number(),
        wasteId: Type.String(),
        weight: Type.Optional(Weight),
        category: Type.Optional(Category)
      })
    ),
    EVT(
      Type.Literal('waste-ready-for-storage'),
      Type.Object({
        healthFacilityId: Type.String(),
        wasteId: Type.String()
      })
    )
  ]),
  CoreWfFails
)

export type WeightWasteWf = Static<typeof WeightWasteWf>
export const WeightWasteWf = CoreWf(
  CMD(
    Type.Literal('weight-waste'),
    Type.Object({
      userId: Type.String(),
      wasteId: Type.String(),
      helathFacilityId: Type.String(),
      weight: Weight
    })
  ),
  WasteAggregate,
  Type.Union([
    EVT(
      Type.Literal('waste-weighted'),
      Type.Object({
        weightedBy: Type.String(),
        healthFacilityId: Type.String(),
        weightedAt: Type.Number(),
        wasteId: Type.String(),
        weight: Weight
      })
    ),
    EVT(
      Type.Literal('waste-ready-for-storage'),
      Type.Object({
        healthFacilityId: Type.String(),
        wasteId: Type.String()
      })
    )
  ]),
  Type.Never()
)

export type CategorizeWasteWf = Static<typeof CategorizeWasteWf>
export const CategorizeWasteWf = CoreWf(
  CMD(
    Type.Literal('categorize-waste'),
    Type.Object({
      userId: Type.String(),
      wasteId: Type.String(),
      helathFacilityId: Type.String(),
      category: Category
    })
  ),
  WasteAggregate,
  Type.Union([
    EVT(
      Type.Literal('waste-categorized'),
      Type.Object({
        categorizedBy: Type.String(),
        healthFacilityId: Type.String(),
        categorizedAt: Type.Number(),
        wasteId: Type.String(),
        category: Category
      })
    ),
    EVT(
      Type.Literal('waste-ready-for-storage'),
      Type.Object({
        healthFacilityId: Type.String(),
        wasteId: Type.String()
      })
    )
  ]),
  Type.Never()
)

export type StoreWasteWf = Static<typeof StoreWasteWf>
export const StoreWasteWf = CoreWf(
  CMD(
    Type.Literal('store-waste'),
    Type.Object({
      userId: Type.String(),
      wasteId: Type.String(),
      helathFacilityId: Type.String(),
      storageLocation: StorageLocation
    })
  ),
  WasteAggregate,
  EVT(
    Type.Literal('waste-stored'),
    Type.Object({
      storedBy: Type.String(),
      healthFacilityId: Type.String(),
      storedAt: Type.Number(),
      wasteId: Type.String(),
      storageLocation: StorageLocation
    })
  ),
  Type.Union([
    CoreWfFails,
    Type.Literal('waste_is_not_weighted'),
    Type.Literal('waste_is_not_categorized')
  ])
)

export type WasteWf = Static<typeof WasteWf>
export const WasteWf = Type.Union([
  CreateWasteWf,
  WeightWasteWf,
  CategorizeWasteWf,
  StoreWasteWf
])

export type WasteWfCmd = Static<typeof WasteWfCmd>
export const WasteWfCmd = Type.Index(CreateWasteWf, Type.Literal('cmd'))

export type WasteWfEvt = Static<typeof WasteWfEvt>
export const WasteWfEvt = Type.Index(CreateWasteWf, Type.Literal('evt'))
