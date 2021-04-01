import { Application, Request, Response } from 'express';
import { UnitController } from '../controllers/unitController';

export class UnitRoutes {

    private unit_controller: UnitController = new UnitController();

    public route(app: Application) {
        
        app.post('/api/unit', (req: Request, res: Response) => {
            this.unit_controller.create_unit(req, res);
        });

        app.get('/api/unit/:id', (req: Request, res: Response) => {
            this.unit_controller.get_unit(req, res);
        });
        
        // app.get('/api/unit', (req: Request, res: Response) => {
        //     this.unit_controller.get_all_units(req, res);
        // })

        app.put('/api/unit/:id', (req: Request, res: Response) => {
            this.unit_controller.update_unit(req, res);
        });

        app.delete('/api/unit/:id', (req: Request, res: Response) => {
            this.unit_controller.delete_unit(req, res);
        });

    }
}