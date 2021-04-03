import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    unit_name: String,
    owner_company: { type: Schema.Types.ObjectId, ref: 'Company'},
    contact_email: String,
    phone_number: String,
    assets: [{ type: Schema.Types.ObjectId, ref:'Asset'}],
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [ModificationNote]
});

export default mongoose.model('units', schema);