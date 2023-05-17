import { AppDataSource } from "./data-source";
import { User, CreatedJWT } from "./entity/User";
import express from "express";
import { Post } from "./entity/Post";
import { Question } from "./entity/Question";
import { Repository } from "typeorm";
import { Answer } from "./entity/Answer";
import { Device } from "./entity/Device";
import { UserRouter } from "./routers/user";
import { DeviceRouter } from "./routers/device";
import { PostRouter } from "./routers/post";
import { QuestionRouter } from "./routers/question";
import { AnswerRouter } from "./routers/answer";

export interface AuthenticatedReq extends express.Request {
  user?: User;
}

async function auth(
  req: AuthenticatedReq,
  res: express.Response,
  next: express.NextFunction,
  repo: Repository<User>
) {
  try {
    if (!req.headers.authorization) return res.status(400).end();
    if (req.headers.authorization.split(" ")[0] !== "Bearer") {
      return res.status(400).end();
    }
    const fromReq = req.headers.authorization.split(" ")[1];

    const token = new CreatedJWT(fromReq, process.env.JWT_KEY || "secret");

    const result = token.verify();
    if (result && typeof result !== "string") {
      const found = await repo.findOneBy({
        id: result.id,
      });
      if (!found) return res.status(401).end();
      req.user = found;
      return next();
    }
    res.status(401).end();
  } catch (error) {
    console.log(error);
    res.status(401).end();
  }
}

AppDataSource.initialize()
  .then(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const postRepo = AppDataSource.getRepository(Post);
    const questionRepo = AppDataSource.getRepository(Question);
    const answerRepo = AppDataSource.getRepository(Answer);
    const deviceRepo = AppDataSource.getRepository(Device);

    const app = express();

    app.use(express.json());

    app.get(
      "/api/users/:id",
      async (req, res) => await UserRouter.get(req, res, userRepo)
    );

    app.post(
      "/api/user",
      async (req, res) => await UserRouter.create(req, res, userRepo)
    );

    app.post(
      "/api/login",
      async (req, res) => await UserRouter.login(req, res, userRepo)
    );

    app.put(
      "/api/user",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) =>
        await UserRouter.put(req, res, userRepo)
    );

    app.delete(
      "/api/user",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) =>
        await UserRouter.delete(req, res, userRepo)
    );

    app.get("/api/devices/:id", async (req, res) => {
      await DeviceRouter.get(req, res, deviceRepo);
    });

    app.post(
      "/api/device",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await DeviceRouter.post(req, res, deviceRepo);
      }
    );

    app.put(
      "/api/devices/:id",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await DeviceRouter.put(req, res, deviceRepo);
      }
    );

    app.delete(
      "/api/devices/:id",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await DeviceRouter.delete(req, res, deviceRepo);
      }
    );

    app.get('/api/posts/new', async (req, res) =>{
      try {
        const result = await postRepo.createQueryBuilder("post")
          .leftJoin("post.user", "user")
          .addSelect(["user.name", "user.id"])
          .take(10)
          .orderBy("post.createdAt", "DESC")
          .getMany();
          if (result.length === 0) return res.status(404).end();
          res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).end();
      }
    });

    app.get("/api/posts/:id", async (req, res) => {
      await PostRouter.get(req, res, postRepo);
    });

    app.post(
      "/api/post",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await PostRouter.post(req, res, deviceRepo, postRepo);
      }
    );

    app.put(
      "/api/posts/:id",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await PostRouter.put(req, res, postRepo);
      }
    );

    app.delete(
      "/api/posts/:id",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await PostRouter.delete(req, res, postRepo);
      }
    );

    app.get("/api/questions/search",async (req, res) => {
      try {
        const qs: {q?: string} = req.query;
        if (!qs) return res.status(400).end();
        if (!qs.q) return res.status(400).end();
        const result = await questionRepo.createQueryBuilder("question")
          .where("question.name LIKE :q OR question.text LIKE :q", {q: `%${qs.q}%`})
          .leftJoin("question.user", "user")
          .addSelect(["user.name", "user.id"])
          .getMany();
        if (result.length === 0) return res.status(404).end();
        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).end();
      }
    })

    app.get('/api/questions/popular', async (req, res) => {
      await QuestionRouter.mostPopularForLastWeek(req, res, questionRepo);
    })

    app.get("/api/questions/:id", async (req, res) => {
      await QuestionRouter.get(req, res, questionRepo);
    });

    app.post(
      "/api/question",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await QuestionRouter.post(req, res, questionRepo, deviceRepo);
      }
    );

    app.put(
      "/api/questions/:id",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await QuestionRouter.put(req, res, questionRepo);
      }
    );

    app.delete(
      "/api/questions/:id",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await QuestionRouter.delete(req, res, questionRepo);
      }
    );

    app.get("/api/answers/:id", async (req, res) => {
      await AnswerRouter.get(req, res, answerRepo);
    });

    app.post(
      "/api/answer",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        await AnswerRouter.post(req, res, answerRepo, questionRepo);
      }
    );


    app.listen(80, () => {
      console.log("listening on port 80");
    });
  })
  .catch((error) => console.log(error));
