import { ObjectId } from "bson";
import { Obj } from "../../interface";
import { COURSE_TYPE } from "../../Enum";

class Lesson {
  public _id: ObjectId = null;
  public lessonName: string = null;
  public source: string = null;
  public type: COURSE_TYPE = null;
  public author: string = null;
  public createTime: Date = null;

  constructor(
    lessonName: string | null,
    source: string = null,
    type: COURSE_TYPE = null,
    author: string | null,
    createTime: Date | null
  ) {
    this._id = new ObjectId();
    this.lessonName = lessonName;
    this.source = source;
    this.type = type;
    this.author = author;
    this.createTime = createTime;
  }
  static mapDataFromDocument(document: Obj) {
    const lesson = new Lesson(
      document.lessonName,
      document.source,
      document.type,
      document.author,
      document.createTime
    );
    lesson._id = document._id;
    return lesson;
  }
  static create(
    lessonName: string | null,
    source: string | null,
    type: COURSE_TYPE | null,
    author: string | null
  ) {
    const createTime = new Date();
    const lesson = new Lesson(lessonName, source, type, author, createTime);
    return lesson;
  }
}
export { Lesson };
