"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
class UnitService {
    createUnit(unit_params, callback) {
        const _session = new schema_1.default(unit_params);
        _session.save(callback);
    }
    filterUnit(query, callback) {
        schema_1.default.findOne(query, callback);
    }
    updateUnit(unit_params, callback) {
        const query = { _id: unit_params._id };
        schema_1.default.findOneAndUpdate(query, unit_params, callback);
    }
    deleteUnit(_id, callback) {
        const query = { _id: _id };
        schema_1.default.deleteOne(query, callback);
    }
}
exports.default = UnitService;
