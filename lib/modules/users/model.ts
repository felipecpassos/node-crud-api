import { Schema } from "mongoose";
import { ModificationNote } from "../common/model";

export interface IUser {
    _id?: String;
    name: {
        first_name: String;
        last_name: String;
    };
    email: String;
    phone_number: String;
    gender: String;
    companies?: [{ type: Schema.Types.ObjectId, ref: 'Company'}];
    employee_on?: [{ type: Schema.Types.ObjectId, ref: 'Company'}];
    assets_responsable?: [{ type: Schema.Types.ObjectId, ref: 'Assets'}];
    is_deleted?: Boolean;
    modification_notes: ModificationNote[]
}