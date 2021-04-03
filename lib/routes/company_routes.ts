import { Application, Request, Response } from 'express';
import { CompanyController } from '../controllers/companyController';

export class CompanyRoutes {

    private company_controller: CompanyController = new CompanyController();

    public route(app: Application) {
        
        app.post('/api/company', (req: Request, res: Response) => {
            this.company_controller.create_company(req, res);
        });

        app.get('/api/company/:id', (req: Request, res: Response) => {
            this.company_controller.get_company(req, res);
        });

        app.put('/api/company/:id', (req: Request, res: Response) => {
            this.company_controller.update_company(req, res);
        });

        app.put('/api/company-personel/:id', (req: Request, res: Response) => {
            // this.company_controller.update_company(req, res);
            this.company_controller.add_personel(req, res);
        });

        app.delete('/api/company/:id', (req: Request, res: Response) => {
            this.company_controller.delete_company(req, res);
        });

    }
}