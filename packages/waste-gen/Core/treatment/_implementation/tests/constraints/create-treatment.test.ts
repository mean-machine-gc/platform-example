import { constrainTreatment } from '../constrain'
import { sampleCmd, sampleState } from '../testkit'
import { isFailure } from 'dc-ts'

describe('create-treatment', () => {
  it('fails if health facility not allowed', () => {
    const cmd = sampleCmd('create-treatment', {
      // TODO: override this with data that triggers:
      // allowedTreatments.indexOf(treatmentType) === -1
    })
    const state = sampleState('initial')

    const result = constrainTreatment(cmd)(state)
    expect(isFailure(result)).toBe(true)
    expect(result.cause.some(c => c.msg === 'health_facility_not_allowed')).toBe(true)
  })

  it('fails if equipment out of order', () => {
    const cmd = sampleCmd('create-treatment', {
      // TODO: override this with data that triggers:
      // !accumulator.inGoodOrder
    })
    const state = sampleState('initial')

    const result = constrainTreatment(cmd)(state)
    expect(isFailure(result)).toBe(true)
    expect(result.cause.some(c => c.msg === 'equipment_out_of_order')).toBe(true)
  })

})