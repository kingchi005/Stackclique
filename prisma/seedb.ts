import { faker, tr } from "@faker-js/faker";
import prisma from "./index";
import { GetResult } from "@prisma/client/runtime/library";

export const seedDatabase = async () => {
	const NUM_OF_COURSES = 13;
	const NUM_OF_USERS = 4;
	const NUM_OF_CATEGORIES = 3;
	// Generate categories
	const categories = [];
	for (let i = 0; i < NUM_OF_CATEGORIES; i++) {
		const category = await prisma?.courseCategory.create({
			data: {
				name: faker.lorem.words(),
				description: faker.lorem.sentences(),
			},
		});
		categories.push(category);
	}

	const modules = [];

	const courses = [];

	for (let i = 0; i < NUM_OF_COURSES; i++) {
		// const s_modules = faker.helpers.arrayElements(modules, 3);

		const course = await prisma.course.create({
			data: {
				title: faker.lorem.sentence(),
				about: faker.lorem.paragraph(),
				cover_photo: faker.image.url(),
				profile_photo: faker.image.url(),
				required_user_level: faker.number.int({ min: 1, max: 10 }),
				rating: faker.number.int({ min: 1, max: 5 }),
				instructor: faker.person.fullName(),
				category: {
					connect: { id: faker.helpers.arrayElement(categories).id },
				},
				// category_id:
				// module: {
				// 	// connectOrCreate: { id: faker.helpers.arrayElement(s_modules).id },
				// 	create: {
				// 		name: faker.lorem.words(),
				// 		title: faker.lorem.sentence(),
				// 		content: faker.lorem.paragraph(),
				// 		video_url: faker.internet.url(),
				// 		photo_url: faker.image.url(),
				// 	},
				// },
			},
			include: { module: true },
		});

		for (let j = 0; j < 3; j++) {
			const module = await prisma.courseModule.create({
				data: {
					name: faker.lorem.words(),
					title: faker.lorem.sentence(),
					content: faker.lorem.paragraph(),
					video_url: faker.internet.url(),
					profile_photo: faker.internet.url(),
					cover_photo: faker.image.url(),
					course: { connect: { id: course.id } },
				},
				// select: {},
			});
			modules.push(module);
		}
		course.module = modules;
		courses.push(course);
	}
	// const courses = await prisma.course.findMany();

	for (let i = 0; i < NUM_OF_USERS; i++) {
		const user = await prisma.user.create({
			data: {
				username: faker.internet.userName(),
				email: faker.internet.email(),
				// phone_number: faker.phone.number("+234##########"),
				profile_photo: faker.internet.url(),
				cover_photo: faker.image.url(),
				password: faker.internet.password(),
				level: faker.number.int({ min: 1, max: 10 }),
			},
		});
		// users.push(user);
	}
};

seedDatabase()
	.then(() => {
		console.log("Database seeded successfully");
		// prisma.$disconnect();
	})
	.catch((error: any) => {
		console.error(`Error seeding database: ${error}`);
		// prisma.$disconnect();
	});
