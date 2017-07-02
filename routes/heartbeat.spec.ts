import * as sinon from "sinon";
import * as express from "express";
import {HeartbeatRouter} from "./heartbeat";
import {GeneralLee} from "../core/system/generalLee";
import {Heartbeat} from "../core/heartbeat";

describe('HeartbeatRouter', () => {
    let heartbeatRouter: HeartbeatRouter;
    let generalLee: GeneralLee;
    let heartbeat: Heartbeat;

    let routerGetFn: sinon.SinonStub;
    let router: any;
    let routerFn: sinon.SinonStub;

    beforeEach(() => {
        generalLee = sinon.createStubInstance(GeneralLee);
        heartbeat = sinon.createStubInstance(Heartbeat);

        routerGetFn = sinon.stub();
        router = {get: routerGetFn};
        routerFn = sinon.stub(express, 'Router').callsFake(() => {
            return router;
        });
    });

    describe('constructor', () => {
        beforeEach(() => {
            heartbeatRouter = new HeartbeatRouter(generalLee, heartbeat);
        });
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
        beforeEach(() => {
            heartbeatRouter = new HeartbeatRouter(generalLee, heartbeat);
        });
        it('gets the created router', () =>
            expect(heartbeatRouter.routes()).toBe(router));

        afterEach(() => {
            routerFn.restore();
            routerGetFn.reset();
        });
    });

    describe('actions', () => {
        let generalLeeIsRunningFn: sinon.SinonStub;
        let generalLeeStartupFn: sinon.SinonStub;

        let responseStatusFn: sinon.SinonStub;
        let responseEndFn: sinon.SinonStub;
        // The route callbacks
        let routes: { [endpoint: string]: Function };

        let request: any = {};
        let response: any;

        beforeEach(() => {
            generalLee.isRunning = generalLeeIsRunningFn = sinon.stub();
            generalLee.startup = generalLeeStartupFn = sinon.stub();

            responseStatusFn = sinon.stub();
            responseEndFn = sinon.stub();

            routes = {};

            routerGetFn.callsFake((endpoint: string, fn: Function) => {
                routes[endpoint] = fn;
            });

            response = {
                status: responseStatusFn,
                end: responseEndFn
            };

            heartbeatRouter = new HeartbeatRouter(generalLee, heartbeat);
        });

        describe('while general lee is running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(true);
            });

            it('does not startup general lee', () => {
                routes['/'](request, response);
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
            });

            it('startup general lee', () => {
                routes['/'](request, response);
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