import { Request, Response } from "express";
import { responseApi } from "../../common";
import { AuthRequest } from "../../common/AuthRequest";
import courceRepositories from "../../repositories/course";
import unitRepositories from "../../repositories/unit";
import courseService from "../../service/course";
import { ROLE_USER } from "../../Enum/";

const unitController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const idCourse = req.params.id;
      const idUser = req.authUser.id;
      const unitInfo = req.body;

      const course = await courceRepositories.getDrawCourse(idCourse);
      if (!course) {
        throw new Error("Course not found");
      }
      if (idUser != course.author && idUser != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }

      const result = await courseService.createUnit(idCourse, idUser, unitInfo);

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Create Unit success!",
          data: result,
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
  update: async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      const idUser = req.authUser.id;
      const unitInfo = req.body;

      const unit = await unitRepositories.getDraw(id);
      if (!unit) {
        throw new Error("Course not found");
      }
      if (idUser != unit.author && idUser != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }
      const result = await unitRepositories.update(id, unitInfo);

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Update Unit success!",
          data: result,
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
  delete: async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      const idUser = req.authUser.id;

      const unit = await unitRepositories.getDraw(id);
      if (!unit) {
        throw new Error("Course not found");
      }
      if (idUser != unit.author.toString() && idUser != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }
      const result = await unitRepositories.delete(id);

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Delete Unit success!",
          data: result,
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
};
export default unitController;
