import {OrderController} from "../controller/OrderController";

export class wsRoutes {
    static readonly ORDER_MODULE = '/orders';
    public orderController: OrderController = new OrderController();

    public routes(app): void {
        const that = this;

        app.route(wsRoutes.ORDER_MODULE + '/').post(function (req, res) {
            that.orderController.createOrder(req, res);
        });

        app.route(wsRoutes.ORDER_MODULE + '/').get(function (req, res) {
            that.orderController.getOrderList(req, res);
        });

        app.route(wsRoutes.ORDER_MODULE + '/:id').patch(function (req, res) {
            that.orderController.updateOrder(req, res);
        });
    }
}
