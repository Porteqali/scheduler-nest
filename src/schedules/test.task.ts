import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SessionDocument } from "src/models/sessions.schema";
import { UserDocument } from "src/models/users.schema";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class TestTask {
    constructor(private schedulerRegistry: SchedulerRegistry) {}

    @Cron(CronExpression.EVERY_MINUTE, { name: "test", timeZone: "Asia/Tehran" })
    async job(): Promise<string | void> {
        // console.log(1);
    }
}
