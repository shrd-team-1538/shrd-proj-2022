import * as express from "express";
import { AuthenticatedReq } from "..";
import { Repository } from "typeorm";
import { Post } from "../entity/Post";
import { Device } from "../entity/Device";

export class PostRouter {
  public static async get(
    req: express.Request,
    res: express.Response,
    repo: Repository<Post>
  ) {
    try {
      const post = await repo.findOne({
        where: {
          id: +req.params.id,
        },
        relations: {
          user: true,
          device: true,
        },
        select: {
          user: {
            password: false,
            posts: true,
            id: true,
            name: true,
          },
        },
      });
      if (!post) return res.status(404).end();
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
  public static async post(
    req: AuthenticatedReq,
    res: express.Response,
    deviceRepo: Repository<Device>,
    postRepo: Repository<Post>
  ) {
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
  public static async put(
    req: AuthenticatedReq,
    res: express.Response,
    repo: Repository<Post>
  ) {
    const user = req.user;
    if (!user) return res.status(401).end();
    try {
      const post = await repo.findOne({
        where: {
          user: user,
          id: +req.params.id,
        },
      });
      if (!post) return res.status(404).end();
      post.name = req.body.name || post.name;
      post.text = req.body.text || post.text;
      await repo.save(post);
      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
  public static async delete(
    req: AuthenticatedReq,
    res: express.Response,
    repo: Repository<Post>
  ) {
    const user = req.user;
    if (!user) return res.status(401).end();
    try {
      const post = await repo.findOne({
        where: {
          user: user,
          id: +req.params.id,
        },
      });
      if (!post) return res.status(404).end();
      await repo.remove(post);
      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}
