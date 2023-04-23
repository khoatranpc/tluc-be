import courceRepositories from "../../repositories/course";
import enrollRepositories from "../../repositories/enroll";
import commentRepositories from "../../repositories/comment";
import userRepositories, { OptionFind } from "../../repositories/user";
import { Obj } from "../../interface";

const groupCourseByMajor = (course) => {
  const groupCourse = {};
  course.forEach((c: Obj) => {
    if (!groupCourse[c.major]) {
      groupCourse[c.major] = [c];
    } else {
      groupCourse[c.major].push(c);
    }
  });
  return groupCourse;
};
const groupCourseByLV = (course) => {
  const groupCourse = {};
  course.forEach((c: Obj) => {
    if (!groupCourse[c.level]) {
      groupCourse[c.level] = [c];
    } else {
      groupCourse[c.level].push(c);
    }
  });
  return groupCourse;
};
const countCourseByMajor = (course) => {
  const counts = {};
  course.forEach((c: Obj) => {
    counts[c.major] = (counts[c.major] || 0) + 1;
  });
  return counts;
};

const dashboardService = {
  getDashboard: async () => {
    try {
      const listUsers = await userRepositories.getUsersDashboard();
      if (!listUsers) {
        throw new Error("Failed to get Users");
      }
      const course = await courceRepositories.getCourseDashboard();
      if (!course) {
        throw new Error("Failed to get course");
      }
      const userdb = {};
      listUsers.forEach((user) => {
        if (!userdb[user.role]) {
          userdb[user.role] = [user];
        } else {
          userdb[user.role].push(user);
        }
      });
      const newCourse = course.map((course) => {
        return {
          ...course,
          student: course.student[0].student.length,
        };
      });
      const groupCoursebyMajor = groupCourseByMajor(newCourse);

      const courseByLV = {
        BASIC: [],
        ADVANCED: [],
        INTENSVIVE: [],
      };


      const courseByLV_ = groupCourseByLV(newCourse);
      Object.keys(courseByLV_).forEach((key) => {
        courseByLV[key] = countCourseByMajor(courseByLV_[key]);
      });

      return {
        user: userdb,
        course: {
          byMajor: groupCoursebyMajor,
          byLV: courseByLV,
        },
      };
    } catch (error) {
      if (error) {
        throw new Error(error.message);
      }
      throw new Error("Fail to get dashboard!");
    }
  },
};

export default dashboardService;
