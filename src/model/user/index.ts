import { ObjectId } from "mongodb";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ROLE_USER, STATUS_USER } from "../../Enum";
import { uuid } from "../../common";
import { Obj } from "../../interface";

class User {
  public _id: ObjectId = null;
  public username: string = null;
  public password: string = null;
  public role: ROLE_USER = ROLE_USER.ST;
  public salt: string = null;
  public status: STATUS_USER = STATUS_USER.AT;
  public img: string = null;
  public email: string = null;
  public phone: string = null;
  public createTime: Date = null;
  public classEnrollment: Array<String> = [];
  public classWaiting: Array<String> = [];
  public lessonDone: Array<String> = [];
  constructor(
    username: string,
    password: string,
    img: string,
    email: string,
    phone: string,
    createTime: Date
  ) {
    this.username = username;
    this.password = password;
    this.salt = `SALT+${uuid()}`;
    this.img = img;
    this.email = email;
    this.phone = phone;
    this.createTime = createTime;
  }
  static mapDataFromDocument(document: Obj) {
    const user = new User(
      document.username,
      document.password,
      document.img,
      document.email,
      document.phone,
      document.createTime
    );
    user._id = document._id;
    user.status = document.status;
    user.role = document.role;
    user.salt = document.salt;
    user.classEnrollment = document.classEnrollment;
    user.classWaiting = document.classWaiting;
    user.lessonDone = document.lessonDone;
    return user;
  }
  static createUser(
    username: string,
    password: string,
    img: string,
    email: string,
    phone: string
  ) {
    const user = new User(username, password, img, email, phone, new Date());
    return user;
  }
  generateToken() {
    const TOKEN_EFFECTIVE_TIME = 36000; // 10 hour
    const secret: string = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      {
        id: this._id,
        username: this.username,
        password: this.password,
        role: this.role,
        salt: this.salt,
      },
      secret,
      {
        expiresIn: TOKEN_EFFECTIVE_TIME,
      }
    );
    return token;
  }
  generatePassword() {
    const salt = crypto.randomBytes(128).toString("base64");
    const hashedPassword = crypto.pbkdf2Sync(
      this.password,
      salt,
      10000,
      128,
      "sha256"
    );
    this.salt = salt;
    this.password = hashedPassword.toString("hex");
  }

  verifyPassword(rawPassword: string) {
    const hashedPassword = crypto.pbkdf2Sync(
      rawPassword,
      this.salt,
      10000,
      128,
      "sha256"
    );
    return hashedPassword.toString("hex") === this.password;
  }
}
export { User };
