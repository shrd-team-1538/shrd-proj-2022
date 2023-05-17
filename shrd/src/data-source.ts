import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Device } from "./entity/Device";
import { Post } from "./entity/Post";
import { Answer } from "./entity/Answer";
import { Question } from "./entity/Question";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "test",
  database: "test",
  synchronize: true,
  logging: false,
  entities: [User, Question, Post, Answer, Device],
  migrations: [],
  subscribers: [],
  charset: "UTF8_GENERAL_CI",
});
