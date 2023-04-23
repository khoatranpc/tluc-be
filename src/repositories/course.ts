import { DB, DbCollections, getClient } from "../database";
import Cource from "../model/course";
import { ObjectId } from "bson";

const optionPipeline = (option) => {
  const pipelineFullAccess = [
    {
      $lookup: {
        from: "unit",
        localField: "unit",
        foreignField: "_id",
        as: "unit",
      },
    },
    {
      $unwind: {
        path: "$unit",
      },
    },
    {
      $lookup: {
        from: "lesson",
        localField: "unit.lesson",
        foreignField: "_id",
        as: "unit.lesson",
      },
    },
    {
      $lookup: {
        from: "user",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $group: {
        _id: "$_id",
        nameCourse: {
          $first: "$nameCourse",
        },
        author: {
          $first: {
            $first: "$author",
          },
        },
        unit: {
          $push: "$unit",
        },
        img: {
          $first: "$img",
        },
        level: {
          $first: "$level",
        },
        summaryCourse: {
          $first: "$summaryCourse",
        },
        videoThumbnail: {
          $first: "$videoThumbnail",
        },
        comment: {
          $first: "$comment",
        },
        createTime: {
          $first: "$createTime",
        },
        status: {
          $first: "$status",
        },
        enroll: {
          $first: "$enroll",
        },
        major: {
          $first: "$major",
        },
        lastModified: {
          $first: "$lastModified",
        },
      },
    },
    {
      $addFields: {
        previewUnit: {
          $map: {
            input: "$unit",
            as: "t",
            in: {
              _id: "$$t._id",
              unitName: "$$t.unitName",
              author: "$$t.author",
              lesson: {
                $map: {
                  input: "$$t.lesson",
                  as: "k",
                  in: {
                    _id: "$$k._id",
                    lessonName: "$$k.lessonName",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        nameCourse: 1,
        previewUnit: 1,
        author: {
          _id: 1,
          username: 1,
          img: 1,
          email: 1,
          phone: 1,
          createTime: 1,
          role: 1,
          status: 1,
        },
        unit: {
          _id: 1,
          unitName: 1,
          author: 1,
          createTime: 1,
          lastModified: 1,
          lesson: {
            _id: 1,
            lessonName: 1,
            type: 1,
            source: 1,
            author: 1,
            createTime: 1,
            lastModified: 1,
          },
        },
        img: 1,
        level: 1,
        summaryCourse: 1,
        videoThumbnail: 1,
        comment: 1,
        createTime: 1,
        status: 1,
        enroll: 1,
        major: 1,
        lastModified: 1,
      },
    },
  ];
  const pipeline = [
    {
      $lookup: {
        from: "unit",
        localField: "unit",
        foreignField: "_id",
        as: "unit",
      },
    },
    {
      $unwind: {
        path: "$unit",
      },
    },
    {
      $lookup: {
        from: "lesson",
        localField: "unit.lesson",
        foreignField: "_id",
        as: "unit.lesson",
      },
    },
    {
      $lookup: {
        from: "user",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $group: {
        _id: "$_id",
        nameCourse: {
          $first: "$nameCourse",
        },
        author: {
          $first: {
            $first: "$author",
          },
        },
        unit: {
          $push: "$unit",
        },
        img: {
          $first: "$img",
        },
        level: {
          $first: "$level",
        },
        summaryCourse: {
          $first: "$summaryCourse",
        },
        videoThumbnail: {
          $first: "$videoThumbnail",
        },
        comment: {
          $first: "$comment",
        },
        createTime: {
          $first: "$createTime",
        },
        status: {
          $first: "$status",
        },
        enroll: {
          $first: "$enroll",
        },
        major: {
          $first: "$major",
        },
        lastModified: {
          $first: "$lastModified",
        },
      },
    },
    {
      $addFields: {
        previewUnit: {
          $map: {
            input: "$unit",
            as: "t",
            in: {
              _id: "$$t._id",
              unitName: "$$t.unitName",
              author: "$$t.author",
              lesson: {
                $map: {
                  input: "$$t.lesson",
                  as: "k",
                  in: {
                    _id: "$$k._id",
                    lessonName: "$$k.lessonName",
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        nameCourse: 1,
        previewUnit: 1,
        author: {
          _id: 1,
          username: 1,
          img: 1,
          status: 1,
        },
        unit: [],
        img: 1,
        level: 1,
        summaryCourse: 1,
        videoThumbnail: 1,
        comment: 1,
        major: 1,
        createTime: 1,
        status: 1,
        enroll: 1,
        lastModified: 1,
      },
    },
  ];
  return option ? pipelineFullAccess : pipeline;
};
const courceRepositories = {
  create: async (cource: Cource) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.course);
    const result = await collection.insertOne(cource);
    client.close();
    return result;
  },
  getAll: async (option: boolean, id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.course);

    if (id) {
      const result = await collection
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          ...optionPipeline(option),
        ])
        .toArray();
      client.close();
      return result;
    } else {
      const result = await collection
        .aggregate(optionPipeline(option))
        .toArray();
      client.close();
      return result;
    }
  },
  getCourseDashboard: async () => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.course);

    const result = await collection
      .aggregate([
        {
          $project: {
            _id: 1,
            major: 1,
            level: 1,
            createTime: 1,
            status: 1,
          },
        },
        {
          $lookup: {
            from: "enroll",
            localField: "_id",
            foreignField: "idClass",
            as: "student",
          },
        },
      ])
      .toArray();
    client.close();
    return result;
  },
  getDrawCourse: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.course);
    const result = await collection.findOne({
      _id: new ObjectId(id),
    });
    client.close();
    return result;
  },
  addUnitToCourse: async (id: string, data: ObjectId) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.course);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          unit: data,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  delete: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.course);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    client.close();
    return result;
  },
};
export default courceRepositories;
