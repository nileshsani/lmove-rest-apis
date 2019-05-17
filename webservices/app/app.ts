import * as express from 'express';
import {wsRoutes} from "./route/wsRoutes";

class App {

    public app: express.Application;
    public wsRoutes: wsRoutes = new wsRoutes();

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.wsRoutes.routes(this.app);
    }
}

export default new App().app;