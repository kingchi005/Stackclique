/*
  Warnings:

  - You are about to drop the `_CourseModuleToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToUser` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `CourseModule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `CourseModule` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `CourseModule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CourseModule` table. All the data in the column will be lost.
  - The primary key for the `CourseReview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `CourseReview` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CourseReview` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The primary key for the `UserEmailVerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `UserEmailVerificationToken` table. All the data in the column will be lost.
  - The primary key for the `CourseCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `CourseCategory` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CourseCategory` table. All the data in the column will be lost.
  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `icon_url` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `picture_url` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Course` table. All the data in the column will be lost.
  - Added the required column `cover_photo` to the `CourseModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_photo` to the `CourseModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `CourseModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `CourseReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `review_user_Id` to the `CourseReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `CourseReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `CourseCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cover_photo` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_photo` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_CourseModuleToUser_B_index";

-- DropIndex
DROP INDEX "_CourseModuleToUser_AB_unique";

-- DropIndex
DROP INDEX "_CourseToUser_B_index";

-- DropIndex
DROP INDEX "_CourseToUser_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CourseModuleToUser";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CourseToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CourseEnrollement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "course_id" TEXT NOT NULL,
    "enrolled_user_id" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completed_modules" INTEGER NOT NULL DEFAULT 0,
    "enrolled_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" DATETIME NOT NULL,
    CONSTRAINT "CourseEnrollement_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseEnrollement_enrolled_user_id_fkey" FOREIGN KEY ("enrolled_user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CourseModule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "video_url" TEXT NOT NULL,
    "cover_photo" TEXT NOT NULL,
    "profile_photo" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "CourseModule_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CourseModule" ("content", "course_id", "id", "name", "title", "video_url") SELECT "content", "course_id", "id", "name", "title", "video_url" FROM "CourseModule";
DROP TABLE "CourseModule";
ALTER TABLE "new_CourseModule" RENAME TO "CourseModule";
CREATE TABLE "new_CourseReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review_user_Id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "CourseReview_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CourseReview_review_user_Id_fkey" FOREIGN KEY ("review_user_Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CourseReview" ("course_id", "id", "text") SELECT "course_id", "id", "text" FROM "CourseReview";
DROP TABLE "CourseReview";
ALTER TABLE "new_CourseReview" RENAME TO "CourseReview";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "password" TEXT NOT NULL,
    "profile_photo" TEXT,
    "cover_photo" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("email", "id", "level", "password", "phone_number", "username") SELECT "email", "id", "level", "password", "phone_number", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");
CREATE TABLE "new_UserEmailVerificationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" DATETIME NOT NULL
);
INSERT INTO "new_UserEmailVerificationToken" ("email", "expiredAt", "id", "otp", "verified") SELECT "email", "expiredAt", "id", "otp", "verified" FROM "UserEmailVerificationToken";
DROP TABLE "UserEmailVerificationToken";
ALTER TABLE "new_UserEmailVerificationToken" RENAME TO "UserEmailVerificationToken";
CREATE UNIQUE INDEX "UserEmailVerificationToken_email_key" ON "UserEmailVerificationToken"("email");
CREATE TABLE "new_CourseCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_CourseCategory" ("description", "id", "name") SELECT "description", "id", "name" FROM "CourseCategory";
DROP TABLE "CourseCategory";
ALTER TABLE "new_CourseCategory" RENAME TO "CourseCategory";
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "profile_photo" TEXT NOT NULL,
    "cover_photo" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "instructor" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CourseCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("about", "category_id", "id", "instructor", "rating", "title") SELECT "about", "category_id", "id", "instructor", "rating", "title" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "CourseEnrollement_course_id_enrolled_user_id_key" ON "CourseEnrollement"("course_id", "enrolled_user_id");
