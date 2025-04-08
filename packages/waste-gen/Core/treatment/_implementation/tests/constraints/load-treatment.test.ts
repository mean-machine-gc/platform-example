import { constrainTreatment } from '../constrain'
import { sampleCmd, sampleState } from '../testkit'
import { isFailure } from 'dc-ts'

describe('load-treatment', () => {
  it('fails if no waste bags provided', () => {
    const cmd = sampleCmd('load-treatment', {
      // TODO: override this with data that triggers:
      // !wasteBags.length
    })
    const state = sampleState('initial')

    const result = constrainTreatment(cmd)(state)
    expect(isFailure(result)).toBe(true)
    expect(result.cause.some(c => c.msg === 'no_waste_bags_provided')).toBe(true)
  })

  it('fails if no waste categories allowed', () => {
    const cmd = sampleCmd('load-treatment', {
      // TODO: override this with data that triggers:
      // !allowedCategories || !allowedCategories.length
    })
    const state = sampleState('initial')

    const result = constrainTreatment(cmd)(state)
    expect(isFailure(result)).toBe(true)
    expect(result.cause.some(c => c.msg === 'no_waste_categories_allowed')).toBe(true)
  })

  it('fails if waste category not allowed', () => {
    const cmd = sampleCmd('load-treatment', {
      // TODO: override this with data that triggers:
      // !allowedBags.length
    })
    const state = sampleState('initial')

    const result = constrainTreatment(cmd)(state)
    expect(isFailure(result)).toBe(true)
    expect(result.cause.some(c => c.msg === 'waste_category_not_allowed')).toBe(true)
  })

})