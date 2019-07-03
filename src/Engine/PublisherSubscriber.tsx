export class PublisherSubscriber {
    static Bus: any = {};
    static ImageBus: string = "";
    static FunctionEveryTenSeconds = Array<() => void>();
    static PauseUpdate: boolean = false;

    constructor() {
        
    }
}