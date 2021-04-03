import { Schema } from "mongoose";
import { ModificationNote } from "../common/model";

export interface IAsset {
    _id?: String;
    name: String;
    description: String;
    model: String;
    serial_number: String;
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' };
    responsable: { type: Schema.Types.ObjectId, ref: 'User'};
    status?: String;
    health?: Number;
    is_deleted?: Boolean;
    modification_notes: ModificationNote[]
}