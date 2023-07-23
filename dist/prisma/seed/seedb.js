"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const faker_1 = require("@faker-js/faker");
const index_1 = __importDefault(require("./../index"));
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    // Generate categories
    const categories = [];
    for (let i = 0; i < 5; i++) {
        const category = yield (index_1.default === null || index_1.default === void 0 ? void 0 : index_1.default.courseCategory.create({
            data: {
                name: faker_1.faker.lorem.words(),
                description: faker_1.faker.lorem.sentences(),
            },
        }));
        categories.push(category);
    }
    // Generate users
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
    // 		},
    // 		include: {
    // 			completed_course_modules: {
    // 				include: { course: { include: { module: true } } },
    // 			},
    // 		},
    // 	});
    // 	users.push(user);
    // }
    // // Generate courses
    const courses = [];
    // Generate course modules
    const modules = [1, 2, 3, 4, 4, 34].map(() => ({
        id: faker_1.faker.number.int(),
        name: faker_1.faker.lorem.words(),
        title: faker_1.faker.lorem.sentence(),
        content: faker_1.faker.lorem.paragraph(),
        video_url: faker_1.faker.internet.url(),
        photo_url: faker_1.faker.image.url(),
        createdAt: faker_1.faker.date.past(),
        updatedAt: faker_1.faker.date.anytime(),
    }));
    for (let i = 0; i < 15; i++) {
        const s_modules = faker_1.faker.helpers.arrayElements(modules, 3);
        const course = yield index_1.default.course.create({
            data: {
                title: faker_1.faker.lorem.sentence(),
                about: faker_1.faker.lorem.paragraph(),
                picture_url: faker_1.faker.image.url(),
                icon_url: faker_1.faker.image.url(),
                rating: faker_1.faker.number.int({ min: 1, max: 5 }),
                instructor: faker_1.faker.person.fullName(),
                category: {
                    connect: { id: faker_1.faker.helpers.arrayElement(categories).id },
                },
                // category_id:
                module: {
                    // connectOrCreate: { id: faker.helpers.arrayElement(s_modules).id },
                    create: {
                        name: faker_1.faker.lorem.words(),
                        title: faker_1.faker.lorem.sentence(),
                        content: faker_1.faker.lorem.paragraph(),
                        video_url: faker_1.faker.internet.url(),
                        photo_url: faker_1.faker.image.url(),
                    },
                },
            },
            // include: { module: true },
        });
        // Generate course modules
        // const modules: {
        // 	id: number;
        // 	name: string;
        // 	title: string;
        // 	content: string;
        // 	course_id: number;
        // 	video_url: string;
        // 	photo_url: string;
        // 	createdAt: Date;
        // 	updatedAt: Date;
        // }[] = [];
        // 	for (let j = 0; j < 10; j++) {
        // 		const module = await prisma.courseModule.create({
        // 			data: {
        // 				name: faker.lorem.words(),
        // 				title: faker.lorem.sentence(),
        // 				content: faker.lorem.paragraph(),
        // 				video_url: faker.internet.url(),
        // 				photo_url: faker.image.url(),
        // 				course: { connect: { id: course.id } },
        // 			},
        // 			// select: {},
        // 		});
        // 		modules.push(module);
        // 	}
        // 	course.module = modules;
        // 	courses.push(course);
    }
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
});
exports.seedDatabase = seedDatabase;
//# sourceMappingURL=seedb.js.map