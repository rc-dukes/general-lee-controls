import * as sinon from 'sinon';
import * as express from 'express';
import HeartbeatRouter from './heartbeat';
import GeneralLee from '../core/system/generalLee';
import Heartbeat from '../core/heartbeat';
import {Container} from 'inversify';

describe('HeartbeatRouter', () => {
    let heartbeatRouter: HeartbeatRouter;
    let generalLee: GeneralLee;
    let heartbeat: Heartbeat;
    let generalLeeIsRunningFn: sinon.SinonStub;
    let generalLeeStartupFn: sinon.SinonStub;

    let responseStatusFn: sinon.SinonStub;
    let responseEndFn: sinon.SinonStub;

    const request: any = {};
    let response: any;

    let routerGetFn: sinon.SinonStub;
    let router: any;
    let routerFn: sinon.SinonStub;

    // The route callbacks
    let routes: { [endpoint: string]: Function };

    beforeEach(() => {
        generalLee = sinon.createStubInstance(GeneralLee);
        generalLeeIsRunningFn = sinon.stub();
        generalLeeStartupFn = sinon.stub();
        generalLee.isRunning = generalLeeIsRunningFn;
        generalLee.startup = generalLeeStartupFn;

        heartbeat = sinon.createStubInstance(Heartbeat);

        responseStatusFn = sinon.stub();
        responseEndFn = sinon.stub();
        routerGetFn = sinon.stub();

        routes = {};

        routerGetFn.callsFake((endpoint: string, fn: Function) => {
            routes[endpoint] = fn;
        });

        response = {
            status: responseStatusFn,
            end: responseEndFn
        };
        router = {get: routerGetFn};
        routerFn = sinon.stub(express, 'Router').callsFake(() => {
            return router;
        });

        const container = new Container();
        container.bind<GeneralLee>('generalLee').toConstantValue(generalLee);
        container.bind<Heartbeat>('heartbeat').toConstantValue(heartbeat);
        container.bind<HeartbeatRouter>('heartbeatRouter').to(HeartbeatRouter);

        heartbeatRouter = container.get<HeartbeatRouter>('heartbeatRouter');
    });

    describe('constructor', () => {
        it('creates a new router', () =>
            sinon.assert.calledOnce(routerFn));

        it('registers the heartbeat action', () =>
            sinon.assert.calledWith(routerGetFn, '/', sinon.match(() => true)));

        afterEach(() => {
            routerFn.restore();
            routerGetFn.reset();
        });
    });

    describe('routes', () => {
        it('gets the created router', () =>
            expect(heartbeatRouter.router).toBe(router));

        afterEach(() => {
            routerFn.restore();
            routerGetFn.reset();
        });
    });

    describe('actions', () => {
        describe('while general lee is running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(true);
                routes['/'](request, response);
            });

            it('sets the last beat', () => {
               expect(heartbeat.last).toBeDefined();
            });

            it('does not startup general lee', () => {
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeStartupFn, 0);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            afterEach(() => {
                routerFn.restore();
                routerGetFn.reset();
                responseStatusFn.reset();
                responseEndFn.reset();
                generalLeeIsRunningFn.reset();
                generalLeeStartupFn.reset();
            });
        });

        describe('while general lee is not running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(false);
                routes['/'](request, response);
            });

            it('sets the last beat', () => {
                expect(heartbeat.last).toBeDefined();
            });

            it('startup general lee', () => {
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeStartupFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            afterEach(() => {
                routerFn.restore();
                routerGetFn.reset();
                responseStatusFn.reset();
                responseEndFn.reset();
                generalLeeIsRunningFn.reset();
                generalLeeStartupFn.reset();
            });
        });
    });
});
