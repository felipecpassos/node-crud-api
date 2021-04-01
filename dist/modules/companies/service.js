"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const service_1 = require("../users/service");
class CompanyService {
    constructor() {
        this.user_service = new service_1.default();
    }
    createCompany(company_params, callback) {
        console.log("company params: " + company_params);
        const _session = new schema_1.default(company_params);
        _session.save(callback);
    }
    filterCompany(query, callback) {
        schema_1.default.findOne(query, callback);
    }
    updateCompany(company_params, callback) {
        const query = { _id: company_params._id };
        schema_1.default.findOneAndUpdate(query, company_params, callback);
    }
    deleteCompany(_id, callback) {
        const query = { _id: _id };
        schema_1.default.deleteOne(query, callback);
    }
}
exports.default = CompanyService;
