import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { ICompany } from '../modules/companies/model';
import CompanyService from '../modules/companies/service';
import { IUser } from '../modules/users/model';
import UserService from '../modules/users/service';
import e = require('express');

export class CompanyController {

    private company_service: CompanyService = new CompanyService();
    private user_service: UserService = new UserService();

    public create_company(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.name && 
                req.body.owner &&
                req.body.company_email &&
                req.body.phone_number) {
            
            const company_params: ICompany = {
                name: req.body.name,
                owner: req.body.owner,
                company_email: req.body.company_email,
                phone_number: req.body.phone_number,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: req.body.owner,
                    modification_note: 'New company created'
                }]
            };
            this.company_service.createCompany(company_params, (err: any, company_data: ICompany) => {
                if (err) {
                    console.log("teste 0");
                    mongoError(err, res);
                } else {
                    //ADDING COMPANY TO OWNER USER
                    var mongoose = require('mongoose');
                    const user_filter = { _id: req.body.owner };
                    this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            var userObjectId = mongoose.Types.ObjectId(company_data._id);
                            user_data.companies.push(userObjectId);
                            this.user_service.updateUser(user_data, (err: any) => {
                                if (err) {
                                    mongoError(err, res);
                                } else {
                                    successResponse('create company successfull', company_data, res);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            // error response if some fields are missing in request body
            insufficientParameters(res);
        }
    }

    public get_company(req: Request, res: Response) {
        if (req.params.id) {
            const company_filter = { _id: req.params.id };
            this.company_service.filterCompany(company_filter, (err: any, company_data: ICompany) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('get company successfull', company_data, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public update_company(req: Request, res: Response) {
        if (req.params.id &&
            req.body.name ||
            req.body.owner ||
            req.body.company_email ||
            req.body.phone_number) {
            const company_filter = { _id: req.params.id };
            this.company_service.filterCompany(company_filter, (err: any, company_data: ICompany) => {
                if (err) {
                    mongoError(err, res);
                } else if (company_data) {
                    company_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'Company data updated'
                    });
                    const company_params: ICompany = {
                        _id: req.params.id,
                        name: req.body.name ? req.body.name : company_data.name,
                        owner: req.body.owner? req.body.owner : company_data.owner,
                        company_email: req.body.company_email ? req.body.company_email : company_data.company_email,
                        phone_number: req.body.phone_number ? req.body.phone_number : company_data.phone_number,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : company_data.is_deleted,
                        modification_notes: company_data.modification_notes
                    };
                    this.company_service.updateCompany(company_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update company successfull', null, res);
                        }
                    });
                } else {
                    failureResponse('invalid company', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public delete_company(req: Request, res: Response) {
        if (req.params.id) {
            //TODO DELETE COMPANY FROM USER FIRST
            this.company_service.filterCompany({_id: req.params.id}, (err: any, company_data: ICompany) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    console.log("get company : "+company_data);
                    this.user_service.filterUser({_id: company_data.owner}, (err: any, user_data: IUser) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            // successResponse('get user successfull', user_data, res);
                            console.log("get user : "+[user_data.companies]);
                            //REMOVE COMPANY FROM COMPANIES ARRAY ON USER OBJECT
                            for (let i = 0; i < user_data.companies.length; i++){
                                const company = user_data.companies[i];
                                if (company.toString() === req.params.id){
                                    console.log("bora poha");
                                    user_data.companies.splice(i--, 1);
                                }
                            }
                            console.log("Deleted company from user company array: "+[user_data.companies]);
                            this.user_service.updateUser(user_data, (err: any) => {
                                if (err) {
                                    mongoError(err, res);
                                } else {
                                    // successResponse('update user successfull', null, res);
                                    //Finally, delete the company itself
                                    this.company_service.deleteCompany(req.params.id, (err: any, delete_details) => {
                                        if (err) {
                                            mongoError(err, res);
                                        } else if (delete_details.deletedCount !== 0) {
                                            successResponse('delete company successfull', null, res);
                                        } else {
                                            failureResponse('invalid company', null, res);
                                        }
                                    });
                                    
                                }
                            });
                            
                            
                        }
                    });
                }
            });
        } else {
            insufficientParameters(res);
        }
        
    }
}