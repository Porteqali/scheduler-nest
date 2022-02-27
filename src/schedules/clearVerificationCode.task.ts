import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/models/users.schema";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import * as moment from "moment";

@Injectable()
export class VerificationCodeTask {
    constructor(private schedulerRegistry: SchedulerRegistry, @InjectModel("User") private readonly UserModel: Model<UserDocument>) {}

    @Cron(CronExpression.EVERY_MINUTE, { name: "clearVerificationCode", timeZone: "Asia/Tehran" })
    async job(): Promise<string | void> {
        const time = moment().subtract(5, "minutes").toDate();

        let findUsersQuery = this.UserModel.find({
            verficationCodeSentAt: { $lt: time },
        });
        findUsersQuery.limit(1000);
        const users = await findUsersQuery.exec();

        for (let i = 0; i < users.length; i++) {
            await this.UserModel.updateOne(
                { _id: users[i]._id },
                {
                    emailVerificationCode: null,
                    mobileVerificationCode: null,
                    verficationCodeSentAt: null,
                },
            ).exec();
        }
    }
}
