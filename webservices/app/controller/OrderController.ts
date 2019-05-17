import {Request, Response} from 'express';
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Order} from "../entity/Order";
import {DistanceCalculator} from "../helper/distanceCalculator";

const ERROR_DB_NOT_INITIALISED = "Database not ready. Please try again later.";
const ERROR_INVALID_REQUEST = "Invalid Request Parameters";
const ERROR_INVALID_REQUEST_ID = "Invalid Request ID";
const ERROR_ORDER_ALREADY_TAKEN = "Order Already Taken";
const SUCCESS_MESSAGE = "SUCCESS";
const RESPONSE_KEY_ERROR = "error";
const RESPONSE_KEY_SUCCESS = "status";
const STATE_UNASSIGNED = "UNASSIGNED";
const STATE_TAKEN = "TAKEN";

export class OrderController {
    public getOrderList(req: Request, res: Response) {
        if (!this.validateGetOrdersRequest(req)) {
            res.status(400).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_DB_NOT_INITIALISED))
        } else {
            createConnection().then(async connection => {
                let orderRepository = connection.getRepository(Order);
                const requestQuery = req.query;
                const pageNumber = requestQuery["page"];
                const requestedLimit = requestQuery["limit"];
                const endAt = pageNumber * requestedLimit;
                const startAt = endAt - requestedLimit;

                const orders = await orderRepository.find({take: endAt, skip: startAt});
                await connection.close();
                res.status(200).json(orders);
            }).catch(() => {
                res.status(503).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_DB_NOT_INITIALISED));
            });
        }
    }

    public createOrder(req: Request, res: Response) {
        if (!this.validateCreateOrderRequest(req)) {
            res.status(400).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_INVALID_REQUEST));
        } else {
            createConnection().then(async connection => {
                const order = new Order();
                order.status = STATE_UNASSIGNED;
                order.distance = DistanceCalculator.calculateDistance(req.body["origin"], req.body["destination"]);
                await connection.manager.save(order);
                await connection.close();
                res.status(200).json(OrderController.generateResponseObject(RESPONSE_KEY_SUCCESS, SUCCESS_MESSAGE));
            }).catch(() => {
                res.status(503).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_DB_NOT_INITIALISED));
            });
        }
    }

    public updateOrder(req: Request, res: Response) {
        if (!this.validateUpdateOrderRequest(req)) {
            res.status(400).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_INVALID_REQUEST));
        } else {
            createConnection().then(async connection => {
                const orderID:number = Number(req.params.id);
                let orderRepository = connection.getRepository(Order);
                const order: Order = await orderRepository.findOne(orderID);
                await connection.close();
                if (order == undefined) {
                    res.status(400).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_INVALID_REQUEST_ID));
                } else {
                    if (this.validateStateChange(order)) {
                        createConnection().then(async connection => {
                            order.status = STATE_TAKEN;
                            await connection.manager.save(order);
                            await connection.close();
                            res.status(200).json(OrderController.generateResponseObject(RESPONSE_KEY_SUCCESS, SUCCESS_MESSAGE));
                        }).catch((err) => {
                            console.log(err);
                            res.status(503).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_DB_NOT_INITIALISED));
                        });
                    } else {
                        res.status(500).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_ORDER_ALREADY_TAKEN));
                    }
                }
            }).catch((err) => {
                console.log(err);
                res.status(503).json(OrderController.generateResponseObject(RESPONSE_KEY_ERROR, ERROR_DB_NOT_INITIALISED));
            });
        }
    }

    public validateCreateOrderRequest(req): boolean {
        const requestBody:{} = req.body;
        if (requestBody.hasOwnProperty("origin") && requestBody.hasOwnProperty("destination")) {
            if (Array.isArray(requestBody["origin"]) &&
                Array.isArray(requestBody["destination"])) {
                const originReq: any[] = requestBody["origin"];
                const destinationReq: any[] = requestBody["destination"];

                if ((originReq.length == 2) && (destinationReq.length == 2)) {
                    if (this.validateArrayOfNumbers(originReq) && this.validateArrayOfNumbers(destinationReq)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public validateArrayOfNumbers(arr: any[]): boolean {
        let somethingNotNumber: boolean = false;
        arr.forEach(function (val) {
            if (typeof val !== 'number') {
                somethingNotNumber = true;
            }
        });

        return !somethingNotNumber;
    }

    public validateGetOrdersRequest(req): boolean {
        const requestQuery = req.query;
        if (requestQuery.hasOwnProperty("page") && requestQuery.hasOwnProperty("limit")) {
            if (typeof requestQuery["page"] == 'number' && typeof requestQuery["limit"] == 'number') {
                return true;
            }
        }

        return false;
    }

    public validateUpdateOrderRequest(req): boolean {
        const requestBody = req.body;
        if (requestBody.hasOwnProperty("status")) {
            if (typeof requestBody["status"] == 'string') {
                return true;
            }
        }

        return false;
    }

    public validateStateChange(order: Order): boolean {
        return order.status == STATE_UNASSIGNED;
    }

    public static generateResponseObject(key: string, message: string): {} {
        return {
            [key]: message
        }
    }
}
