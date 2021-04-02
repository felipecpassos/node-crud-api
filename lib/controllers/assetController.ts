import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IAsset } from '../modules/assets/model';
import AssetService from '../modules/assets/service';
import { IUnit } from '../modules/units/model';
import UnitService from '../modules/units/service';
import e = require('express');

export class AssetController {

    private asset_service: AssetService = new AssetService();
    private unit_service: UnitService = new UnitService();

    public create_asset(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.name &&
            req.body.description && 
            req.body.unit &&
            req.body.responsable){
            const asset_params: IAsset = {
                name: req.body.name,
                description: req.body.description,
                unit: req.body.unit,
                responsable: req.body.responsable,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New asset created'
                }]
            };
            this.asset_service.createAsset(asset_params, (err: any, asset_data: IAsset) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    //TODO ADD UNIT ID TO COMPANY DOCUMENT
                    this.unit_service.filterUnit({_id: req.body.unit}, (err: any, unit_data: IUnit) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            // successResponse('get unit successfull', unit_data, res);
                            console.log("get unit : "+unit_data);
                            var mongoose = require('mongoose');
                            var assetObjectId = mongoose.Types.ObjectId(asset_data._id);
                            unit_data.assets.push(assetObjectId);
                            this.unit_service.updateUnit(unit_data, (err: any) => {
                                if (err) {
                                    mongoError(err, res);
                                } else {
                                    // successResponse('update unit successfull', null, res);
                                    successResponse('create asset successfull', asset_data, res);
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

    public get_asset(req: Request, res: Response) {
        if (req.params.id) {
            const asset_filter = { _id: req.params.id };
            this.asset_service.filterAsset(asset_filter, (err: any, asset_data: IAsset) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    console.log("get asset : "+asset_data);
                    successResponse('get asset successfull', asset_data, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    // public get_all_assets_from_user(req: Request, res: Response) {
    //         this.asset_service.getAllAssetsFromUnit(req.params.unit_id, (err: any, asset_data: [IAsset]) => {
    //             if (err) {
    //                 mongoError(err, res);
    //             } else {
    //                 successResponse('get asset successfull', asset_data, res);
    //             }
    //         });
    // }

    public update_asset(req: Request, res: Response) {
        if (req.params.id &&
            req.body.asset_name ||
            req.body.owner_unit || 
            req.body.contact_email ||
            req.body.phone_number) {
            const asset_filter = { _id: req.params.id };
            this.asset_service.filterAsset(asset_filter, (err: any, asset_data: IAsset) => {
                if (err) {
                    mongoError(err, res);
                } else if (asset_data) {
                    asset_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'Asset data updated'
                    });
                    const asset_params: IAsset = {
                        _id: req.params.id,
                        name: req.body.name,
                        description: req.body.description,
                        unit: req.body.unit,
                        responsable: req.body.responsable,
                        modification_notes: asset_data.modification_notes
                    };
                    this.asset_service.updateAsset(asset_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update asset successfull', null, res);
                        }
                    });
                } else {
                    failureResponse('invalid asset', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public delete_asset(req: Request, res: Response) {
        if (req.params.id) {
            this.asset_service.filterAsset({_id: req.params.id}, (err: any, asset_data: IAsset) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    console.log("get asset : "+asset_data);
                    this.unit_service.filterUnit({_id: asset_data.owner_unit}, (err: any, unit_data: IUnit) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            // successResponse('get unit successfull', unit_data, res);
                            console.log("get unit : "+[unit_data.business_assets]);
                            //REMOVE COMPANY FROM COMPANIES ARRAY ON USER OBJECT
                            for (let i = 0; i < unit_data.business_assets.length; i++){
                                const asset = unit_data.business_assets[i];
                                if (asset.toString() === req.params.id){
                                    unit_data.business_assets.splice(i--, 1);
                                }
                            }
                            console.log("Deleted asset from unit asset array: "+[unit_data.business_assets]);
                            this.unit_service.updateUnit(unit_data, (err: any) => {
                                if (err) {
                                    mongoError(err, res);
                                } else {
                                    // successResponse('update unit successfull', null, res);
                                    //Finally, delete the unit itself
                                    this.asset_service.deleteAsset(req.params.id, (err: any, delete_details) => {
                                        if (err) {
                                            mongoError(err, res);
                                        } else if (delete_details.deletedCount !== 0) {
                                            successResponse('delete asset successfull', null, res);
                                        } else {
                                            failureResponse('invalid asset', null, res);
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