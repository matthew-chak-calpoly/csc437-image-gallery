import { getEnvVar } from "./getEnvVar.js";
import bcrypt from "bcrypt";

export class CredentialsProvider {
  constructor(mongoClient) {
    this.mongoClient = mongoClient;
    const collectionName = getEnvVar("CREDS_COLLECTION_NAME");
    const usersCollectionName = getEnvVar("USERS_COLLECTION_NAME");

    this.collection = this.mongoClient.db().collection(collectionName);
    this.usersCollection = this.mongoClient.db().collection(usersCollectionName);
  }

  async registerUser(username, email, password) {
    const existingUser = await this.usersCollection.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return false;
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    await this.collection.insertOne({
      username,
      password: hashed,
    });

    await this.usersCollection.insertOne({
      username,
      email,
    });

    return true;
  }

  async verifyPassword(username, password) {
    const credentials = await this.collection.findOne({ username });

    if (!credentials) {
      return false;
    }

    return await bcrypt.compare(password, credentials.password);
  }
}