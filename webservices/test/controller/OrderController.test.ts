///<reference path="../../../node_modules/@types/mocha/index.d.ts"/>
import {expect} from 'chai';
import {OrderController} from "../../app/controller/OrderController";
import {describe} from 'mocha';

describe('Order Controller', function () {
    describe('createOrder', function () {
        const mockRequest = {
            body: {
                "origin": [1.352083, 103.819839],
                "destination": [1.357748, 103.851018]
            }
        };

        describe('valid request object', function () {
            it('should return true', function () {
                const expected: boolean = true;
                let orderController: OrderController = new OrderController();
                const actual:boolean = orderController.validateCreateOrderRequest(mockRequest);
                expect(actual).to.equal(expected);
            });

            it('should return false for empty request object', function () {
                const expected: boolean = false;
                let orderController: OrderController = new OrderController();
                const actual:boolean = orderController.validateCreateOrderRequest({body: {}});
                expect(actual).to.equal(expected);
            });

            it('should return false for missing required keys origin', function () {
                const expected: boolean = false;
                let orderController: OrderController = new OrderController();
                const mockRequest = {
                    body: {
                        "destination": [1.357748, 103.851018]
                    }
                };

                const actual:boolean = orderController.validateCreateOrderRequest(mockRequest);
                expect(actual).to.equal(expected);
            });

            it('should return false for missing required keys destination', function () {
                const expected: boolean = false;
                let orderController: OrderController = new OrderController();
                const mockRequest = {
                    body: {
                        "origin": [1.352083, 103.819839]
                    }
                };

                const actual:boolean = orderController.validateCreateOrderRequest(mockRequest);
                expect(actual).to.equal(expected);
            });

            it('should return false for values not array', function () {
                const expected: boolean = false;
                let orderController: OrderController = new OrderController();
                const mockRequest = {
                    body: {
                        "origin": "mars",
                        "destination": "neptune"
                    }
                };

                const actual:boolean = orderController.validateCreateOrderRequest(mockRequest);
                expect(actual).to.equal(expected);
            });

            it('should return false for array values not typeof string', function () {
                const expected: boolean = false;
                let orderController: OrderController = new OrderController();
                const mockRequest = {
                    body: {
                        "origin": ["1.352083", 103.819839],
                        "destination": [1.357748, "103.851018"]
                    }
                };

                const actual:boolean = orderController.validateCreateOrderRequest(mockRequest);
                expect(actual).to.equal(expected);
            });
        });
    });

    describe('getOrderList', function () {
        const mockRequest = {
            query: {
                "page": 1,
                "limit": 1
            }
        };

        it('should return true', function () {
            const expected: boolean = true;
            let orderController: OrderController = new OrderController();
            const actual: boolean = orderController.validateGetOrdersRequest(mockRequest);
            expect(actual).to.equal(expected);
        });

        it('should return false when missing required keys', function () {
            const expected: boolean = false;
            let mockRequest = {
                query: {
                    "limit": 1
                }
            };

            let orderController: OrderController = new OrderController();
            const actual: boolean = orderController.validateGetOrdersRequest(mockRequest);
            expect(actual).to.equal(expected);
        });

        it('should return false when typeof is not number', function () {
            const expected: boolean = false;
            const mockRequest = {
                query: {
                    "page": "1",
                    "limit": "1"
                }
            };

            let orderController: OrderController = new OrderController();
            const actual: boolean = orderController.validateGetOrdersRequest(mockRequest);
            expect(actual).to.equal(expected);
        });
    });

    describe('updateOrder', function () {
        const mockRequest = {
            body: {
                "status": "TAKEN"
            }
        };

        it('should return true', function () {
            const expected: boolean = true;
            let orderController: OrderController = new OrderController();
            const actual: boolean = orderController.validateUpdateOrderRequest(mockRequest);
            expect(actual).to.equal(expected);
        });

        it('should return false when missing required keys', function () {
            const expected: boolean = false;
            const mockRequest = {
                body: {
                    "blah": "TAKEN"
                }
            };

            let orderController: OrderController = new OrderController();
            const actual: boolean = orderController.validateUpdateOrderRequest(mockRequest);
            expect(actual).to.equal(expected);
        });

        it('should return false when empty request body', function () {
            const expected: boolean = false;
            const mockRequest = {
                body: {}
            };

            let orderController: OrderController = new OrderController();
            const actual: boolean = orderController.validateUpdateOrderRequest(mockRequest);
            expect(actual).to.equal(expected);
        });

        it('should return false when empty request body value not string', function () {
            const expected: boolean = false;
            const mockRequest = {
                body: {
                    "status": 2
                }
            };

            let orderController: OrderController = new OrderController();
            const actual: boolean = orderController.validateUpdateOrderRequest(mockRequest);
            expect(actual).to.equal(expected);
        });
    });
});