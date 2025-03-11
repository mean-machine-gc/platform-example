import { EVT } from "dc-ts"
import { Incinerated } from "./waste"

export type WasteIncineratedData = {
    waste: Incinerated
}

export type PrimaryWasteCreatedData = {
    wasteId: string
}

export type WasteIncineratedEvt = EVT<'waste-incinerated', WasteIncineratedData>
export type PrimaryWasteCreatedEvt = EVT<'primary-waste-created', PrimaryWasteCreatedData>

export type WasteEvt = 
    WasteIncineratedEvt |
    PrimaryWasteCreatedEvt