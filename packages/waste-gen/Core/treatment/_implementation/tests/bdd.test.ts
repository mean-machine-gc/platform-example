import {
    sampleCmd,
    sampleState,
    sampleEvt,
  } from '../testkit'
  import { constrainTreatment } from '../constrain'
  import { decideTreatment } from '../decide'
  import { evolve } from '../evolve'
  import { validateAggregate } from '../validators'
  import { isFailure, succeed } from 'dc-ts'
  
  describe('🧪 BDD Tests for Treatment Workflows', () => {
    describe('🟦 create-treatment → 🟧 treatment-created', () => {
      it('✅ succeeds end-to-end', () => {
        // Given
        const state = sampleState('initial')
  
        // When
        const cmd = sampleCmd('create-treatment')
  
        // Then: Validate
        const validated = validateAggregate(state)
        expect(validated.outcome).toBe('success')
  
        // Then: Constrain
        const constrained = constrainTreatment(cmd)(state)
        expect(constrained.outcome).toBe('success')
  
        // Then: Decide
        const result = decideTreatment(cmd)(state)
        expect(result.outcome).toBe('success')
        const [evt] = result.data
        expect(evt.type).toBe('treatment-created')
  
        // Then: Evolve
        const next = evolve(evt)(state)
        expect(next._tag).toBe('created')
      })
    })
  
    describe('🟦 complete-treatment → 🟧 treatment-completed', () => {
      it('✅ completes treatment successfully', () => {
        const state = sampleState('can-complete')
        const cmd = sampleCmd('complete-treatment')
  
        const validated = validateAggregate(state)
        expect(validated.outcome).toBe('success')
  
        const constrained = constrainTreatment(cmd)(state)
        expect(constrained.outcome).toBe('success')
  
        const result = decideTreatment(cmd)(state)
        expect(result.outcome).toBe('success')
        const [evt] = result.data
        expect(evt.type).toBe('treatment-completed')
  
        const next = evolve(evt)(state)
        expect(next._tag).toBe('completed')
      })
    })
  
    describe('❌ failure: health facility not allowed', () => {
      it('fails on _hfMustBeEnabled constraint', () => {
        const state = sampleState('initial')
        const cmd = sampleCmd('create-treatment', {
          data: {
            healthFacility: {
              allowedTreatments: ['some-other-treatment']
            },
            treatmentTypeId: 'not-allowed'
          }
        })
  
        const result = constrainTreatment(cmd)(state)
        expect(isFailure(result)).toBe(true)
        expect(result.cause.some(c => c.msg === 'health_facility_not_allowed')).toBe(true)
      })
    })
  })
  