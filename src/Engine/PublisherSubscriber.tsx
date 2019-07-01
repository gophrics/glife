export class PublisherSubscriber {
    Bus: any
    ImageBus: string = "";
    FunctionEveryTenSeconds = Array<() => void>();
    PauseUpdate: boolean = false;

    constructor() {
        console.log("Constructor called")
        setTimeout(this.CallFunctions, 1000)
    }

    CallFunctions = () => {
        console.log("PauseUpdate" + this.PauseUpdate)
        if(!this.PauseUpdate) {
            for(var f of this.FunctionEveryTenSeconds) {
                console.log(f)
                f()
            }
        }
        setTimeout(this.CallFunctions, 1000)
    }
}