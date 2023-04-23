import { responseApi } from "../common";
import { AuthUser, AuthRequest } from "../common/AuthRequest";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader)
    return responseApi(res, 401, {
      success: false,
      response: {
        message: "Missing authentication",
      },
    });
  const [authType, authToken] = authHeader.split(" ", 2)  
  if(authType.toLowerCase() != "bearer")
    return responseApi(res, 401, {
      success: false,
      response: {
        message: `${authType} is not supported yet!`,
      },
    });
  try {
    const secret = process.env.JWT_SECRET || "";
    const data = jwt.verify(authToken, secret) as AuthUser;
    req.authUser = {
      id: data.id,
      username: data.username,
      role: data.role,
    };
    return next();
  } catch (error) {
    return responseApi(res, 401, {
      success: false,
      response: {
        message: error.message,
      },
    });
  }
};

export { auth };
