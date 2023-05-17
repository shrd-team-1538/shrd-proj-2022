import express from "express";
import { Repository } from "typeorm";
import { Answer } from "../entity/Answer";
import { AuthenticatedReq } from "..";
import { Question } from "../entity/Question";

export class AnswerRouter {
  public static async get(
    req: express.Request,
    res: express.Response,
    repo: Repository<Answer>
  ) {
    try {
      const answer = await repo.findOne({
        where: {
          id: +req.params.id,
        },
        relations: {
          question: true,
          user: true,
        },
        select: {
          user: {
            password: false
          },
          question: {
            user: {
              password: false
            }
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  public static async post(
    req: AuthenticatedReq,
    res: express.Response,
    repo: Repository<Answer>,
    questionRepo: Repository<Question>
  ) {
    const user = req.user;
    if (!user) return res.status(401).end();
    try {
      const question = await questionRepo.findOne({
        where: {
          id: req.body.questionId,
        },
      });
      if (!question) return res.status(404).end();
      const answer = new Answer();
      answer.question = question;
      answer.text = req.body.text;
      answer.user = user;
      await repo.save(answer);
      res.status(201).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }

  public static async put(req: AuthenticatedReq, res: express.Response, repo: Repository<Answer>) {
    const user = req.user;
    if (!user) return res.status(401).end();
    try {
      const answer = await repo.findOneBy({
        id: +req.params.id,
        user: user
      });
      if (!answer) return res.status(404).end();
      answer.text = req.body.text ||  answer.text;
      await repo.save(answer);
      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  } 

  public static async delete(req: AuthenticatedReq, res: express.Response, repo: Repository<Answer>) {
    const user = req.user;
    if (!user) return res.status(401).end();
    try {
      const answer = await repo.findOneBy({
        id: +req.params.id,
        user: user
      });
      if (!answer) return res.status(404).end();
      await repo.remove(answer);
      res.status(204).end();
    } catch (error) {
      console.log(error);
      res.status(500).end();
    }
  }
}
