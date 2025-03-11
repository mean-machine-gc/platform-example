import { CMD } from "dc-ts"
import { PrimaryWasteCode, Weight, PrimaryWasteType, IncinerationInfo } from "./waste"

export type CreatePrimaryWasteParams = {
    code?: PrimaryWasteCode
    weight?: Weight
    type?: PrimaryWasteType
}

export type CreatePrimaryWasteData = CreatePrimaryWasteParams

export type CreatePrimaryWasteState = {
    params: CreatePrimaryWasteParams
}


export type IncinerateWasteData = {
    wasteId: string,
    incinerationInfo: IncinerationInfo
}

export type CreatePrimaryWasteCmd = CMD<'create-primary-waste', CreatePrimaryWasteData>
export type IncinerateWasteCmd = CMD<'incinerate-waste', IncinerateWasteData>

export type WasteCmd = 
    CreatePrimaryWasteCmd |
    IncinerateWasteCmd



