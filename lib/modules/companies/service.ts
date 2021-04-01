import { ICompany } from './model';
import companies from './schema';
import UserService from '../users/service'

export default class CompanyService {
    
private user_service: UserService = new UserService();

    public createCompany(company_params: ICompany, callback: any) {
        console.log("company params: "+company_params);
        const _session = new companies(company_params);
        _session.save(callback);
    }

    public filterCompany(query: any, callback: any) {
        companies.findOne(query, callback);
    }

    public updateCompany(company_params: ICompany, callback: any) {
        const query = { _id: company_params._id };
        companies.findOneAndUpdate(query, company_params, callback);
    }
    
    public deleteCompany(_id: String, callback: any) {
        const query = { _id: _id };
        companies.deleteOne(query, callback);
    }

}