import { CoreWf } from 'dc-ts'
import { CreatePrimaryWasteCmd, CreatePrimaryWasteState, IncinerateWasteCmd } from './commands'
import { PrimaryWasteCreatedEvt, WasteIncineratedEvt } from './events'
import { IncinerateWasteState } from './state'



export type CreatePrimaryWasteWf = CoreWf<CreatePrimaryWasteCmd, CreatePrimaryWasteState, PrimaryWasteCreatedEvt>
export type IncinerateWasteWf = CoreWf<IncinerateWasteCmd, IncinerateWasteState, WasteIncineratedEvt>
//constrains: 1) the health facility must be enabled to incinerate 2) the waste type must be the right type for incineration, we can use the utility canIncinerate to establish that