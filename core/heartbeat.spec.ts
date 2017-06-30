import * as sinon from "sinon";
import {Heartbeat} from "./heartbeat";
import {GeneralLee} from "./system/generalLee";

describe('Heartbeat', () => {
    let generalLee: GeneralLee;
    let heartbeat: Heartbeat;
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
        generalLee = new GeneralLee();
        clock = sinon.useFakeTimers();
        heartbeat = new Heartbeat(generalLee);
    });

    describe('constructor', () => {
        it('sets the last heartbeat to zero', () =>
            expect(heartbeat.last).toBe(0));
    });

    describe('start', () => {
        describe('while less then 4 intervals have passed', () => {
            let millisPassed: number;
            beforeEach(() => {
                millisPassed = 450; // 3 beats
            });

            it('does not check if the general lee is running', () => {
                let generalLeeIsRunningFn = sinon.stub(generalLee, 'isRunning');

                heartbeat.start();
                clock.tick(millisPassed);

                sinon.assert.callCount(generalLeeIsRunningFn, 0);
            });
        });

        describe('while more then 3 beats are missed', () => {
            let millisPassed: number;
            beforeEach(() => {
                millisPassed = 900; // 6 beats
            });
            it('checks every the interval to check for missing heartbeats', () => {
                let generalLeeIsRunningFn = sinon.stub(generalLee, 'isRunning')
                generalLeeIsRunningFn.onFirstCall().returns(false);
                generalLeeIsRunningFn.onSecondCall().returns(true);
                generalLeeIsRunningFn.onThirdCall().returns(false);
                let generalLeeShutdownFn = sinon.stub(generalLee, 'shutdown');

                heartbeat.start();
                clock.tick(millisPassed);

                // 3 intervals exceeded the hearbeat
                sinon.assert.calledThrice(generalLeeIsRunningFn);
                sinon.assert.calledOnce(generalLeeShutdownFn); // only the second time general lee is running.
            });
        });
    });

    afterEach(() => {
        clock.restore();
    });
});