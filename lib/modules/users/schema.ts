import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: {
            first_name: String,
            last_name: String
        }
    },
    email: String,
    phone_number: String,
    gender: String,
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company'}],
    employee_on: [{ type: Schema.Types.ObjectId, ref: 'Company'}],
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [ModificationNote]
});

export default mongoose.model('users', schema);