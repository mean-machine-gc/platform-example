// Auto-generated test for constraints on treatment

import { hf, ✅, ❌, , equipment, ✅, ❌, , at, ✅, ❌, ❌, ❌,  } from '../constrain'
import { succeed } from 'dc-ts'

describe('Constraint logic for treatment', () => {
  describe('hf Must Be Enabled (cmd)', () => {

    it('✅ allows valid command', () => {
      const cmd = {} as any
      const state = {} as any
      const res = _hfMustBeEnabled(cmd)(state)
      expect(res.outcome).toBe('success')
    })

    it('❌ fails with health_facility_not_allowed', () => {
      const cmd = {} as any
      const state = {} as any
      const res = _hfMustBeEnabled(cmd)(state)
      expect(res.outcome).toBe('failure')
      expect(res.cause.some(c => c.msg === 'health_facility_not_allowed')).toBe(true)
    })

  })

  describe('equipment Must Be In Good Order (cmd)', () => {

    it('✅ allows valid command', () => {
      const cmd = {} as any
      const state = {} as any
      const res = _equipmentMustBeInGoodOrder(cmd)(state)
      expect(res.outcome).toBe('success')
    })

    it('❌ fails with equipment_out_of_order', () => {
      const cmd = {} as any
      const state = {} as any
      const res = _equipmentMustBeInGoodOrder(cmd)(state)
      expect(res.outcome).toBe('failure')
      expect(res.cause.some(c => c.msg === 'equipment_out_of_order')).toBe(true)
    })

  })

  describe('at Least One Waste Bag Loaded (cmd)', () => {

    it('✅ allows valid command', () => {
      const cmd = {} as any
      const state = {} as any
      const res = _atLeastOneWasteBagLoaded(cmd)(state)
      expect(res.outcome).toBe('success')
    })

    it('❌ fails with no_waste_bags_provided', () => {
      const cmd = {} as any
      const state = {} as any
      const res = _atLeastOneWasteBagLoaded(cmd)(state)
      expect(res.outcome).toBe('failure')
      expect(res.cause.some(c => c.msg === 'no_waste_bags_provided')).toBe(true)
    })

    it('❌ fails with no_waste_categories_allowed', () => {
      const cmd = {} as any
      const state = {} as any
      const res = _atLeastOneWasteBagLoaded(cmd)(state)
      expect(res.outcome).toBe('failure')
      expect(res.cause.some(c => c.msg === 'no_waste_categories_allowed')).toBe(true)
    })

    it('❌ fails with waste_category_not_allowed', () => {
      const cmd = {} as any
      const state = {} as any
      const res = _atLeastOneWasteBagLoaded(cmd)(state)
      expect(res.outcome).toBe('failure')
      expect(res.cause.some(c => c.msg === 'waste_category_not_allowed')).toBe(true)
    })

  })
})
