import env from "../environment";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import { TestRoutes } from "../routes/test_routes";
import { CommonRoutes } from "../routes/common_routes"
import { UserRoutes } from "../routes/user_routes"
import { CompanyRoutes } from "../routes/company_routes"
import { UnitRoutes } from "../routes/unit_routes"
import { AssetRoutes } from "../routes/asset_routes"

require('dotenv/config');

class App {

   public app: express.Application;
   
   public mongoUrl: string = process.env.DB_URL;

   private asset_routes: AssetRoutes = new AssetRoutes();
   private unit_routes: UnitRoutes = new UnitRoutes();
   private company_routes: CompanyRoutes = new CompanyRoutes();
   private user_routes: UserRoutes = new UserRoutes();
   private test_routes: TestRoutes = new TestRoutes();
   private common_routes: CommonRoutes = new CommonRoutes();

   constructor() {
      this.app = express();
      this.config();
      this.mongoSetup();
      this.asset_routes.route(this.app);
      this.company_routes.route(this.app);
      this.unit_routes.route(this.app);
      this.user_routes.route(this.app);
      this.test_routes.route(this.app);
      this.common_routes.route(this.app); //always keep common_routes last
   }

   private config(): void {
      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({ extended: false }));
   }

   private mongoSetup(): void {
      mongoose.connect(this.mongoUrl, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useCreateIndex: true,
         useFindAndModify: false
      })
   }
}

export default new App().app;