import * as sinon from "sinon";
import * as express from "express";
import {EngineRouter} from "./engine";
import {GeneralLee} from "../core/system/generalLee";
import {Wheels} from "../core/system/wheels";

describe('EngineRouter', () => {
    let engineRouter: EngineRouter;
    let generalLee: GeneralLee;

    let routerPostFn: sinon.SinonStub;
    let router: any;
    let routerFn: sinon.SinonStub;

    beforeEach(() => {
        generalLee = sinon.createStubInstance(GeneralLee);

        routerPostFn = sinon.stub();
        router = {post: routerPostFn};
        routerFn = sinon.stub(express, 'Router').callsFake(() => {
            return router;
        });
    });

    describe('constructor', () => {
        beforeEach(() => {
            engineRouter = new EngineRouter(generalLee);
        });
        it('creates a new router', () =>
            sinon.assert.calledOnce(routerFn));

        it('registers the increase speed action', () =>
            sinon.assert.calledWith(routerPostFn, '/increase-speed', sinon.match(() => true)));

        it('registers the decrease speed action', () =>
            sinon.assert.calledWith(routerPostFn, '/decrease-speed', sinon.match(() => true)));

        it('registers the break action', () =>
            sinon.assert.calledWith(routerPostFn, '/break', sinon.match(() => true)));

        afterEach(() => {
            routerFn.restore();
            routerPostFn.reset();
        });
    });

    describe('routes', () => {
        beforeEach(() => {
            engineRouter = new EngineRouter(generalLee);
        });
        it('gets the created router', () =>
            expect(engineRouter.routes()).toBe(router));

        afterEach(() => {
            routerFn.restore();
            routerPostFn.reset();
        });
    });

    describe('actions', () => {
        let generalLeeIsRunningFn: sinon.SinonStub;
        let generalLeeEngineIncreaseSpeedFn: sinon.SinonStub;
        let generalLeeEngineDecreaseSpeedFn: sinon.SinonStub;
        let generalLeeEngineBreakFn: sinon.SinonStub;

        let responseStatusFn: sinon.SinonStub;
        let responseEndFn: sinon.SinonStub;
        // The route callbacks
        let routes: { [endpoint: string]: Function };

        let request: any = {};
        let response: any;

        beforeEach(() => {
            generalLee.isRunning = generalLeeIsRunningFn = sinon.stub();
            generalLee.engine = sinon.createStubInstance(Wheels);
            generalLee.engine.increaseSpeed = generalLeeEngineIncreaseSpeedFn = sinon.stub();
            generalLee.engine.decreaseSpeed = generalLeeEngineDecreaseSpeedFn = sinon.stub();
            generalLee.engine.stop = generalLeeEngineBreakFn = sinon.stub();

            responseStatusFn = sinon.stub();
            responseEndFn = sinon.stub();

            routes = {};

            routerPostFn.callsFake((endpoint: string, fn: Function) => {
                routes[endpoint] = fn;
            });

            response = {
                status: responseStatusFn,
                end: responseEndFn
            };

            engineRouter = new EngineRouter(generalLee);
        });

        describe('while general lee is running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(true);
            });

            it('increase speed', () => {
                routes['/increase-speed'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeEngineIncreaseSpeedFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('decrease speed', () => {
                routes['/decrease-speed'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeEngineDecreaseSpeedFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('break', () => {
                routes['/break'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeEngineBreakFn);
                sinon.assert.calledWith(responseStatusFn, 200);
                sinon.assert.calledOnce(responseEndFn);
            });

            afterEach(() => {
                routerFn.restore();
                routerPostFn.reset();
                responseStatusFn.reset();
                responseEndFn.reset();
                generalLeeIsRunningFn.reset();
                generalLeeEngineIncreaseSpeedFn.reset();
                generalLeeEngineDecreaseSpeedFn.reset();
                generalLeeEngineBreakFn.reset();
            });
        });

        describe('while general lee is not running', () => {
            beforeEach(() => {
                generalLeeIsRunningFn.returns(false);
            });

            it('does not increase speed', () => {
                routes['/increase-speed'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeEngineIncreaseSpeedFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('does not decrease speed', () => {
                routes['/decrease-speed'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeEngineDecreaseSpeedFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            it('does not break', () => {
                routes['/break'](request, response);
                sinon.assert.calledOnce(generalLeeIsRunningFn);
                sinon.assert.callCount(generalLeeEngineBreakFn, 0);
                sinon.assert.calledWith(responseStatusFn, 409);
                sinon.assert.calledOnce(responseEndFn);
            });

            afterEach(() => {
                routerFn.restore();
                routerPostFn.reset();
                responseStatusFn.reset();
                responseEndFn.reset();
                generalLeeIsRunningFn.reset();
                generalLeeEngineIncreaseSpeedFn.reset();
                generalLeeEngineDecreaseSpeedFn.reset();
                generalLeeEngineBreakFn.reset();
            });
        });
    });
});