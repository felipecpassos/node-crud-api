import { Request, Response } from 'express';
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IAsset } from '../modules/assets/model';
import AssetService from '../modules/assets/service';
import { IUnit } from '../modules/units/model';
import UnitService from '../modules/units/service';
import { IUser } from '../modules/users/model'
import UserService from '../modules/users/service'
import e = require('express');

export class AssetController {
    
    private asset_service: AssetService = new AssetService();
    private unit_service: UnitService = new UnitService();
    private user_service: UserService = new UserService();
    
    public create_asset(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (req.body.name &&
            req.body.description && 
            req.body.model &&
            req.body.unit &&
            req.body.responsable){
            const asset_params: IAsset = {
                name: req.body.name,
                description: req.body.description,
                model: req.body.model,
                unit: req.body.unit,
                responsable: req.body.responsable,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New asset created'
                }]
            };
            //CHECK IF RESPONSABLE EXISTS
            const user_filter = { _id: req.body.responsable };
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                }
                else{
                    if (user_data === null){
                        failureResponse("User does not exist", null, res);
                    }else{
                        //CHECK IF UNIT EXISTS
                        const unit_filter = { _id: req.body.unit };
                        this.unit_service.filterUnit(unit_filter, (err: any, unit_data: IUser) => {
                            if (err) {
                                mongoError(err, res);
                            }
                            else{
                                if (unit_data === null){
                                    failureResponse("Unit does not exist", null, res);
                                }
                                else{
                                    //UNIT AND RESPOSABLE EXISTS, NOW THE TASK ITSELF
                                    this.asset_service.createAsset(asset_params, (err: any, asset_data: IAsset) => {
                                        if (err) {
                                            mongoError(err, res);
                                        } else {
                                            //ADD ASSET ID TO UNIT DOCUMENT
                                            this.unit_service.filterUnit( {_id: asset_data.unit}, (err: any, unit_data: IUnit) => {
                                                if (err) {
                                                    mongoError(err, res);
                                                } else {
                                                    // successResponse('get unit successfull', unit_data, res);
                                                    if(unit_data === null)
                                                        mongoError(err, res);
                                                    var mongoose = require('mongoose');
                                                    var assetObjectId = mongoose.Types.ObjectId(asset_data._id);
                                                    unit_data.assets.push(assetObjectId);
                                                    this.unit_service.updateUnit(unit_data, (err: any) => {
                                                        if (err) {
                                                            mongoError(err, res);
                                                        } else {
                                                            //ADDED ASSET ON UNIT DOCUMENT
                                                            // successResponse('create asset successfull', asset_data, res);
                                                            //TODO ADD ASSET ON USER DOCUMENT
                                                            this.user_service.filterUser({_id: req.body.responsable}, (err: any, user_data: IUser) => {
                                                                if (err) {
                                                                    mongoError(err, res);
                                                                } else {
                                                                    // console.log("get user : "+user_data);
                                                                    // successResponse('get user successfull', user_data, res);
                                                                    var assetObjectId2 = mongoose.Types.ObjectId(asset_data._id);
                                                                    user_data.assets_responsable.push(assetObjectId2);
                                                                    this.user_service.updateUser(user_data, (err: any) => {
                                                                        if (err) {
                                                                            mongoError(err, res);
                                                                        } else {
                                                                            //ADDED ASSET ON UNIT DOCUMENT
                                                                            // successResponse('update user successfull', null, res);
                                                                            successResponse('create asset successfull', asset_data, res);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
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
            req.body.name ||
            req.body.description ||
            req.body.model ||
            req.body.unit ||
            req.body.responsable||
            req.body.health) {
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

                    //setting status
                    asset_data

                    const asset_params: IAsset = {
                        _id: req.params.id,
                        name: req.body.name,
                        description: req.body.description,
                        model: req.body.model,
                        unit: req.body.unit,
                        responsable: req.body.responsable,
                        health: req.body.health,

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
                    if(asset_data === null){
                        failureResponse('invalid asset', null, res);
                    }
                    else{
                        // GOT THE ASSET, NOW REMOVE ASSET FROM ASSETS ARRAY ON UNIT OBJECT
                        this.unit_service.filterUnit({_id: asset_data.unit}, (err: any, unit_data: IUnit) => {
                            if (err) {
                                mongoError(err, res);
                            } else {
                                // successResponse('get unit successfull', unit_data, res);
                                for (let i = 0; i < unit_data.assets.length; i++){
                                    const asset = unit_data.assets[i];
                                    if (asset.toString() === req.params.id){
                                        unit_data.assets.splice(i--, 1);
                                    }
                                }
                                console.log("Deleted asset from unit asset array: "+[unit_data.assets]);
                                this.unit_service.updateUnit(unit_data, (err: any) => {
                                    if (err) {
                                        mongoError(err, res);
                                    } else {
                                        // successResponse('update unit successfull', null, res);
                                        // NOW REMOVE ASSET FROM ASSETS ARRAY ON USER OBJECT
                                        this.user_service.filterUser({_id: asset_data.responsable}, (err: any, user_data: IUser) => {
                                            if (err) {
                                                mongoError(err, res);
                                            } else {
                                                // successResponse('get user successfull', user_data, res);
                                                for (let i = 0; i < user_data.assets_responsable.length; i++){
                                                    const asset = user_data.assets_responsable[i];
                                                    if (asset.toString() === req.params.id){
                                                        user_data.assets_responsable.splice(i--, 1);
                                                    }
                                                }
                                                this.user_service.updateUser(user_data, (err: any) => {
                                                    if (err) {
                                                        mongoError(err, res);
                                                    } else {
                                                        // successResponse('update user successfull', null, res);
                                                        // Finally, delete the unit itself
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
                            }
                        });
                    }
                }
            });
        } else {
            insufficientParameters(res);
        }
    }
}