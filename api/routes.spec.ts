import * as sinon from 'sinon';
import * as express from 'express';
import Routes from './routes';
import HeartbeatRouter from './heartbeat';
import WheelsRouter from './wheels';
import EngineRouter from './engine';
import {Container} from 'inversify';

describe('Routes', () => {
    let routes: Routes;
    let heartbeatRouter: HeartbeatRouter;
    let wheelsRouter: WheelsRouter;
    let engineRouter: EngineRouter;

    let heartbeatRouterRouter: express.Router;
    let engineRouterRouter: express.Router;
    let wheelsRouterRouter: express.Router;

    let routerUseFn: sinon.SinonStub;
    let router: any;
    let routerFn: sinon.SinonStub;

    // The route callbacks
    let uses: { [endpoint: string]: Function };

    beforeEach(() => {
        heartbeatRouter = sinon.createStubInstance(HeartbeatRouter);
        heartbeatRouterRouter = sinon.createStubInstance(express.Router);
        heartbeatRouter.router = heartbeatRouterRouter;
        engineRouter = sinon.createStubInstance(EngineRouter);
        engineRouterRouter = sinon.createStubInstance(express.Router);
        engineRouter.router = engineRouterRouter;
        wheelsRouter = sinon.createStubInstance(WheelsRouter);
        wheelsRouterRouter = sinon.createStubInstance(express.Router);
        wheelsRouter.router = wheelsRouterRouter;

        routerUseFn = sinon.stub();
        router = {use: routerUseFn};
        routerFn = sinon.stub(express, 'Router').callsFake(() => {
            return router;
        });

        uses = {};

        routerUseFn.callsFake((endpoint: string, fn: Function) => {
            uses[endpoint] = fn;
        });

        const container = new Container();
        container.bind<HeartbeatRouter>('heartbeatRouter').toConstantValue(heartbeatRouter);
        container.bind<EngineRouter>('engineRouter').toConstantValue(engineRouter);
        container.bind<WheelsRouter>('wheelsRouter').toConstantValue(wheelsRouter);
        container.bind<Routes>('routes').to(Routes);

        routes = container.get<Routes>('routes');
    });

    describe('constructor', () => {
        it('creates a new router', () =>
            sinon.assert.calledOnce(routerFn));

        it('registers the heartbeat routes', () =>
            sinon.assert.calledWith(routerUseFn, '/heartbeat', sinon.match(() => true)));

        it('registers the engine routes', () =>
            sinon.assert.calledWith(routerUseFn, '/engine', sinon.match(() => true)));

        it('registers the wheels routes', () =>
            sinon.assert.calledWith(routerUseFn, '/wheels', sinon.match(() => true)));

        afterEach(() => {
            routerFn.restore();
            routerUseFn.reset();
        });
    });

    describe('actions', () => {
        it('heartbeat', () => {
            expect(uses['/heartbeat']).toBe(heartbeatRouterRouter);
        });
        //
        it('engine', () => {
            expect(uses['/engine']).toEqual(engineRouterRouter);
        });

        it('wheels', () => {
            expect(uses['/wheels']).toEqual(wheelsRouterRouter);
        });

        afterEach(() => {
            routerFn.restore();
        });

    });
});
