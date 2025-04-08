// Auto-generated constructors for commands, events, aggregates

import { newCmd, newEvt, newAgg, safeParseTBox } from 'dc-ts'

import * as DomainSchema from '../domain/_schema/domain.schema'
export const newDomainCMD = newCmd<any, any>(safeParseTBox(DomainSchema.DomainCmd))
export const newDomainEVT = newEvt<any, any>(safeParseTBox(DomainSchema.DomainEvt))
export const newDomainAgg = newAgg<any>(safeParseTBox(DomainSchema.DomainAggregate))
