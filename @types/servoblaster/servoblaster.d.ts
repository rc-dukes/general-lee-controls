declare namespace servoblaster {
    interface Stream {
        write(value: number): void;
        end(): void;
    }
}

declare module "servoblaster" {
    export function createWriteStream(pin: any): servoblaster.Stream;
}

export = servoblaster;