import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IUnit } from '../modules/units/model';
import UnitService from '../modules/units/service';
import { ICompany } from '../modules/companies/model';
import CompanyService from '../modules/companies/service';
import e = require('express');

export class UnitController {

    private unit_service: UnitService = new UnitService();
    private company_service: CompanyService = new CompanyService();

    public create_unit(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.unit_name &&
            req.body.owner_company && 
            req.body.contact_email &&
            req.body.phone_number){
            const unit_params: IUnit = {
                unit_name: req.body.unit_name,
                owner_company: req.body.owner_company,
                contact_email: req.body.contact_email,
                phone_number: req.body.phone_number,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New unit created'
                }]
            };
            this.unit_service.createUnit(unit_params, (err: any, unit_data: IUnit) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    //TODO ADD UNIT ID TO COMPANY DOCUMENT
                    this.company_service.filterCompany({_id: req.body.owner_company}, (err: any, company_data: ICompany) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            // successResponse('get company successfull', company_data, res);
                            console.log("get company : "+company_data);
                            var mongoose = require('mongoose');
                            var unitObjectId = mongoose.Types.ObjectId(unit_data._id);
                            company_data.business_units.push(unitObjectId);
                            this.company_service.updateCompany(company_data, (err: any) => {
                                if (err) {
                                    mongoError(err, res);
                                } else {
                                    // successResponse('update company successfull', null, res);
                                    successResponse('create unit successfull', unit_data, res);
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

    public get_unit(req: Request, res: Response) {
        if (req.params.id) {
            const unit_filter = { _id: req.params.id };
            this.unit_service.filterUnit(unit_filter, (err: any, unit_data: IUnit) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    console.log("get unit : "+unit_data);
                    successResponse('get unit successfull', unit_data, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    // public get_all_units_from_user(req: Request, res: Response) {
    //         this.unit_service.getAllUnitsFromCompany(req.params.company_id, (err: any, unit_data: [IUnit]) => {
    //             if (err) {
    //                 mongoError(err, res);
    //             } else {
    //                 successResponse('get unit successfull', unit_data, res);
    //             }
    //         });
    // }

    public update_unit(req: Request, res: Response) {
        if (req.params.id &&
            req.body.unit_name ||
            req.body.owner_company || 
            req.body.contact_email ||
            req.body.phone_number) {
            const unit_filter = { _id: req.params.id };
            this.unit_service.filterUnit(unit_filter, (err: any, unit_data: IUnit) => {
                if (err) {
                    mongoError(err, res);
                } else if (unit_data) {
                    unit_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'Unit data updated'
                    });
                    const unit_params: IUnit = {
                        _id: req.params.id,
                        unit_name: req.body.unit_name,
                        owner_company: req.body.owner_company,
                        contact_email: req.body.contact_email,
                        phone_number: req.body.phone_number,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : unit_data.is_deleted,
                        modification_notes: unit_data.modification_notes
                    };
                    this.unit_service.updateUnit(unit_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update unit successfull', null, res);
                        }
                    });
                } else {
                    failureResponse('invalid unit', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public delete_unit(req: Request, res: Response) {
        if (req.params.id) {
            this.unit_service.filterUnit({_id: req.params.id}, (err: any, unit_data: IUnit) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    console.log("get unit : "+unit_data);
                    this.company_service.filterCompany({_id: unit_data.owner_company}, (err: any, company_data: ICompany) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            // successResponse('get company successfull', company_data, res);
                            console.log("get company : "+[company_data.business_units]);
                            //REMOVE COMPANY FROM COMPANIES ARRAY ON USER OBJECT
                            for (let i = 0; i < company_data.business_units.length; i++){
                                const unit = company_data.business_units[i];
                                if (unit.toString() === req.params.id){
                                    company_data.business_units.splice(i--, 1);
                                }
                            }
                            console.log("Deleted unit from company unit array: "+[company_data.business_units]);
                            this.company_service.updateCompany(company_data, (err: any) => {
                                if (err) {
                                    mongoError(err, res);
                                } else {
                                    // successResponse('update company successfull', null, res);
                                    //Finally, delete the company itself
                                    this.unit_service.deleteUnit(req.params.id, (err: any, delete_details) => {
                                        if (err) {
                                            mongoError(err, res);
                                        } else if (delete_details.deletedCount !== 0) {
                                            successResponse('delete unit successfull', null, res);
                                        } else {
                                            failureResponse('invalid unit', null, res);
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