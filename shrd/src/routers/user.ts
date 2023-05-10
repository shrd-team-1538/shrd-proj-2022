import { Repository } from "typeorm";
import { AuthenticatedReq } from "..";
import * as express from "express";
import { User } from "../entity/User";
import { Password, JWT, HashedPassword } from "../entity/User";

export class UserRouter {
  public static async get(
    req: express.Request,
    res: express.Response,
    repo: Repository<User>
  ): Promise<unknown> {
    const user = await repo.findOne({
      relations: {
        posts: true,
      },
      where: {
        id: Number(req.params.id),
      },
    });

    if (!user) return res.status(404).end();
    res.status(200).json({
      id: user.id,
      name: user.name,
      posts: user.posts,
    });
  }
  public static async create(
    req: express.Request,
    res: express.Response,
    repo: Repository<User>
  ): Promise<unknown> {
    // TODO: Validate
    const exists = await repo.findOne({
      where: {
        name: req.body.name,
      },
    });

    if (exists) return res.status(409).end();

    const pwd = new Password(req.body.password);

    const user = new User();
    user.name = req.body.name;
    user.password = pwd.hashed;

    await repo.save(user);

    const jwt = new JWT(
      {
        id: user.id,
      },
      process.env.JWT_KEY || "secret"
    );

    res.status(201).json({
      token: jwt.token,
    });
  }

  public static async login(
    req: express.Request,
    res: express.Response,
    repo: Repository<User>
  ): Promise<unknown> {
    const found = await repo.findOne({
      where: {
        name: req.body.name,
      },
    });
    if (!found) return res.status(404).end();

    const hashed = new HashedPassword(found.password);

    const ok = hashed.compare(req.body.password);

    if (!ok) return res.status(401).end();
    const token = new JWT(
      {
        id: found.id,
      },
      process.env.JWT_KEY || "secret"
    );
    res.status(200).json({
      token: token.token,
    });
  }
  public static async put(
    req: AuthenticatedReq,
    res: express.Response,
    repo: Repository<User>
  ): Promise<unknown> {
    const user = req.user;
    if (!user) return res.status(401).end();
    user.name = req.body.name || user.name;
    user.password = req.body.password
      ? new Password(req.body.password).hashed
      : user.password;
    const newUser = await repo.save(user);
    if (!newUser) return res.status(500).end();
    res.status(204).end();
  }
  public static async delete(
    req: AuthenticatedReq,
    res: express.Response,
    repo: Repository<User>
  ): Promise<unknown> {
    const user = req.user;
    if (!user) return res.status(401).end();
    const { affected } = await repo.delete(user);
    if (!affected) return res.status(500).end();
    res.status(200).end();
  }
}
