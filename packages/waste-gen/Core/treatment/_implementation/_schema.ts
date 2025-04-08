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

export type AGG<T extends TSchema, D extends TSchema> = Static<
  ReturnType<typeof AGG<T, D>>
>
export const AGG = <T extends TSchema, D extends TSchema>(T: T, D: D) =>
  Type.Object({
    _tag: T,
    data: D
  })

export type CoreWf<
  C extends TSchema,
  iA extends TSchema,
  E extends TSchema,
  oA extends TSchema,
  F extends TSchema
> = Static<ReturnType<typeof CoreWf<C, iA, E, oA, F>>>
export const CoreWf = <
  C extends TSchema,
  iA extends TSchema,
  E extends TSchema,
  oA extends TSchema,
  F extends TSchema
>(
  C: C,
  iA: iA,
  E: E,
  oA: oA,
  F: F
) =>
  Type.Object({
    cmd: C,
    inputAg: iA,
    outputAg: oA,
    aggregate: Type.Union([iA, oA]),
    evt: E,
    fails: F,
    validateAggregate: SafeParse(Type.Union([iA, oA]))
  })

export type Weight = Static<typeof Weight>
export const Weight = Type.Object({
  uom: Type.Union([Type.Literal('kg'), Type.Literal('g')]),
  weight: Type.Number()
})

export type Volume = Static<typeof Volume>
export const Volume = Type.Object({
  uom: Type.Literal('liters'),
  volume: Type.Number()
})

export type LoadingCapacity = Static<typeof LoadingCapacity>
export const LoadingCapacity = Type.Object({
  minWeightCapacity: Weight,
  maxWeightCapacity: Weight,
  minVolumeCapacity: Volume,
  maxVolumeCapacity: Volume
})

export type CurrentLoad = Static<typeof CurrentLoad>
export const CurrentLoad = Type.Object({
  weight: Weight,
  weightPercent: Type.Number(),
  volume: Weight,
  volumePercent: Type.Number()
})

export type Equipment = Static<typeof Equipment>
export const Equipment = Type.Object({
  equipmentId: Type.String(),
  healthFacilityId: Type.String(),
  status: Type.Union([Type.Literal('ok'), Type.Literal('out-of-order')])
})

export type ResidueWasteCategories = Static<typeof ResidueWasteCategories>
export const ResidueWasteCategories = Type.Object({
  inputCategories: Type.Array(Type.String()),
  outputCategories: Type.Array(Type.String())
})

export type TreatmentType = Static<typeof TreatmentType>
export const TreatmentType = Type.Object({
  treatmentTypeId: Type.String(),
  treatmentName: Type.String(),
  duration: Type.Number(),
  acceptedWasteCategories: Type.Array(Type.String()),
  residueWasteCategories: Type.Array(ResidueWasteCategories),
  loadingEquipmentType: Type.Array(Type.String()),
  otherEquipmentType: Type.Array(Type.String())
})

export type HealthFacility = Static<typeof HealthFacility>
export const HealthFacility = Type.Object({
  healthFacilityId: Type.String(),
  allowedTreatments: TreatmentType
})

export type BaseWasteBag = Static<typeof BaseWasteBag>
export const BaseWasteBag = Type.Object({
  wasteBagId: Type.String(),
  statusBeforeTreatment: Type.Literal('stored'),
  treatmentId: Type.String(),
  weight: Weight,
  volume: Volume,
  wasteCategoryId: Type.String()
})

export type LoadedForTreatmentWaste = Static<typeof LoadedForTreatmentWaste>
export const LoadedForTreatmentWaste = Type.Intersect([
  BaseWasteBag,
  Type.Object({
    status: Type.Literal('loaded-for-treatment')
  })
])

export type UnderTreatmentWaste = Static<typeof UnderTreatmentWaste>
export const UnderTreatmentWaste = Type.Intersect([
  BaseWasteBag,
  Type.Object({
    status: Type.Literal('under-treatment')
  })
])

export type TreatedWaste = Static<typeof TreatedWaste>
export const TreatedWaste = Type.Intersect([
  BaseWasteBag,
  Type.Object({
    status: Type.Literal('treated')
  })
])

export type WasteBag = Static<typeof WasteBag>
export const WasteBag = Type.Union([
  LoadedForTreatmentWaste,
  UnderTreatmentWaste,
  TreatedWaste
])

export type BaseTreatment = Static<typeof BaseTreatment>
export const BaseTreatment = Type.Object({
  treatmentId: Type.String(),
  treatmentType: TreatmentType,
  loadingEquipment: Type.Object({
    equipmentId: Type.String(),
    loadingCapacity: LoadingCapacity,
    currentLoad: CurrentLoad
  }),
  otherEquipment: Type.Array(Type.String()),
  healthFacilityId: Type.String(),
  createdAt: Type.Number()
})

export type CreatedTreatment = Static<typeof CreatedTreatment>
export const CreatedTreatment = Type.Intersect([
  BaseTreatment,
  Type.Object({
    status: Type.Literal('created')
  })
])

export type LoadingTreatment = Static<typeof LoadingTreatment>
export const LoadingTreatment = Type.Intersect([
  BaseTreatment,
  Type.Object({
    status: Type.Literal('loading'),
    wasteBags: Type.Array(LoadedForTreatmentWaste)
  })
])

export type ReadyToStartTreatment = Static<typeof ReadyToStartTreatment>
export const ReadyToStartTreatment = Type.Intersect([
  BaseTreatment,
  Type.Object({
    status: Type.Literal('ready-to-start'),
    wasteBags: Type.Array(LoadedForTreatmentWaste)
  })
])

export type InProgressTreatment = Static<typeof InProgressTreatment>
export const InProgressTreatment = Type.Intersect([
  BaseTreatment,
  Type.Object({
    status: Type.Literal('in-progress'),
    wasteBags: Type.Array(UnderTreatmentWaste),
    startedAt: Type.Number(),
    startedBy: Type.String()
  })
])

export type CompletedTreatment = Static<typeof CompletedTreatment>
export const CompletedTreatment = Type.Intersect([
  BaseTreatment,
  Type.Object({
    status: Type.Literal('completed'),
    wasteBags: Type.Array(TreatedWaste),
    startedAt: Type.Number(),
    startedBy: Type.String(),
    completedAt: Type.Number()
  })
])

export type Treatment = Static<typeof Treatment>
export const Treatment = Type.Union([
  CreatedTreatment,
  LoadingTreatment,
  ReadyToStartTreatment,
  InProgressTreatment,
  CompletedTreatment
])

export type CreateTreatmentWf = Static<typeof CreateTreatmentWf>
export const CreateTreatmentWf = CoreWf(
  CMD(
    Type.Literal('create-treatment'),
    Type.Object({
      userId: Type.String(),
      healthFacility: Type.Object({
        healthFacilityId: Type.String(),
        allowedTreatments: Type.Array(Type.String())
      }),
      loadingEquipment: Type.Object({
        equipmentId: Type.String(),
        healthFacilityId: Type.String(),
        equipmentType: Type.String(),
        inGoodOrder: Type.Boolean(),
        loadingCapacity: LoadingCapacity
      }),
      otherEquipment: Type.Object({
        equipmentId: Type.String(),
        healthFacilityId: Type.String(),
        equipmentType: Type.String(),
        inGoodOrder: Type.Boolean()
      }),
      treatmentTypeId: Type.String()
    })
  ),
  AGG(
    Type.Literal('initial'),
    Type.Object({
      treatement: Type.Null()
    })
  ),
  EVT(
    Type.Literal('treatment-created'),
    Type.Object({
      createdBy: Type.String(),
      createdAt: Type.String(),
      treatmentId: Type.String(),
      treatmentType: TreatmentType,
      healthFacilityId: Type.String(),
      loadingEquipment: Type.Object({
        equipmentId: Type.String(),
        equipmentType: Type.String(),
        loadingCapacity: Type.String()
      }),
      otherEquipment: Type.Object({
        equipmentId: Type.String(),
        equipmentType: Type.String()
      })
    })
  ),
  AGG(
    Type.Literal('created'),
    Type.Object({
      treatement: CreatedTreatment
    })
  ),
  Type.Union([
    CoreWfFails,
    Type.Literal('health_facility_not_allowed_for_this_treatment_type'),
    Type.Literal('equipment_not_allowed_for_this_treatment_type'),
    Type.Literal('equipment_out_of_order')
  ])
)

export type LoadTreatmentWf = Static<typeof LoadTreatmentWf>
export const LoadTreatmentWf = CoreWf(
  CMD(
    Type.Literal('load-treatment'),
    Type.Object({
      userId: Type.String(),
      healthFacilityId: Type.String(),
      treatmentId: Type.String(),
      waste: Type.Array(
        Type.Object({
          wasteBagId: Type.String(),
          statusBeforeTreatment: Type.Literal('stored'),
          weight: Weight,
          volume: Volume,
          wasteCategoryId: Type.String()
        })
      )
    })
  ),
  AGG(
    Type.Literal('can-load'),
    Type.Object({
      treatement: CreatedTreatment
    })
  ),
  Type.Union([
    EVT(
      Type.Literal('waste-added-to-treatment'),
      Type.Object({
        treatmentId: Type.String(),
        addedBy: Type.String(),
        addedAt: Type.String(),
        healthFacilityId: Type.String(),
        waste: Type.Array(
          Type.Object({
            wasteBagId: Type.String(),
            statusBeforeTreatment: Type.Literal('stored'),
            weight: Weight,
            volume: Volume,
            wasteCategoryId: Type.String()
          })
        )
      })
    ),
    EVT(
      Type.Literal('loading-partially-rejected'),
      Type.Object({
        treatmentId: Type.String(),
        loadedBy: Type.String(),
        rejectedAt: Type.String(),
        healthFacilityId: Type.String(),
        waste: Type.Array(
          Type.Object({
            wasteBagId: Type.String(),
            statusBeforeTreatment: Type.Literal('stored'),
            weight: Weight,
            volume: Volume,
            wasteCategoryId: Type.String()
          })
        )
      })
    )
  ]),
  AGG(
    Type.Literal('loading'),
    Type.Object({
      treatement: LoadingTreatment
    })
  ),
  Type.Union([
    CoreWfFails,
    Type.Literal('loading_equipment_is_at_full_capacity'),
    Type.Literal('waste_category_not_allowed')
  ])
)

export type StartTreatmentWf = Static<typeof StartTreatmentWf>
export const StartTreatmentWf = CoreWf(
  CMD(
    Type.Literal('start-treatment'),
    Type.Object({
      userId: Type.String(),
      healthFacilityId: Type.String(),
      treatmentId: Type.String()
    })
  ),
  AGG(
    Type.Literal('can-start'),
    Type.Object({
      treatement: ReadyToStartTreatment
    })
  ),
  EVT(
    Type.Literal('treatment-started'),
    Type.Object({
      treatmentId: Type.String(),
      startedBy: Type.String(),
      startedAt: Type.Number(),
      healthFacilityId: Type.String()
    })
  ),
  AGG(
    Type.Literal('started'),
    Type.Object({
      treatement: InProgressTreatment
    })
  ),
  CoreWfFails
)

export type CompleteTreatmentWf = Static<typeof CompleteTreatmentWf>
export const CompleteTreatmentWf = CoreWf(
  CMD(
    Type.Literal('complete-treatment'),
    Type.Object({
      userId: Type.String(),
      healthFacilityId: Type.String(),
      treatmentId: Type.String()
    })
  ),
  AGG(
    Type.Literal('can-complete'),
    Type.Object({
      treatement: InProgressTreatment
    })
  ),
  EVT(
    Type.Literal('treatment-started'),
    Type.Object({
      treatmentId: Type.String(),
      completedBy: Type.String(),
      completedAt: Type.String(),
      healthFacilityId: Type.String()
    })
  ),
  AGG(
    Type.Literal('completed'),
    Type.Object({
      treatement: CompletedTreatment
    })
  ),
  CoreWfFails
)

export type TreatmentWf = Static<typeof TreatmentWf>
export const TreatmentWf = Type.Union([
  CreateTreatmentWf,
  LoadTreatmentWf,
  StartTreatmentWf,
  CompleteTreatmentWf
])

export type TreatmentCmd = Static<typeof TreatmentCmd>
export const TreatmentCmd = Type.Index(TreatmentWf, Type.Literal('cmd'))

export type TreatmentEvt = Static<typeof TreatmentEvt>
export const TreatmentEvt = Type.Index(TreatmentWf, Type.Literal('evt'))

export type TreatmentAggregate = Static<typeof TreatmentAggregate>
export const TreatmentAggregate = Type.Index(
  TreatmentWf,
  Type.Literal('aggregate')
)

export type TreatmentFails = Static<typeof TreatmentFails>
export const TreatmentFails = Type.Index(TreatmentWf, Type.Literal('fails'))
