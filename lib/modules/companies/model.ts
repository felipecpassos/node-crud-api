import { Schema } from "mongoose";
import { ModificationNote } from "../common/model";

export interface ICompany {
    _id?: String;
    owner: { type: Schema.Types.ObjectId, ref: 'User'};
    name: String;
    company_email: String;
    phone_number: String;
    business_units?: [{ type: Schema.Types.ObjectId, ref: 'Unit'}];
    personel?: [{ type: Schema.Types.ObjectId, ref: "User"}];
    is_deleted?: Boolean;
    modification_notes: ModificationNote[]
}