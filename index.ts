import * as express from 'express';
import Heartbeat from './core/heartbeat';
import Routes from './api/routes';
import {Container} from 'inversify';
import coreContainerModule from './core/configuration';
import routesContainerModule from './api/configuration';

(() => {
    const container = new Container();
    container.load(coreContainerModule, routesContainerModule);

    const SERVER_PORT = 3001;
    const heartbeat: Heartbeat = container.get<Heartbeat>('heartbeat');
    const app = express();

    heartbeat.start();

    app.use('/', container.get<Routes>('routes').router);
    app.use(express.static('node_modules/jquery/dist'));
    app.use(express.static('node_modules/requirejs'));
    app.use(express.static('interface'));

    app.listen(SERVER_PORT, () => {
        console.log('General lee is listening on port', SERVER_PORT);
    });
})();
