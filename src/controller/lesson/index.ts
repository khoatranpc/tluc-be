import { Response } from "express";
import { responseApi } from "../../common";
import { AuthRequest } from "../../common/AuthRequest";
import unitRepositories from "../../repositories/unit";
import lessonRepositories from "../../repositories/lesson";
import courseService from "../../service/course";
import { ROLE_USER } from "../../Enum/";

const lessonController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const idUnit = req.params.id;
      const idUser = req.authUser.id;
      const lessonInfo = req.body;

      const unit = await unitRepositories.getDrawUnit(idUnit);
      if (!unit) {
        throw new Error("Course not found");
      }
      if (idUser != unit.author) {
        throw new Error("Permission denied");
      }

      const result = await courseService.createLesson(
        idUnit,
        idUser,
        lessonInfo
      );

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
      const lessonInfo = req.body;

      const lesson = await lessonRepositories.getDraw(id);
      if (!lesson) {
        throw new Error("Course not found");
      }
      if (idUser != lesson.author && idUser != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }
      const result = await lessonRepositories.update(id, lessonInfo);

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Update Lesson success!",
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

      const lesson = await lessonRepositories.getDraw(id);
      if (!lesson) {
        throw new Error("Course not found");
      }
      if (idUser != lesson.author.toString() && idUser != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }
      const result = await lessonRepositories.delete(id);

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Delete Lesson success!",
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
export default lessonController;
