import { ObjectId } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";

export class ImageProvider {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
    const collectionName = getEnvVar("IMAGES_COLLECTION_NAME");
    this.collection = this.mongoClient.db().collection(collectionName);
  }

  _denormalizeAuthorStages() {
    const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");

    return [
      {
        $lookup: {
          from: usersCollectionName,
          localField: "authorId",
          foreignField: "username",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $unset: "authorId" },
    ];
  }

  getAllImages() {
    return this.collection.aggregate(this._denormalizeAuthorStages()).toArray();
  }

  async getImageById(id) {
    if (!ObjectId.isValid(id)) return null;

    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      ...this._denormalizeAuthorStages(),
    ];

    return await this.collection.aggregate(pipeline).next();
  }

  async renameImage(id, newName, username) {
    if (!ObjectId.isValid(id)) return false;

    const objectId = new ObjectId(id);

    const result = await this.collection.updateOne(
      {
        _id: objectId,
        authorId: username   // verify ownership here
      },
      {
        $set: { name: newName.trim() }
      }
    );

    return result.matchedCount > 0;
  }

  async createImage(src, name, authorId) {
    const trimmedName = typeof name === "string" ? name.trim() : "";

    const result = await this.collection.insertOne({
      src,
      name: trimmedName,
      authorId,
    });

    return result.insertedId.toString();
  }
}