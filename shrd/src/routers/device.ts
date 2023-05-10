import * as express from "express";
import { AuthenticatedReq } from "..";
import { Repository } from "typeorm";
import { Device } from "../entity/Device";
export class DeviceRouter {
    public static async get(req: express.Request, res: express.Response, repo: Repository<Device>) {
        const device = await repo.findOne({
            where: {
              id: Number(req.params.id),
            },
            relations: {
              posts: true,
              questions: true,
            },
          });
          if (!device) return res.status(404).end();
          res.status(200).json(device);
    }
    public static async post(req: AuthenticatedReq, res: express.Response, repo: Repository<Device>) {
        const device = new Device();
        device.name = req.body.name;
        device.description = req.body.description;
        const result = await repo.save(device);
        if (!result) return res.status(500).end();
        res.status(201).end();
    }
    public static async put(req: AuthenticatedReq, res: express.Response, repo: Repository<Device>) {
        
    }
    public static async delete(req: AuthenticatedReq, res: express.Response) {

    }
}