import { Obj } from "../../interface";
import { Lesson } from "../../model/lesson";
import { Unit } from "../../model/unit";
import { ObjectId } from "bson";
import { uuid } from "../../common";

import unitRepositories from "../../repositories/unit";
import lessonRepositories from "../../repositories/lesson";
import courceRepositories from "../../repositories/course";
import enrollRepositories from "../../repositories/enroll";
import commentRepositories from "../../repositories/comment";
import userRepositories, { OptionFind } from "../../repositories/user";

const mapDoneCourse = (course, user) => {
  const lessonDone = user.lessonDone.map((lesson) => {
    return lesson.toString();
  });
  return course.map((course) => {
    return {
      ...course,
      unit: course.unit.map((unit) => {
        return {
          ...unit,
          lesson: unit.lesson.map((lesson) => {
            if (lessonDone.includes(lesson._id.toString())) {
              return { ...lesson, done: true };
            } else {
              return { ...lesson, done: false };
            }
          }),
        };
      }),
    };
  });
};

const courseService = {
  createCourse: async (idUser: string, info: any) => {
    try {
      const createCourse = await courceRepositories.create(info);
      if (!createCourse) {
        throw new Error("Fail to create course!");
      }

      const currentIdCourse = createCourse.insertedId;
      const addClassEnrollment = await userRepositories.addClass(
        idUser,
        new ObjectId(currentIdCourse),
        "classEnrollment"
      );
      if (!addClassEnrollment) {
        throw new Error("Update class enrollment failed!");
      }

      const enroll = {
        idClass: new ObjectId(currentIdCourse),
        student: [
          { userId: new ObjectId(idUser), time: new Date(), access: true },
        ],
      };

      const comment = {
        idComment: new ObjectId(currentIdCourse),
        comment: [],
      };
      const createEnroll = await enrollRepositories.create(enroll);
      if (!createEnroll) {
        throw new Error("Fail to create Enroll!");
      }
      const createComment = await commentRepositories.create(comment);
      if (!createComment) {
        throw new Error("Fail to create comment!");
      }

      return createCourse;
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Fail to create course!");
    }
  },
  createUnit: async (idCourse: string, idAuthor: string, info: Obj) => {
    try {
      const { unitName } = info;

      const unit = Unit.create(unitName, idAuthor);
      const createUnit = await unitRepositories.create(unit);
      if (!createUnit) {
        throw new Error("Fail to create unit!");
      }
      const currentIdUnit = createUnit.insertedId;

      const updateUnitToCourse = await courceRepositories.addUnitToCourse(
        idCourse,
        new ObjectId(currentIdUnit)
      );
      if (!updateUnitToCourse) {
        throw new Error("Update unit to course failed!");
      }
      return createUnit;
    } catch {
      throw new Error("Fail to create unit!");
    }
  },
  createLesson: async (idUnit: string, idAuthor: string, info: Obj) => {
    try {
      const { lessonName, source, type } = info;

      const lesson = Lesson.create(lessonName, source, type, idAuthor);
      const createLesson = await lessonRepositories.create(lesson);
      if (!createLesson) {
        throw new Error("Fail to create lesson!");
      }
      const currentIdLesson = createLesson.insertedId;
      const updateLessonToUnit = await unitRepositories.addLessonToUnit(
        idUnit,
        new ObjectId(currentIdLesson)
      );
      if (!updateLessonToUnit) {
        throw new Error("Update lesson to unit failed!");
      }
      return createLesson;
    } catch {
      throw new Error("Fail to create unit!");
    }
  },
  GetCourse: async (idUser: string) => {
    try {
      const fullCourse = await courceRepositories.getAll(true, "");
      const user = await userRepositories.findOneBySingleField(
        OptionFind.ID,
        idUser
      );

      if (!fullCourse) {
        throw new Error("Cant get course");
      }
      if (!user) {
        throw new Error("Cant get user");
      }

      const classEnrollment = user.classEnrollment.map((lesson) => {
        return lesson.toString();
      });

      const classWaiting = user.classWaiting.map((lesson) => {
        return lesson.toString();
      });

      const result = fullCourse.map((course) => {
        if (classEnrollment.includes(course._id.toString())) {
          return { ...course, enroll: true };
        } else if (classWaiting.includes(course._id.toString())) {
          return { ...course, enroll: "waiting", unit: [] };
        } else {
          return { ...course, enroll: false, unit: [] };
        }
      });
      if (!result) {
        throw new Error("cant map course");
      }
      return result;
    } catch {
      throw new Error("Fail to get course!");
    }
  },
  GetCourseById: async (idUser: string, idCoure: string, access: boolean) => {
    try {
      const fullCourse = await courceRepositories.getAll(true, idCoure);
      const user = await userRepositories.findOneBySingleField(
        OptionFind.ID,
        idUser
      );
      if (!fullCourse) {
        throw new Error("Cant get course");
      }
      if (!user) {
        throw new Error("Cant get user");
      }

      const studentEnrollId = fullCourse[0]._id;

      const studentEnroll = await enrollRepositories.getAll(studentEnrollId);
      const comment = await commentRepositories.getAll(studentEnrollId);
      const classEnrollment = user.classEnrollment.map((course) => {
        return course.toString();
      });

      const classWaiting = user.classWaiting.map((lesson) => {
        return lesson.toString();
      });

      if (classEnrollment.includes(fullCourse[0]._id.toString()) || access) {
        const courseMapDone = mapDoneCourse(fullCourse, user);
        return [
          {
            ...courseMapDone[0],
            enroll: true,
            student: studentEnroll[0],
            comment: comment[0],
          },
        ];
      } else if (classWaiting.includes(fullCourse[0]._id.toString())) {
        return [
          {
            ...fullCourse[0],
            enroll: "waiting",
            unit: [],
            student: [],
            comment: comment[0],
          },
        ];
      } else {
        return [
          {
            ...fullCourse[0],
            enroll: false,
            unit: [],
            student: [],
            comment: comment[0],
          },
        ];
      }
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Fail to get course!");
    }
  },
  GetCourseByIdVL: async (idCoure: string) => {
    try {
      let cmt = [] as any[];
      const course = await courceRepositories.getAll(false, idCoure);
      const comment = await commentRepositories.getAll(idCoure);


      if (!course) {
        throw new Error(" course not found");
      }
      if (!comment) {
        throw new Error(" comment not found");
      } else {
        cmt = comment;
      }

      return [{ ...course[0], comment: cmt[0] }];
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Fail to get course!");
    }
  },
  GetAllAuth: async (idUser: string, idCoure: string, access: boolean) => {
    try {
      const fullCourse = await courceRepositories.getAll(true, "");
      const user = await userRepositories.findOneBySingleField(
        OptionFind.ID,
        idUser
      );
      if (!fullCourse) {
        throw new Error("Cant get course");
      }
      if (!user) {
        throw new Error("Cant get user");
      }

      const studentEnrollId = fullCourse[0]._id;

      const studentEnroll = await enrollRepositories.getAll(studentEnrollId);
      const comment = await commentRepositories.getAll(studentEnrollId);
      const classEnrollment = user.classEnrollment.map((course) => {
        return course.toString();
      });

      const classWaiting = user.classWaiting.map((lesson) => {
        return lesson.toString();
      });

      if (classEnrollment.includes(fullCourse[0]._id.toString()) || access) {
        const courseMapDone = mapDoneCourse(fullCourse, user);
        return [
          {
            ...courseMapDone[0],
            enroll: true,
            student: studentEnroll[0],
            comment: comment[0],
          },
        ];
      } else if (classWaiting.includes(fullCourse[0]._id.toString())) {
        return [
          {
            ...fullCourse[0],
            enroll: "waiting",
            unit: [],
            student: [],
            comment: comment[0],
          },
        ];
      } else {
        return [
          {
            ...fullCourse[0],
            enroll: false,
            unit: [],
            student: [],
            comment: comment[0],
          },
        ];
      }
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Fail to get course!");
    }
  },
  enrollWaiting: async (idUser: string, courseId: string) => {
    try {
      const enrollInfo = {
        userId: new ObjectId(idUser),
        time: new Date(),
        access: false,
      };
      const enroll = await enrollRepositories.addEnrollWaiting(
        courseId,
        enrollInfo
      );
      if (!enroll) {
        throw new Error("Fail to add Enroll Waiting");
      }
      const addClassWaiting = await userRepositories.addClass(
        idUser,
        new ObjectId(courseId),
        "classWaiting"
      );

      return enroll;
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Fail to create course!");
    }
  },
  acceptEnroll: async (courseId: string, studentId: string) => {
    try {
      await userRepositories.addClass(
        studentId,
        new ObjectId(courseId),
        "classEnrollment"
      );
      await userRepositories.removeClass(
        studentId,
        new ObjectId(courseId),
        "classWaiting"
      );
      const result = await enrollRepositories.addEnroll(courseId, studentId);

      return result;
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Fail to create course!");
    }
  },
  removeEnroll: async (courseId: string, studentId: string) => {
    try {
      await userRepositories.removeClass(
        studentId,
        new ObjectId(courseId),
        "classEnrollment"
      );
      await userRepositories.removeClass(
        studentId,
        new ObjectId(courseId),
        "classWaiting"
      );
      const result = await enrollRepositories.removeEnroll(courseId, studentId);

      return result;
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Remove or Reject failed!");
    }
  },
  addEnroll: async (courseId: string, studentId: string) => {
    try {
      await userRepositories.addClass(
        studentId,
        new ObjectId(courseId),
        "classEnrollment"
      );
      const result = await enrollRepositories.addEnroll(courseId, studentId);

      const enrollInfo = {
        userId: new ObjectId(studentId),
        time: new Date(),
        access: true,
      };
      await enrollRepositories.addEnrollWaiting(courseId, enrollInfo);

      return result;
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Fail to create course!");
    }
  },
};

export default courseService;
