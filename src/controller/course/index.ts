import { Request, Response } from "express";
import { responseApi } from "../../common";
import { AuthRequest } from "../../common/AuthRequest";
import { ObjectId } from "bson";
import { ROLE_USER, STATUS_COURSE } from "../../Enum/";
import Course from "../../model/course";
import courceRepositories from "../../repositories/course";
import userRepositories, { OptionFind } from "../../repositories/user";
import courseService from "../../service/course";
import commentRepositories from "../../repositories/comment";

const courceController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const { major, nameCourse, img, summaryCourse, videoThumbnail, level } =
        req.body;
      const roleAuth = req.authUser.role;
      const idAuth = req.authUser.id;

      if (roleAuth === ROLE_USER.TC || roleAuth === ROLE_USER.AD) {
        const course = Course.createCourse(
          nameCourse,
          major,
          new ObjectId(idAuth),
          img,
          summaryCourse,
          videoThumbnail,
          [],
          level,
          new Date(),
          STATUS_COURSE.AT
        );
        const newCourse = await courseService.createCourse(idAuth, course);
        if (!newCourse) {
          throw new Error("Something went wrong");
        }
        responseApi(res, 200, {
          success: true,
          response: {
            message: "Created Cource!",
            data: newCourse,
          },
        });
      } else {
        throw new Error("Permission denied");
      }
    } catch (error) {
      responseApi(res, 500, {
        success: false,
        response: {
          message: error.message,
        },
      });
    }
  },
  getCourse: async (req: Request, res: Response) => {
    try {
      const result = await courceRepositories.getAll(false, "");
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Success!",
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
  getCourseAuth: async (req: AuthRequest, res: Response) => {
    try {
      const roleAuth = req.authUser.role;
      const roleId = req.authUser.id;

      if (!roleAuth) {
        throw new Error("Missing user role");
      }
      if (!roleId) {
        throw new Error("Missing user id");
      }

      let result = null;
      if (roleAuth === ROLE_USER.AD) {
        result = await courceRepositories.getAll(true, "");
      }
      if (roleAuth === ROLE_USER.ST || roleAuth === ROLE_USER.TC) {
        result = await courseService.GetCourse(roleId);
      }

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Success!",
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
  getCourseById: async (req: AuthRequest, res: Response) => {
    try {
      const roleAuth = req.authUser.role;
      const roleId = req.authUser.id;
      const courseId = req.params.id;

      if (!roleAuth) {
        throw new Error("Missing user role");
      }
      if (!roleId) {
        throw new Error("Missing user id");
      }
      if (!courseId) {
        throw new Error("Missing course id");
      }

      let result = null;
      if (roleAuth === ROLE_USER.AD || roleAuth === ROLE_USER.TC) {
        result = await courseService.GetCourseById(roleId, courseId, true);
      }
      if (roleAuth === ROLE_USER.ST) {
        result = await courseService.GetCourseById(roleId, courseId, false);
      }

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Success!",
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
  getCourseVLById: async (req: AuthRequest, res: Response) => {
    try {
      const courseId = req.params.id;

      if (!courseId) {
        throw new Error("Missing course id");
      }

      const result = await courseService.GetCourseByIdVL(courseId);

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Success!",
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
  enroll: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.authUser.id;
      const courseId = req.params.id;

      if (!courseId) {
        throw new Error(`Course id is required`);
      }
      const course = await courceRepositories.getDrawCourse(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      const result = await courseService.enrollWaiting(userId, courseId);
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Created Cource!",
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
  acceptEnroll: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.authUser.id;
      const userRole = req.authUser.role;
      const courseId = req.params.id;
      const studentId = req.body.studentId;
      if (!courseId || !studentId || !userId || !userRole) {
        throw new Error("Missing information");
      }
      const course = await courceRepositories.getDrawCourse(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      if (userId != course.author && userRole != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }

      const newCourse = await courseService.acceptEnroll(courseId, studentId);
      if (!newCourse) {
        throw new Error("Something went wrong");
      }
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Acepted!",
          data: newCourse,
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
  removenroll: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.authUser.id;
      const userRole = req.authUser.role;
      const courseId = req.params.id;
      const studentId = req.body.studentId;
      if (!courseId || !studentId || !userId || !userRole) {
        throw new Error("Missing information");
      }
      const course = await courceRepositories.getDrawCourse(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      if (userId != course.author && userRole != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }

      const newCourse = await courseService.removeEnroll(courseId, studentId);
      if (!newCourse) {
        throw new Error("Something went wrong");
      }
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Created Cource!",
          data: newCourse,
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
  addEnroll: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.authUser.id;
      const userRole = req.authUser.role;
      const courseId = req.params.id;
      const studentId = req.body.studentId;
      if (!courseId || !studentId || !userId || !userRole) {
        throw new Error("Missing information");
      }
      const course = await courceRepositories.getDrawCourse(courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      if (userId != course.author && userRole != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }

      const newCourse = await courseService.addEnroll(courseId, studentId);
      if (!newCourse) {
        throw new Error("Something went wrong");
      }
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Created Cource!",
          data: newCourse,
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
  addComment: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.authUser.id;
      const courseId = req.params.id;
      const comment = req.body.comment;
      if (!courseId || !courseId || !comment) {
        throw new Error("Missing information");
      }

      const user = await userRepositories.findOneBySingleField(
        OptionFind.ID,
        userId
      );

      if (!user) {
        throw new Error("User not found");
      }

      const classEnrollment = user.classEnrollment.map((lesson) => {
        return lesson.toString();
      });
      if (!classEnrollment.includes(courseId.toString())) {
        throw new Error("permission denied");
      }
      const infoComment = {
        userId: new ObjectId(userId),
        content: comment,
        time: new Date(),
      };

      const result = await commentRepositories.addComment(
        courseId,
        infoComment
      );

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Created Cource!",
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
      const userRole = req.authUser.role;

      const course = await courceRepositories.getDrawCourse(id);
      if (!course) {
        throw new Error("Course not found");
      }

      if (idUser != course.author.toString() && userRole != ROLE_USER.AD) {
        throw new Error("Permission denied");
      }

      const result = await courceRepositories.delete(id);

      responseApi(res, 200, {
        success: true,
        response: {
          message: "Delete Course success!",
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
export default courceController;
