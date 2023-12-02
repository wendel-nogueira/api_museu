import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ArtViewModel } from "../dto/ArtViewModel";

export class ArtController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const prisma = new PrismaClient();
        const result = await prisma.$queryRaw`SELECT * FROM busca_obra` as any[];
        const art = ArtViewModel.toViewModel(result[0]);

        return res.status(200).json(art);
    }
}

