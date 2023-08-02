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
const index_1 = __importDefault(require("./index"));
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const NUM_OF_COURSES = 13;
    const NUM_OF_USERS = 4;
    const NUM_OF_CATEGORIES = 3;
    const categories = [];
    for (let i = 0; i < NUM_OF_CATEGORIES; i++) {
        const category = yield (index_1.default === null || index_1.default === void 0 ? void 0 : index_1.default.courseCategory.create({
            data: {
                name: faker_1.faker.lorem.words(),
                description: faker_1.faker.lorem.sentences(),
            },
        }));
        categories.push(category);
    }
    const modules = [];
    const courses = [];
    for (let i = 0; i < NUM_OF_COURSES; i++) {
        const course = yield index_1.default.course.create({
            data: {
                title: faker_1.faker.lorem.sentence(),
                about: faker_1.faker.lorem.paragraph(),
                cover_photo: faker_1.faker.image.url(),
                profile_photo: faker_1.faker.image.url(),
                required_user_level: faker_1.faker.number.int({ min: 1, max: 10 }),
                rating: faker_1.faker.number.int({ min: 1, max: 5 }),
                instructor: faker_1.faker.person.fullName(),
                category: {
                    connect: { id: faker_1.faker.helpers.arrayElement(categories).id },
                },
            },
            include: { module: true },
        });
        for (let j = 0; j < 3; j++) {
            const module = yield index_1.default.courseModule.create({
                data: {
                    name: faker_1.faker.lorem.words(),
                    title: faker_1.faker.lorem.sentence(),
                    content: faker_1.faker.lorem.paragraph(),
                    video_url: faker_1.faker.internet.url(),
                    profile_photo: faker_1.faker.internet.url(),
                    cover_photo: faker_1.faker.image.url(),
                    course: { connect: { id: course.id } },
                },
            });
            modules.push(module);
        }
        course.module = modules;
        courses.push(course);
    }
    for (let i = 0; i < NUM_OF_USERS; i++) {
        const user = yield index_1.default.user.create({
            data: {
                username: faker_1.faker.internet.userName(),
                email: faker_1.faker.internet.email(),
                profile_photo: faker_1.faker.internet.url(),
                cover_photo: faker_1.faker.image.url(),
                password: faker_1.faker.internet.password(),
                level: faker_1.faker.number.int({ min: 1, max: 10 }),
            },
        });
    }
});
exports.seedDatabase = seedDatabase;
(0, exports.seedDatabase)()
    .then(() => {
    console.log("Database seeded successfully");
})
    .catch((error) => {
    console.error(`Error seeding database: ${error}`);
});
//# sourceMappingURL=seedb.js.map