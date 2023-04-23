import { Request } from "express";

export interface BodyResponse {
    success: boolean;
    response: Obj | Record<string, unknown>;
}
export interface UserRequest extends Request {
    auth: {
        username: string;
        password: string;
        email: string;
    }
}
export interface Obj {
    [key: string]: any;
}
