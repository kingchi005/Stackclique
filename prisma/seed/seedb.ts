import { faker, tr } from "@faker-js/faker";
import prisma from "./../index";
import { GetResult } from "@prisma/client/runtime/library";

export const seedDatabase = async () => {
	// Generate categories
	// const categories: {
	// 	id: number;
	// 	name: string;
	// 	description: string;
	// 	createdAt: Date;
	// 	updatedAt: Date;
	// }[] = [];
	// for (let i = 0; i < 5; i++) {
	// 	const category = await prisma?.courseCategory.create({
	// 		data: {
	// 			name: faker.lorem.words(),
	// 			description: faker.lorem.sentences(),
	// 		},
	// 	});
	// 	categories.push(category);
	// }
	// const courses = await prisma.course.findMany();
	// // Generate users
	// const users: {
	// 	id: string;
	// 	username: string;
	// 	email: string;
	// 	password: string;
	// 	level: number;
	// 	createdAt: Date;
	// 	updatedAt: Date;
	// 	completed_course_modules: {
	// 		id: number;
	// 		name: string;
	// 		title: string;
	// 		content: string;
	// 		course_id: number;
	// 		video_url: string;
	// 		photo_url: string;
	// 		createdAt: Date;
	// 		updatedAt: Date;
	// 	}[];
	// }[] = [];
	// for (let i = 0; i < 50; i++) {
	// 	const user = await prisma.user.create({
	// 		data: {
	// 			username: faker.internet.userName(),
	// 			email: faker.internet.email(),
	// 			password: faker.internet.password(),
	// 			level: faker.number.int({ min: 1, max: 10 }),
	// 			enrolled_courses: {
	// 				connect: { id: faker.helpers.arrayElement(courses).id },
	// 			},
	// 		},
	// 	});
	// 	// users.push(user);
	// }
	// // Generate courses
	// const courses: {
	// 	id: number;
	// 	title: string;
	// 	about: string;
	// 	picture_url: string;
	// 	icon_url: string;
	// 	rating: number;
	// 	instructor: string;
	// 	category_id: number;
	// 	createdAt: Date;
	// 	updatedAt: Date;
	// 	module: {
	// 		id: number;
	// 		name: string;
	// 		title: string;
	// 		content: string;
	// 		course_id: number;
	// 		video_url: string;
	// 		photo_url: string;
	// 		createdAt: Date;
	// 		updatedAt: Date;
	// 	}[];
	// }[] = [];
	// // Generate course modules
	// const modules: {
	// 	id: number;
	// 	name: string;
	// 	title: string;
	// 	content: string;
	// 	course_id?: number;
	// 	video_url: string;
	// 	photo_url: string;
	// }[] = [1, 2, 3, 4, 4, 34].map(() => ({
	// 	id: faker.number.int(),
	// 	name: faker.lorem.words(),
	// 	title: faker.lorem.sentence(),
	// 	content: faker.lorem.paragraph(),
	// 	video_url: faker.internet.url(),
	// 	photo_url: faker.image.url(),
	// 	createdAt: faker.date.past(),
	// 	updatedAt: faker.date.anytime(),
	// }));
	// for (let i = 0; i < 15; i++) {
	// 	const s_modules = faker.helpers.arrayElements(modules, 3);
	// 	const course = await prisma.course.create({
	// 		data: {
	// 			title: faker.lorem.sentence(),
	// 			about: faker.lorem.paragraph(),
	// 			picture_url: faker.image.url(),
	// 			icon_url: faker.image.url(),
	// 			rating: faker.number.int({ min: 1, max: 5 }),
	// 			instructor: faker.person.fullName(),
	// 			category: {
	// 				connect: { id: faker.helpers.arrayElement(categories).id },
	// 			},
	// 			// category_id:
	// 			module: {
	// 				// connectOrCreate: { id: faker.helpers.arrayElement(s_modules).id },
	// 				create: {
	// 					name: faker.lorem.words(),
	// 					title: faker.lorem.sentence(),
	// 					content: faker.lorem.paragraph(),
	// 					video_url: faker.internet.url(),
	// 					photo_url: faker.image.url(),
	// 				},
	// 			},
	// 		},
	// 		// include: { module: true },
	// 	});
	// 	// Generate course modules
	// 	// const modules: {
	// 	// 	id: number;
	// 	// 	name: string;
	// 	// 	title: string;
	// 	// 	content: string;
	// 	// 	course_id: number;
	// 	// 	video_url: string;
	// 	// 	photo_url: string;
	// 	// 	createdAt: Date;
	// 	// 	updatedAt: Date;
	// 	// }[] = [];
	// 	// 	for (let j = 0; j < 10; j++) {
	// 	// 		const module = await prisma.courseModule.create({
	// 	// 			data: {
	// 	// 				name: faker.lorem.words(),
	// 	// 				title: faker.lorem.sentence(),
	// 	// 				content: faker.lorem.paragraph(),
	// 	// 				video_url: faker.internet.url(),
	// 	// 				photo_url: faker.image.url(),
	// 	// 				course: { connect: { id: course.id } },
	// 	// 			},
	// 	// 			// select: {},
	// 	// 		});
	// 	// 		modules.push(module);
	// 	// 	}
	// 	// 	course.module = modules;
	// 	// 	courses.push(course);
	// }
	// Associate users with courses
	// for (const user of users) {
	// 	const enrolledCourses = faker.helpers.arrayElements(courses, 3);
	// 	await prisma.user.update({
	// 		where: { id: user.id },
	// 		data: {
	// 			enrolled_courses: {
	// 				connect: enrolledCourses.map((course) => ({ id: course.id })),
	// 			},
	// 		},
	// 	});
	// }
};
