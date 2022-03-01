import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AnalyticsSchema } from "src/models/analytics.schema";
import { CourseAnalyticSchema } from "src/models/courseAnalytics.schema";
import { SessionSchema } from "src/models/sessions.schema";
import { UserCourseSchema } from "src/models/userCourses.schema";
import { UserSchema } from "src/models/users.schema";
import { CancelPaymentStatusTask } from "src/schedules/cancelPaymentStatus.task";
import { ClearCourseAnalyticsTask } from "src/schedules/clearCourseAnalytics.task";
import { VerificationCodeTask } from "src/schedules/clearVerificationCode.task";
import { TestTask } from "src/schedules/test.task";
import { UpdateUsersLocationTask } from "src/schedules/updateUsersLocation.task";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: "User", schema: UserSchema },
            { name: "Session", schema: SessionSchema },
            { name: "UserCourse", schema: UserCourseSchema },
            { name: "CourseAnalytic", schema: CourseAnalyticSchema },
            { name: "Analytic", schema: AnalyticsSchema },
        ]),
    ],
    controllers: [],
    providers: [TestTask, VerificationCodeTask, CancelPaymentStatusTask, UpdateUsersLocationTask, ClearCourseAnalyticsTask],
    exports: [],
})
export class SchedulerModule {}
