export class Alert {
    id: string;
    fade: boolean;
    type: AlertType;
    message: string;
    autoClose: boolean;
    keepAfterRouteChange: boolean;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum AlertType {
    Success,
    Error,
    Info,
    Warning
}