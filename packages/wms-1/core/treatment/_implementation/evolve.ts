import { CreatedTreatment, TreatmentWf, CreateTreatmentWf, LoadTreatmentWf, LoadedForTreatmentWaste, StartTreatmentWf, CompleteTreatmentWf, UnderTreatmentWaste, TreatedWaste } from "../treatment";

export const evolve = (evt: TreatmentWf['evt']) => (state: TreatmentWf['aggregate']): TreatmentWf['aggregate'] => {
    switch(evt.type){
        case "treatment-created":
            return _evolveCreateTreatment(evt)(state as CreateTreatmentWf['inputAg'])
        case "waste-added-to-treatment":
            return _evolveWasteAddedToTreatment(evt)(state as LoadTreatmentWf['inputAg'])
        case "loading-partially-rejected":
            return state
        case "treatment-started":
            return _evolveTreatmentStarted(evt)(state as StartTreatmentWf['inputAg'])
        case 'treatment-completed':
            return _evolveTreatmentCompleted(evt)(state as CompleteTreatmentWf['inputAg'])
    }
}

const _evolveCreateTreatment = (evt: CreateTreatmentWf['evt']) => (state: CreateTreatmentWf['inputAg']) => {
    const agg: CreateTreatmentWf['outputAg'] = {
        _tag: 'created',
        data: {
            treatement: {
                treatmentId: evt.data.treatmentId,
                treatmentType: evt.data.treatmentType,
                loadingEquipment: evt.data.loadingEquipment,
                otherEquipment: evt.data.otherEquipment,
                healthFacilityId: evt.data.healthFacilityId,
                createdAt: evt.data.createdAt,
                createdBy: evt.data.createdBy,
                status: 'created'
            }
        }
    }
    return agg
}

const _evolveWasteAddedToTreatment = (evt: LoadTreatmentWf['evt']) => (state: LoadTreatmentWf['inputAg']) => {
    const wasteBags: LoadedForTreatmentWaste[] = evt.data.waste.map(w => {
        return {
            ...w,
            status: 'loaded-for-treatment',
            treatmentId: evt.data.treatmentId
        }
    })
    const agg: LoadTreatmentWf['outputAg'] = {
        _tag: 'loading',
        data: {
            treatement: {
                ...state.data.treatement,
                status: 'loading',
                wasteBags: wasteBags
            }
        }
    }
    return agg
}

const _evolveTreatmentStarted = (evt: StartTreatmentWf['evt']) => (state: StartTreatmentWf['inputAg']) => {
    const wasteBags: UnderTreatmentWaste[] = state.data.treatement.wasteBags.map(w => {
        return {
            ...w,
            status: 'under-treatment'
        }
    })
    const agg: StartTreatmentWf['outputAg'] = {
        _tag: 'started',
        data: {
            treatement: {
                ...state.data.treatement,
                status: 'in-progress',
                startedAt: evt.data.startedAt,
                startedBy: evt.data.startedBy,
                wasteBags
            }
        }
    }

    return agg
}

const _evolveTreatmentCompleted = (evt: CompleteTreatmentWf['evt']) => (state: CompleteTreatmentWf['inputAg']) => {
    const wasteBags: TreatedWaste[] = state.data.treatement.wasteBags.map(w => {
        return {
            ...w,
            status: 'treated'
        }
    })

    const agg: CompleteTreatmentWf['outputAg'] = {
        _tag: 'completed',
        data: {
            treatement: {
                ...state.data.treatement,
                wasteBags,
                status: 'completed',
                completedAt: evt.data.completedAt,
                completedBy: evt.data.completedBy,
                duration: evt.data.duration
            }
        }
    }

    return agg
}