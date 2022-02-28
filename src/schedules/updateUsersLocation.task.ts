import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/models/users.schema";
import { SessionDocument } from "src/models/sessions.schema";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import * as axios from "axios";

@Injectable()
export class UpdateUsersLocationTask {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        @InjectModel("Session") private readonly SessionModel: Model<SessionDocument>,
        @InjectModel("User") private readonly UserModel: Model<UserDocument>,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE, { name: "updateUsersLocation", timeZone: "Asia/Tehran" })
    async job(): Promise<string | void> {
        const session = await this.SessionModel.findOne({ expireAt: { $gt: new Date(Date.now()) }, location: "unknown" }).exec();
        if (!session) return;

        await axios.default.get(`https://api.ipgeolocation.io/ipgeo?ip=${session.ip}&apiKey=${process.env.IP_GEO_API_KEY}`).then(async (results) => {
            if (typeof results.data.country_name === "undefined") return;
            await this.SessionModel.updateOne({ _id: session._id }, { location: `${results.data.country_name}_${results.data.city}` }).exec();
        });
    }
}
