"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const model_1 = require("../common/model");
const Schema = mongoose.Schema;
const schema = new Schema({
    name: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    company_email: String,
    phone_number: String,
    business_units: [{ type: Schema.Types.ObjectId, ref: 'Unit' }],
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [model_1.ModificationNote]
});
exports.default = mongoose.model('companies', schema);
