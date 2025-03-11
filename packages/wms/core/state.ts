import { PrimaryStoredHazardous } from "./waste"

export type IncinerateWasteState = {
    isHealthFacilityEnabled: boolean,
    waste: PrimaryStoredHazardous
}