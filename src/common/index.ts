import { Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { BodyResponse } from "../interface";

const responseApi = (res: Response, status: number, body: BodyResponse) => {
    res.status(status).send(body);
}

const uuid = () => {
    return uuidv4();
}

export { responseApi, uuid };