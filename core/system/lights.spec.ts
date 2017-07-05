import * as sinon from 'sinon';
import * as servoblaster from 'servoblaster';
import Lights from './lights';
import {Container} from 'inversify';

describe('Lights', () => {
    let lights: Lights;
    let servoblasterCreateWriteStreamFn: sinon.SinonStub;
    let streamWriteFn: sinon.SinonStub;
    let streamEndFn: sinon.SinonStub;

    beforeEach(() => {
        const container = new Container();
        container.bind<Lights>('lights').to(Lights);
        lights = container.get<Lights>('lights');
        const stream: servoblaster.Stream = {
            write: (value: number) => {
            },
            end: () => {
            }
        };
        streamWriteFn = sinon.stub(stream, 'write');
        streamEndFn = sinon.stub(stream, 'end');
        servoblasterCreateWriteStreamFn = sinon.stub(servoblaster, 'createWriteStream').callsFake(() => {
            return stream;
        });
    });

    describe('constructor', () => {
        it('sets the lights to off', () =>
            expect(lights.on).toBe(false));
    });

    describe('turnOn', () => {
        it('turns the lights on', () => {
            lights.turnOn();

            expect(lights.on).toBe(true);
            sinon.assert.calledWith(servoblasterCreateWriteStreamFn, lights.SERVOBLASTER_ID_LED);
            sinon.assert.calledWith(streamWriteFn, lights.LED_ON);
            sinon.assert.called(streamEndFn);
        });
    });

    describe('turnOff', () => {
        it('turns the lights off', () => {
            lights.turnOff();

            expect(lights.on).toBe(false);
            sinon.assert.calledWith(servoblasterCreateWriteStreamFn, lights.SERVOBLASTER_ID_LED);
            sinon.assert.calledWith(streamWriteFn, lights.LED_OFF);
            sinon.assert.called(streamEndFn);
        });
    });

    afterEach(() => {
        servoblasterCreateWriteStreamFn.restore();
        streamWriteFn.restore();
        streamEndFn.restore();
    });
});
