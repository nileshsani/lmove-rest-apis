export class wsRoutes {
    static readonly TEST_MODULE = '/test';

    public routes(app): void {
        app.route(wsRoutes.TEST_MODULE + '/').get(function (req, res) {
            res.status(200).json("test request")
        })
    }
}
