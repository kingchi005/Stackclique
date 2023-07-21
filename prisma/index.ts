import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// test/
(async () => {
	const user = await prisma.user.findFirst({
		where: {},
		select: {
			completed_course_modules: { select: {}, where: {} },
			enrolled_courses: { select: { module: true } },
		},
	});
	const courseCategory = await prisma.courseCategory.findFirst({
		where: {},
	});
	const course = await prisma.course.findFirst({});
	const courseReview = await prisma.courseReview.findFirst({
		where: {},
	});
	const courseModule = await prisma.courseModule.findFirst({
		where: {},
	});

	user?.enrolled_courses[1].module.length;
	user?.completed_course_modules;
})();

export default prisma;
