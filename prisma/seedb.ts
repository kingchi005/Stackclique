import { faker, tr } from "@faker-js/faker";
import prisma from "./index";
import { GetResult } from "@prisma/client/runtime/library";

export const seedDatabase = async () => {
	// Generate categories
	const categories = [];
	for (let i = 0; i < 5; i++) {
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

	for (let i = 0; i < 15; i++) {
		// const s_modules = faker.helpers.arrayElements(modules, 3);

		const course = await prisma.course.create({
			data: {
				title: faker.lorem.sentence(),
				about: faker.lorem.paragraph(),
				picture_url: faker.image.url(),
				icon_url: faker.image.url(),
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
					photo_url: faker.image.url(),
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

	for (let i = 0; i < 50; i++) {
		const user = await prisma.user.create({
			data: {
				username: faker.internet.userName(),
				email: faker.internet.email(),
				phone_number: faker.phone.number("+234##########"),
				password: faker.internet.password(),
				level: faker.number.int({ min: 1, max: 10 }),
				enrolled_courses: {
					connect: { id: faker.helpers.arrayElement(courses).id },
				},
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
