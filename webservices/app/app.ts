import * as express from 'express';
import {wsRoutes} from "./routes/wsRoutes";

class App {

    public app: express.Application;
    public wsRoutes: wsRoutes = new wsRoutes();

    constructor() {
        this.app = express();
        this.wsRoutes.routes(this.app);
    }
}

export default new App().app;