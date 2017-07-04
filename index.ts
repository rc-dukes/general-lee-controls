import * as express from "express";
import Heartbeat from "./core/heartbeat";
import Routes from "./routes/routes";
import {Container} from "inversify";
import coreContainerModule from "./core/configuration";
import routesContainerModule from "./routes/configuration";

(() => {
    let container = new Container();
    container.load(coreContainerModule, routesContainerModule);

    const SERVER_PORT: number = 3001;
    const heartbeat: Heartbeat = container.get<Heartbeat>("heartbeat");
    const app = express();

    heartbeat.start();

    app.use('/', container.get<Routes>("routes").router);

    app.listen(SERVER_PORT, () => {
        console.log('General lee is listening on port', SERVER_PORT);
    });
})();