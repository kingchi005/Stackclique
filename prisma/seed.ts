import { faker, tr } from "@faker-js/faker";
import prisma from "./index";

export const seedDatabase = async () => {
	const NUM_OF_COURSES = 13;
	const NUM_OF_USERS = 10;
	const NUM_OF_CATEGORIES = 3;
	const NUM_OF_CHANNELS = 5;
	const NUM_OF_CHATS_EACH = 4;
	// Generate categories
	const categories = await seedCourseCategory();
	const users = await seedUser();
	await seedCourseAndCategories();
	await seedChannelAndChats();

	async function seedCourseCategory() {
		const categories: any[] = [];
		for (let i = 0; i < NUM_OF_CATEGORIES; i++) {
			const category = await prisma?.courseCategory.create({
				data: {
					name: faker.lorem.words(),
					description: faker.lorem.sentences(),
				},
			});
			categories.push(category);
		}

		return categories;
	}

	async function seedCourseAndCategories() {
		const courses: any[] = [];
		const modules: any[] = [];

		for (let i = 0; i < NUM_OF_COURSES; i++) {
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
	}

	async function seedUser() {
		const users: {
			id: string;
			username: string;
			email: string | null;
			password: string;
			profile_photo: string | null;
			cover_photo: string | null;
			role: string | null;
			level: number;
			created_at: Date;
			updated_at: Date;
		}[] = [];
		for (let i = 0; i < NUM_OF_USERS; i++) {
			const user = await prisma.user.create({
				data: {
					username: faker.internet.userName(),
					email: faker.internet.email(),
					profile_photo: faker.internet.url(),
					cover_photo: faker.image.url(),
					password: faker.internet.password(),
					level: faker.number.int({ min: 1, max: 10 }),
				},
			});
			users.push(user);
		}
		return users;
	}

	async function seedChannelAndChats() {
		const channels: any[] = [];
		const chats: any[] = [];

		for (let i = 0; i < NUM_OF_CHANNELS; i++) {
			const channel = await prisma.channel.create({
				data: {
					description: faker.lorem.paragraph(),
					name: faker.lorem.words(),
					required_user_level: faker.number.int({ min: 1, max: 10 }),
					profile_photo: faker.image.url(),
					admin_id: users[0].id,
					members: {
						connect: [
							{ id: users[0].id },
							{ id: users[1].id },
							{ id: users[2].id },
							{ id: users[3].id },
							{ id: users[4].id },
						],
					},
				},
				include: { members: true },
			});

			for (let j = 0; j < NUM_OF_CHATS_EACH; j++) {
				const chat = await prisma.chatMessage.create({
					data: {
						message: faker.lorem.paragraph(),
						channel: { connect: { id: channel.id } },
						sender: { connect: { id: users[faker.number.int({ max: i })].id } },
					},
					// select: {},
				});
				chats.push(chat);
			}
			channel.members = chats;
			channels.push(channel);
		}
	}
};

seedDatabase()
	.then(() => {
		console.log("Database seeded successfully");
		prisma.$disconnect();
	})
	.catch((error: any) => {
		console.log(error);

		console.error(`Error seeding database: ${error}`);
		// prisma.$disconnect();
	});
