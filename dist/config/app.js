"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("../environment");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const test_routes_1 = require("../routes/test_routes");
const common_routes_1 = require("../routes/common_routes");
const user_routes_1 = require("../routes/user_routes");
const company_routes_1 = require("../routes/company_routes");
class App {
    constructor() {
        this.mongoUrl = 'mongodb+srv://user:user@cluster0.9hbnr.mongodb.net/' + environment_1.default.getDBName() + '?retryWrites=true&w=majority';
        this.company_routes = new company_routes_1.CompanyRoutes();
        this.user_routes = new user_routes_1.UserRoutes();
        this.test_routes = new test_routes_1.TestRoutes();
        this.common_routes = new common_routes_1.CommonRoutes();
        this.app = express();
        this.config();
        console.log("mongoUrl: " + this.mongoUrl);
        this.mongoSetup();
        this.company_routes.route(this.app);
        this.user_routes.route(this.app);
        this.test_routes.route(this.app);
        this.common_routes.route(this.app); //always keep common_routes last
    }
    config() {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    mongoSetup() {
        mongoose.connect(this.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    }
}
exports.default = new App().app;
