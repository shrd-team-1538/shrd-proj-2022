import { Repository } from "typeorm";
import express from "express";
import { Question } from "../entity/Question";
import { AuthenticatedReq } from "..";
import { Device } from "../entity/Device";
import { Answer } from "../entity/Answer";

export class QuestionRouter {
  public static async get(
    req: express.Request,
    res: express.Response,
    repo: Repository<Question>
  ) {
    try {
      const question = await repo.findOne({
        where: {
          id: +req.params.id,
        },
        select: {
          user: {
            password: false,
            id: true,
            name: true,
          },
          answers: {
            user: {
              password: false
            }
          }
        },
        relations: {
          user: true,
          answers: {
            user: true,
          },
        },
      });
      if (!question) return res.status(404).end();
      res.status(200).json(question);
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }

  public static async post(
    req: AuthenticatedReq,
    res: express.Response,
    repo: Repository<Question>,
    deviceRepo: Repository<Device>
  ) {
    const user = req.user;
    if (!user) return res.status(401).end();
    try {
      const device = await deviceRepo.findOneBy({ id: +req.body.deviceId });
      if (!device) return res.status(404).end();
      const question = new Question();
      question.user = user;
      question.device = device;
      question.text = req.body.text;
      question.createdAt = new Date(Date.now());
      await repo.save(question);
      res.status(201).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }

  public static async put(
    req: AuthenticatedReq,
    res: express.Response,
    repo: Repository<Question>
  ) {
    const user = req.user;
    if (!user) return res.status(401).end();
    try {
      const question = await repo.findOneBy({ id: +req.params.id });
      if (!question) return res.status(404).end();
      question.name = req.body.name || question.name;
      question.text = req.body.text || question.text;
      await repo.save(question);
      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }

  public static async delete(
    req: AuthenticatedReq,
    res: express.Response,
    repo: Repository<Question>
  ) {
    const user = req.user;
    if (!user) return res.status(401).end();
    try {
      const question = await repo.findOneBy({ id: +req.params.id });
      if (!question) return res.status(404).end();
      await repo.remove(question);
      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }

  public static async mostPopularForLastWeek(req: express.Request, res: express.Response, repo: Repository<Question>) {
    try {
      const today = new Date();
      const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
      const qb = repo.createQueryBuilder("question");
      const questions = await qb
        .leftJoin("question.user", "user")
        .addSelect(["user.id", "user.name"])
        .leftJoinAndSelect("question.answers", "answer")
        .leftJoin("answer.user", "answersUser")
        .addSelect(["answersUser.id", "answersUser.name"])
        .where("question.createdAt >= :lastWeek", {
          lastWeek: weekAgo
        })
        .take(10)
        .getMany()
      console.log(questions);
      questions.sort((a, b) => {
        return a.answers > b.answers ? -1 : 1;
      });
      res.status(200).json(questions);
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}
