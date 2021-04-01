"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoutes = void 0;
const companyController_1 = require("../controllers/companyController");
class CompanyRoutes {
    constructor() {
        this.company_controller = new companyController_1.CompanyController();
    }
    route(app) {
        app.post('/api/company', (req, res) => {
            this.company_controller.create_company(req, res);
        });
        app.get('/api/company/:id', (req, res) => {
            this.company_controller.get_company(req, res);
        });
        app.put('/api/company/:id', (req, res) => {
            this.company_controller.update_company(req, res);
        });
        app.delete('/api/company/:id', (req, res) => {
            this.company_controller.delete_company(req, res);
        });
    }
}
exports.CompanyRoutes = CompanyRoutes;
