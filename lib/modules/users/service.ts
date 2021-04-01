import { mongoError } from 'modules/common/service';
import { IUser } from './model';
import users from './schema';

export default class UserService {
    
    public createUser(user_params: IUser, callback: any) {
        const _session = new users(user_params);
        _session.save(callback);
    }

    public filterUser(query: any, callback: any) {
        users.findOne(query, callback);
    }

    public getAllUsers(callback: any) {
        users.find(callback);
    }

    public updateUser(user_params: IUser, callback: any) {
        const query = { _id: user_params._id };
        users.findOneAndUpdate(query, user_params, callback);
    }
    
    public deleteUser(_id: String, callback: any) {
        const query = { _id: _id };
        users.deleteOne(query, callback);
    }

    // public addCompany(_owner: String, callback: any){
    //     this.filterUser(_owner_id, (err: any, user_data: IUser) => {
    //         if (err) {
    //             mongoError(err, res);
    //         } else {
    //             successResponse('get user successfull', user_data, res);
    //         }
    //     });
    // }

}