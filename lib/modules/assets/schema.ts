import * as mongoose from 'mongoose';
import { ModificationNote } from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    description: String,
    model: String,
    unit: { type: Schema.Types.ObjectId, ref: 'Unit' },
    responsable: { type: Schema.Types.ObjectId, ref: 'User'},
    status: {
        type: String,
        default: "Em operação"
    },
    health: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [ModificationNote]
});

export default mongoose.model('assets', schema);