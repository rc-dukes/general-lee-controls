import {Engine} from "./engine";
import * as sinon from "sinon";
import {GeneralLee} from "./generalLee";
import {Lights} from "./lights";
import {Wheels} from "./wheels";

describe('General Lee', () => {
    let generalLee: GeneralLee;
    let engineStopFn: sinon.SinonSpy;
    let lightsTurnOnFn: sinon.SinonSpy;
    let lightsTurnOffFn: sinon.SinonSpy;
    let wheelsCenterFn: sinon.SinonSpy;

    beforeEach(() => {
        generalLee = new GeneralLee();
        engineStopFn = sinon.stub(Engine.prototype, 'stop');
        lightsTurnOnFn = sinon.stub(Lights.prototype, 'turnOn');
        lightsTurnOffFn = sinon.stub(Lights.prototype, 'turnOff');
        wheelsCenterFn = sinon.stub(Wheels.prototype, 'center');
    });

    describe('constructor', () => {
        it('sets the indicator running to false', () =>
            expect(generalLee.running).toBe(false));
    });

    describe('startup', () => {
        beforeEach(() =>
            generalLee.startup());

        it('sets the indicator running to false', () =>
            expect(generalLee.running).toBe(true));

        it('turns the lights on', () =>
            sinon.assert.called(lightsTurnOnFn));

        it('centers the wheels', () =>
            sinon.assert.called(wheelsCenterFn));

        it('stops the engine', () =>
            sinon.assert.called(engineStopFn));
    });

    describe('shutdown', () => {
        beforeEach(() =>
            generalLee.shutdown());

        it('sets the indicator running to false', () =>
            expect(generalLee.running).toBe(false));

        it('turns the lights off', () =>
            sinon.assert.called(lightsTurnOffFn));

        it('centers the wheels', () =>
            sinon.assert.called(wheelsCenterFn));

        it('stops the engine', () =>
            sinon.assert.called(engineStopFn));
    });

    describe('isRunning', () => {
        describe('while running', () => {
            it('return true', () => {
                generalLee.running = true;
                expect(generalLee.isRunning()).toBe(true);
            });
        });

        describe('while not running', () => {
            it('return false', () => {
                generalLee.running = false;
                expect(generalLee.isRunning()).toBe(false);
            });
        });

    });

    afterEach(() => {
        engineStopFn.restore();
        lightsTurnOnFn.restore();
        lightsTurnOffFn.restore();
        wheelsCenterFn.restore();
    });
});