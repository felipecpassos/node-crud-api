import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User'},
    company_email: String,
    phone_number: String,
    business_units: [{ type: Schema.Types.ObjectId, ref: 'Unit'}],
    personel: [{ type: Schema.Types.ObjectId, ref: "User"}],
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [ModificationNote]
});

export default mongoose.model('companies', schema);