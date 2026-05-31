-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseEnrollment" DROP CONSTRAINT "CourseEnrollment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Mark" DROP CONSTRAINT "Mark_studentId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherCourse" DROP CONSTRAINT "TeacherCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherCourse" DROP CONSTRAINT "TeacherCourse_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseEnrollment" ADD CONSTRAINT "CourseEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCourse" ADD CONSTRAINT "TeacherCourse_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCourse" ADD CONSTRAINT "TeacherCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
