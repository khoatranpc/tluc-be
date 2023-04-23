import { NextFunction, Request, Response } from "express"
import { responseApi } from "../../common";
import { validatorEmail } from "../../validator";

const userMiddleWare = {
    create: (req: Request, res: Response, next: NextFunction) => {
        try {
            const { username, password, email } = req.body;
            if (!username) {
                throw new Error('Username is required!');
            }
            if (!password) {
                throw new Error('Password is required!');
            }
            if (!email) {
                throw new Error('Email is required!');
            } else {
                if (!validatorEmail(email)) {
                    throw new Error('Email must be type Email!')
                }
            }
            next();
        } catch (error) {
            responseApi(res, 500, {
                success: false,
                response: {
                    message: error.message
                }
            })
        }
    },
    login: (req: Request, res: Response, next: NextFunction) => {
        try {
            const { password, email } = req.body;
            if (!password) {
                throw new Error('Password is required!');
            }
            if (!email) {
                throw new Error('Email is required!');
            } else {
                if (!validatorEmail(email)) {
                    throw new Error('Email must be type Email!')
                }
            }
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
export default userMiddleWare;