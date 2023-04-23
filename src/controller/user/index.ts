import { Request, Response } from "express";
import { AuthRequest } from "../../common/AuthRequest";
import { responseApi } from "../../common";
import { User } from "../../model/user";
import { ROLE_USER, STATUS_USER } from "../../Enum/";

import userRepositories, { OptionFind } from "../../repositories/user";
import { ObjectId } from "bson";
import dashboardService from "../../service/dashboard/dashboard";

const userController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const { username, password, email } = req.body;

      const user = User.createUser(
        username,
        password,
        req.body.img || "",
        email,
        req.body.phonenumber || ""
      );
      user.generatePassword();
      const existed = await userRepositories.findOneBySingleField(
        OptionFind.EMAIL,
        user.email
      );
      if (existed) {
        throw new Error("Email already existed!");
      }
      const newUser = await userRepositories.create(user);
      if (!newUser) {
        throw new Error("Fail to create user!");
      }

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Created!",
          data: newUser,
        },
      });
    } catch (error) {
      responseApi(res, 500, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      const existed = await userRepositories.findOneBySingleField(
        OptionFind.EMAIL,
        email
      );
      if (!existed) {
        throw new Error("Sai tài khoản hoặc mật khẩu!");
      }
      // compare password
      const getUser = User.mapDataFromDocument(existed);
      if (!getUser.verifyPassword(password)) {
        throw new Error("Sai tài khoản hoặc mật khẩu");
      }
      const token = getUser.generateToken();
      delete getUser.password;
      delete getUser.salt;
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Login success!",
          data: getUser,
          token: token,
        },
      });
    } catch (error) {
      responseApi(res, 500, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  myInformation: async (req: AuthRequest, res: Response) => {
    try {
      const authUser = req.authUser;
      const result = await userRepositories.findOneBySingleField(
        OptionFind.ID,
        authUser.id
      );
      if (!result) {
        throw new Error("User not found");
      }
      delete result.salt;
      delete result.password;
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Get information success!",
          data: {
            ...result,
            authUser: authUser,
          },
        },
      });
    } catch (error) {
      responseApi(res, 502, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  listUser: async (req: AuthRequest, res: Response) => {
    try {
      const username = req.query.username as string;
      const pageIndex = parseInt(req.query.page as string) || 1;
      const quantityPerPage = parseInt(req.query.amount as string) || 20;

      const roleAuth = req.authUser.role;

      if (roleAuth != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }

      const usersList = await userRepositories.getUsers({
        username: username,
        page: pageIndex,
        amount: quantityPerPage,
        status: STATUS_USER.AT,
      });

      if (!usersList) {
        throw new Error("Cannot Get Users");
      }
      const result = usersList.data.map((user) => {
        delete user.salt;
        delete user.password;
        return user;
      });

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Get information success!",
          data: result,
        },
      });
    } catch (error) {
      responseApi(res, 502, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  updateInformation: async (req: AuthRequest, res: Response) => {
    try {
      const idParam = req.params.id;
      const idAuth = req.authUser.id;
      const roleAuth = req.authUser.role;

      if (roleAuth === ROLE_USER.AD) {
        const result = await userRepositories.updateUserAdmin(
          idParam,
          req.body
        );
        responseApi(res, 200, {
          success: true,
          response: {
            message: "Admin update success!",
            data: result,
          },
        });
      } else if (idParam === idAuth) {
        const result = await userRepositories.updateUser(idAuth, req.body);
        responseApi(res, 200, {
          success: true,
          response: {
            message: "User update success!",
            data: result,
          },
        });
      } else {
        throw new Error("Permission denied");
      }
    } catch (error) {
      responseApi(res, 502, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  addLessonDone: async (req: AuthRequest, res: Response) => {
    try {
      const idAuth = req.authUser.id;
      const { lessonId } = req.body;

      const result = await userRepositories.addClass(
        idAuth,
        new ObjectId(lessonId),
        "lessonDone"
      );

      responseApi(res, 200, {
        success: true,
        response: {
          message: "User update success!",
          data: result,
        },
      });
    } catch (error) {
      responseApi(res, 502, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  deleteUser: async (req: AuthRequest, res: Response) => {
    try {
      const roleAuth = req.authUser.role;
      const idParam = req.params.id;

      if (roleAuth === ROLE_USER.AD) {
        const result = await userRepositories.deleteUserAdmin(idParam);
        responseApi(res, 200, {
          success: true,
          response: {
            message: "Admin delete success!",
            data: result,
          },
        });
      } else {
        throw new Error("Permission denied");
      }
    } catch (error) {
      responseApi(res, 502, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  dashboard: async (req: AuthRequest, res: Response) => {
    try {
      const roleAuth = req.authUser.role;

      if (roleAuth != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }

      const result = await dashboardService.getDashboard()

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Get information success!",
          data: result,
        },
      });
    } catch (error) {
      responseApi(res, 502, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  getUser: async (req: AuthRequest, res: Response) => {
    try {
      const mailUser = req.params.email;
      const user = await userRepositories.getUser(mailUser);
      if (!user) throw new Error('Not found this user!');
      responseApi(res, 200, {
        success: true,
        response: {
          message: 'Found!',
          data: user
        },
      });
    } catch (error) {
      responseApi(res, 502, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  }
};
export default userController;
