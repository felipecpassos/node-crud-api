import { IAsset } from './model';
import assets from './schema';

export default class AssetService {
    
    public createAsset(asset_params: IAsset, callback: any) {
        const _session = new assets(asset_params);
        _session.save(callback);
    }

    public filterAsset(query: any, callback: any) {
        assets.findOne(query, callback);
    }

    public updateAsset(asset_params: IAsset, callback: any) {
        const query = { _id: asset_params._id };
        assets.findOneAndUpdate(query, asset_params, callback);
    }
    
    public deleteAsset(_id: String, callback: any) {
        const query = { _id: _id };
        assets.deleteOne(query, callback);
    }

}