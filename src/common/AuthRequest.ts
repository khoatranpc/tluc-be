import { Request } from "express";

export interface AuthRequest extends Request {
	authUser?: AuthUser;
}

export interface AuthUser {
	id: string;
	username: string;
	role: string;
}
