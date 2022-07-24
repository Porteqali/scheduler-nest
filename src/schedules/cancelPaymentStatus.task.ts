import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/models/users.schema";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import * as moment from "moment";
import { UserCourseDocument } from "src/models/userCourses.schema";

@Injectable()
export class CancelPaymentStatusTask {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        @InjectModel("User") private readonly UserModel: Model<UserDocument>,
        @InjectModel("UserCourse") private readonly UserCourseModel: Model<UserCourseDocument>,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE, { name: "cancelPaymentStatusTask", timeZone: "Asia/Tehran" })
    async job(): Promise<string | void> {
        // TODO : this is commented for test
        // const time = moment().subtract(15, "minutes").toDate();

        // let findUserCoursesQuery = this.UserCourseModel.find({
        //     status: "waiting_for_payment",
        //     createdAt: { $lt: time },
        // });
        // findUserCoursesQuery.limit(500);
        // const userCourses = await findUserCoursesQuery.exec();

        // for (let i = 0; i < userCourses.length; i++) {
        //     await this.UserCourseModel.updateOne({ _id: userCourses[i]._id }, { status: "cancel" }).exec();
        // }
    }
}
