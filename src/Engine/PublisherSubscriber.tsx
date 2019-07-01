export class PublisherSubscriber {
    Bus: any = {};
    ImageBus: string = "";
    FunctionEveryTenSeconds = Array<() => void>();
    PauseUpdate: boolean = false;

    constructor() {
        this.CallFunctions()
    }

    CallFunctions = () => {
        if(!this.PauseUpdate) {
            for(var f of this.FunctionEveryTenSeconds) {
                f()
            }
        }
        setTimeout(this.CallFunctions, 10000)
    }
}