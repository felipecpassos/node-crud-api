"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const model_1 = require("../common/model");
const Schema = mongoose.Schema;
const schema = new Schema({
    unit_name: String,
    owner_company: { type: Schema.Types.ObjectId, ref: 'Company' },
    contact_email: String,
    phone_number: String,
    // TODO ADD LIST OF ASSETS
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [model_1.ModificationNote]
});
exports.default = mongoose.model('users', schema);
