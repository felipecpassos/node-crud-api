import { Application, Request, Response } from 'express';
import { AssetController } from '../controllers/assetController';

export class AssetRoutes {

    private asset_controller: AssetController = new AssetController();

    public route(app: Application) {
        
        app.post('/api/asset', (req: Request, res: Response) => {
            this.asset_controller.create_asset(req, res);
        });

        app.get('/api/asset/:id', (req: Request, res: Response) => {
            this.asset_controller.get_asset(req, res);
        });
        
        // app.get('/api/asset', (req: Request, res: Response) => {
        //     this.asset_controller.get_all_assets(req, res);
        // })

        app.put('/api/asset/:id', (req: Request, res: Response) => {
            this.asset_controller.update_asset(req, res);
        });

        app.delete('/api/asset/:id', (req: Request, res: Response) => {
            this.asset_controller.delete_asset(req, res);
        });

    }
}