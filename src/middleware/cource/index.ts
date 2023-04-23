import { NextFunction, Request, Response } from "express"
import { responseApi } from "../../common";


const courceMiddleWare = {
    create: (req: Request, res: Response, next: NextFunction) => {
        try {
            next();
        } catch (error) {
            responseApi(res, 500, {
                success: false,
                response: {
                    message: error.message
                }
            })
        }
    }
}
export default courceMiddleWare;