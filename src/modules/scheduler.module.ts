import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SessionSchema } from "src/models/sessions.schema";
import { UserCourseSchema } from "src/models/userCourses.schema";
import { UserSchema } from "src/models/users.schema";
import { CancelPaymentStatusTask } from "src/schedules/cancelPaymentStatus.task";
import { VerificationCodeTask } from "src/schedules/clearVerificationCode.task";
import { TestTask } from "src/schedules/test.task";
import { UpdateUsersLocationTask } from "src/schedules/updateUsersLocation.task";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "User", schema: UserSchema },
            { name: "Session", schema: SessionSchema },
            { name: "UserCourse", schema: UserCourseSchema },
        ]),
    ],
    controllers: [],
    providers: [TestTask, VerificationCodeTask, CancelPaymentStatusTask, UpdateUsersLocationTask],
    exports: [],
})
export class SchedulerModule {}
