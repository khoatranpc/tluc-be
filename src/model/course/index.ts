import { ObjectId } from "bson";
import { COURCE_LEVEL, COURSE_TYPE, STATUS_COURSE } from "../../Enum";
import { Obj } from "../../interface";

export interface Unit {
  _id: ObjectId;
  unitName: string; // tiêu đề khóa học
  lesson: {
    _id: ObjectId;
    lessonName: string; // tiêu đề bài học
    lessonSource: string; // video bài học
    type: COURSE_TYPE; // kiểu định dạng
  }[];
}
[];



class Course {
  public _id: ObjectId = null;
  public nameCourse: string = null; // tên khóa học
  public major: string = null; // bộ môn của khóa
  public author: ObjectId = null; // tác giả
  public img: string = null; // hình ảnh
  public level: COURCE_LEVEL = null; // cấp độ của khóa học
  public summaryCourse: string = null; // tóm tắt nội dung khóa học
  public videoThumbnail: string = null; // video giới thiệu thumbnail
  public unit: Unit[] = null; // Các phần bài giảng của khóa học
  public createTime: Date = null;
  public status: STATUS_COURSE = null;
  public enroll: boolean = false;
  public previewUnit: Obj[] = null;
  constructor(
    nameCourse: string | null,
    major: string | null,
    author: ObjectId | null,
    img: string | null,
    summaryCourse: string | null,
    videoThumbnail: string | null,
    unit: Unit[] | null,
    level: COURCE_LEVEL | null,
    createTime: Date | null,
    status: STATUS_COURSE | null,
    previewUnit: Obj[] | null
  ) {
    this._id = new ObjectId();
    this.author = author;
    this.unit = unit;
    this.img = img;
    this.major = major;
    this.nameCourse = nameCourse;
    this.summaryCourse = summaryCourse;
    this.videoThumbnail = videoThumbnail;
    this.level = level;
    this.createTime = createTime;
    this.status = status;
    this.previewUnit = previewUnit;
  }
  static mapDataFromDocument(document: Obj) {
    const course = new Course(
      document.nameCourse,
      document.major,
      document.author,
      document.img,
      document.summaryCourse,
      document.videoThumbnail,
      document.unit,
      document.level,
      document.createTime,
      document.status,
      document.previewUnit
    );
    course._id = document._id;

    return course;
  }
  static createCourse(
    nameCourse: string | null,
    major: string | null,
    author: ObjectId | null,
    img: string | null,
    summaryCourse: string | null,
    videoThumbnail: string | null,
    unit: Unit[] | null,
    level: COURCE_LEVEL | null,
    createTime: Date | null,
    status: STATUS_COURSE | null
  ) {
    const course = new Course(
      nameCourse,
      major,
      author,
      img,
      summaryCourse,
      videoThumbnail,
      unit,
      level,
      createTime,
      status,
      []
    );
    return course;
  }
}
export default Course;
