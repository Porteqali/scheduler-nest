import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/models/users.schema";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { AnalyticsDocument } from "src/models/analytics.schema";
import * as moment from "moment";

@Injectable()
export class ClearAnalyticsDataTask {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        @InjectModel("User") private readonly UserModel: Model<UserDocument>,
        @InjectModel("Analytic") private readonly AnalyticModel: Model<AnalyticsDocument>,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: "clearAnalyticsData", timeZone: "Asia/Tehran" })
    async job(): Promise<string | void> {
        const timeLimit = moment().subtract(5, "years").toDate();
        await this.AnalyticModel.deleteMany({ createdAt: { $lt: timeLimit }, type: "daily" })
            .limit(500)
            .exec();
    }
}
