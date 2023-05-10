import { AppDataSource } from "./data-source";
import { User, CreatedJWT } from "./entity/User";
import * as express from "express";
import { Post } from "./entity/Post";
// import { Question } from './entity/Question';
import { Repository } from "typeorm";
// import { Answer } from './entity/Answer';
import { Device } from "./entity/Device";
import { UserRouter } from "./routers/user";
import { DeviceRouter } from "./routers/device";

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
    // const questionRepo = AppDataSource.getRepository(Question);
    // const answerRepo = AppDataSource.getRepository(Answer);
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

    app.get("/api/posts/:id", async (req, res) => {
      const post = await postRepo.findOne({
        where: {
          id: Number(req.params.id),
        },
        relations: {
          device: true,
          user: true,
        },
      });

      if (post) return res.status(200).json(post);
      return res.status(404).end();
    });

    app.post(
      "/api/post",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        const user = req.user;
        if (!user) return res.status(401).end();
        const device = await deviceRepo.findOne({
          where: {
            id: Number(req.body.device),
          },
        });
        if (!device) res.status(400).end();
        const post = new Post();
        console.log(req.body);
        post.text = req.body.text;
        post.name = req.body.name;
        post.user = user;
        post.device = device;
        await postRepo.save(post);
        res.status(201).end();
      }
    );

    app.put(
      "/api/posts/:id",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        const user = req.user;
        if (!user) return res.status(401).end();
        const post = await postRepo.findOne({
          where: {
            id: +req.params.id,
            user: user,
          },
        });

        if (!post) res.status(404).end();

        post.text = req.body.text || post.text;
        post.name = req.body.name || post.name;
        const result = await postRepo.save(post);
        if (!result) res.status(500).end();

        res.status(204).end();
      }
    );

    app.delete(
      "/api/posts/:id",
      (req, res, next) => auth(req, res, next, userRepo),
      async (req: AuthenticatedReq, res) => {
        const user = req.user;
        if (!user) return res.status(401).end();
        const post = await postRepo.findOne({
          where: {
            id: +req.params.id,
            user: user,
          },
        });
        if (!post) res.status(404).end();
        const { affected } = await postRepo.delete(post);
        if (affected) return res.status(204).end();
        res.status(500).end();
      }
    );

    app.listen(80, () => {
      console.log("listening on port 80");
    });
  })
  .catch((error) => console.log(error));
