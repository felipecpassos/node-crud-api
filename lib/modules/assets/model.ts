import { Schema } from "mongoose";
import { ModificationNote } from "../common/model";

export interface IAsset {
    _id?: String;
    name: String;
    description: String;
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' };
    responsable: { type: Schema.Types.ObjectId, ref: 'User'},
    status?: {
        type: String,
        default: "Em operação"
    };
    health?: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    };
    is_deleted?: Boolean;
    modification_notes: ModificationNote[]
}