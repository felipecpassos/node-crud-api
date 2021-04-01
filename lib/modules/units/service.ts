import { IUnit } from './model';
import units from './schema';

export default class UnitService {
    
    public createUnit(unit_params: IUnit, callback: any) {
        const _session = new units(unit_params);
        _session.save(callback);
    }

    public filterUnit(query: any, callback: any) {
        units.findOne(query, callback);
    }

    public updateUnit(unit_params: IUnit, callback: any) {
        const query = { _id: unit_params._id };
        units.findOneAndUpdate(query, unit_params, callback);
    }
    
    public deleteUnit(_id: String, callback: any) {
        const query = { _id: _id };
        units.deleteOne(query, callback);
    }

}