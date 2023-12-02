import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { IReport } from "../interfaces/IReport";
import { relations } from "../utils/relations";

export class ReportController {
    public async handle(req: Request, res: Response): Promise<Response> {
        const { primaryTable, linkedTables } : IReport = req.body;

        if (!primaryTable || !linkedTables) {
            return res.status(400).json({ error: "Missing body parameter" });
        }

        const prisma = new PrismaClient();

        let primaryTableSelect: any = {};
        let primaryTableOrderBy: any = [];
        let primaryTableWhere: any = {};
        const primaryTableRelationLinkKeys = Object.keys(relations[primaryTable.name]);

        primaryTableRelationLinkKeys.forEach((primaryTableRelationLinkKey: string) => {
            const field = (relations[primaryTable.name] as any)[primaryTableRelationLinkKey][0];

            primaryTableSelect[field] = true;
        });
        
        primaryTable.fields.forEach(field => {
            primaryTableSelect[field.name] = true;

            if (field.sort) {
                primaryTableOrderBy.push({
                    [field.name]: field.sort.toLowerCase()
                });
            }

            if (field.filter) {
                primaryTableWhere[field.name] = {
                    [field.filter.type.toLowerCase()]: field.filter.value
                }
            }
        });

        const primaryTableData = await (prisma[primaryTable.name as any] as any).findMany({
            select: primaryTableSelect,
            orderBy: primaryTableOrderBy,
            where: primaryTableWhere,
            take: primaryTable.limit
        });


        for (let i = 0; i < linkedTables.length; i++) {
            const linkedTable = linkedTables[i];
            const linkedTableRelationLinkKeys = Object.keys(relations[linkedTable.name]);
            const primaryTableRelationLinkKeys = Object.keys(relations[primaryTable.name]);
            const relationTableName = primaryTableRelationLinkKeys.filter(value => linkedTableRelationLinkKeys.includes(value))[0] as string;

            const relation = await (prisma[relationTableName as any] as any).findMany({
                where: {
                    [(relations[primaryTable.name] as any)[relationTableName][0]]: {
                        in: primaryTableData.map((primaryTableDataItem: any) => primaryTableDataItem[(relations[primaryTable.name] as any)[relationTableName][0]])
                    }
                }
            });

            const linkedTableSelect: any = {};
            let linkedTableOrderBy: any = [];
            let linkedTableWhere: any = {};

            linkedTableRelationLinkKeys.forEach((linkedTableRelationLinkKey: string) => {
                const field = (relations[linkedTable.name] as any)[linkedTableRelationLinkKey][0];

                linkedTableSelect[field] = true;
            });

            linkedTable.fields.forEach(field => {
                linkedTableSelect[field.name] = true;

                if (field.sort) {
                    linkedTableOrderBy.push({
                        [field.name]: field.sort.toLowerCase()
                    });
                }

                if (field.filter) {
                    linkedTableWhere[field.name] = {
                        [field.filter.type.toLowerCase()]: field.filter.value
                    }
                }
            });

            const linkedTableData = await (prisma[linkedTable.name as any] as any).findMany({
                select: linkedTableSelect,
                orderBy: linkedTableOrderBy,
                where: linkedTableWhere,
                take: linkedTable.limit
            });

            primaryTableData.forEach((primaryTableDataItem: any) => {
                const relationIds = relation.filter((relationItem: any) => relationItem[(relations[primaryTable.name] as any)[relationTableName][0]] === primaryTableDataItem[(relations[primaryTable.name] as any)[relationTableName][0]]).map((relationItem: any) => relationItem[(relations[primaryTable.name] as any)[relationTableName][1]]);

                primaryTableDataItem[relationTableName] = linkedTableData.filter((linkedTableDataItem: any) => relationIds.includes(linkedTableDataItem[(relations[linkedTable.name] as any)[relationTableName][0]]));
            });
        }

        return res.json(primaryTableData);
    }
}