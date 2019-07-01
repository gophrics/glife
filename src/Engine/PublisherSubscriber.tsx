export class PublisherSubscriber {
    Bus: any = {};
    ImageBus: string = "";
    FunctionEveryTenSeconds = Array<() => void>();
    PauseUpdate: boolean = false;

    constructor() {
        setTimeout(this.CallFunctions, 1000)
    }

    CallFunctions = () => {
        if(!this.PauseUpdate) {
            for(var f of this.FunctionEveryTenSeconds) {
                f()
            }
        }
        setTimeout(this.CallFunctions, 1000)
    }
}