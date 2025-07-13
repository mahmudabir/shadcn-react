export class Result<T> {
    message?: string;
    isSuccess: boolean = false;
    additionalProperties?: Record<string, any>;
    errors?: Record<string, string[]>;
    payload?: T;

    get isFailure(): boolean {
        return !this.isSuccess;
    }

    constructor(init?: Partial<Result<T>>) {
        Object.assign(this, init);
    }
}