import { Schema } from "mongoose";
import { ModificationNote } from "../common/model";

export interface IUnit {
    _id?: String;
    unit_name: String;
    owner_company: { type: Schema.Types.ObjectId, ref: 'Company'},
    contact_email: String;
    phone_number: String;
    assets?: [{ type: Schema.Types.ObjectId, ref:'Asset'}];
    is_deleted?: Boolean;
    modification_notes: ModificationNote[]
}