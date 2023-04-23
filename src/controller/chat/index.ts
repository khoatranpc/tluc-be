import { ObjectId } from "bson";
import { Request, Response } from "express";
import { responseApi } from "../../common";
import { AuthRequest } from "../../common/AuthRequest";
import chatRepositories from "../../repositories/chat";

const chatController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const myId = req.authUser.id;
      const chatName = req.body.chatName;
      const friendUserId = req.body.friendUserId;

      const data = {
        chatName: chatName,
        me: new ObjectId(myId),
        friendUserId: new ObjectId(friendUserId),
        message: [],
        createTime: new Date(),
      };

      const result = await chatRepositories.create(data);
      if (!result) {
        throw new Error(`Could not create chat`);
      }
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Create Chat success!",
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
  getAll: async (req: AuthRequest, res: Response) => {
    try {
      const myId = req.authUser.id;

      const chat = await chatRepositories.getAll(myId);
      if (!chat) {
        throw new Error("Could not find chat");
      }
      
      responseApi(res, 200, {
        success: true,
        response: {
          message: "Create Unit success!",
          data: chat,
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
export default chatController;
