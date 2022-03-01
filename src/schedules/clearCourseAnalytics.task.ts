import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SessionDocument } from "src/models/sessions.schema";
import { UserDocument } from "src/models/users.schema";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CourseAnalyticDocument } from "src/models/courseAnalytics.schema";

@Injectable()
export class ClearCourseAnalyticsTask {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        @InjectModel("User") private readonly UserModel: Model<UserDocument>,
        @InjectModel("CourseAnalytic") private readonly CourseAnalyticModel: Model<CourseAnalyticDocument>,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { name: "clearCourseAnalyticsDaily", timeZone: "Asia/Tehran" })
    async job(): Promise<string | void> {
        const courseAnalytics = await this.CourseAnalyticModel.find({ type: "today" }).select("course buyCount viewCount").exec();
        for (let i = 0; i < courseAnalytics.length; i++) {
            const courseAnalytic = courseAnalytics[i];
            // resrt todays data
            await this.CourseAnalyticModel.updateOne({ _id: courseAnalytic._id }, { buyCount: 0, viewCount: 0 }, { upsert: true }).exec();
            // transform today data to yesterdays
            await this.CourseAnalyticModel.updateOne(
                { course: courseAnalytic.course, type: "yesterday" },
                { buyCount: courseAnalytic.buyCount, viewCount: courseAnalytic.viewCount },
                { upsert: true },
            ).exec();
        }
    }

    @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, { name: "clearCourseAnalyticsMonthly", timeZone: "Asia/Tehran" })
    async job2(): Promise<string | void> {
        const courseAnalytics = await this.CourseAnalyticModel.find({ type: "current-month" }).select("course buyCount viewCount").exec();
        for (let i = 0; i < courseAnalytics.length; i++) {
            const courseAnalytic = courseAnalytics[i];
            // resrt current-month data
            await this.CourseAnalyticModel.updateOne({ _id: courseAnalytic._id }, { buyCount: 0, viewCount: 0 }, { upsert: true }).exec();
            // transform current-month data to last-month
            await this.CourseAnalyticModel.updateOne(
                { course: courseAnalytic.course, type: "last-month" },
                { buyCount: courseAnalytic.buyCount, viewCount: courseAnalytic.viewCount },
                { upsert: true },
            ).exec();
        }
    }
}
