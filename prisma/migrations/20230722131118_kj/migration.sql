/*
  Warnings:

  - You are about to drop the column `courseCategoryId` on the `Course` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,
    "icon_url" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "instructor" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "CourseCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("about", "category_id", "createdAt", "icon_url", "id", "instructor", "picture_url", "rating", "title", "updatedAt") SELECT "about", "category_id", "createdAt", "icon_url", "id", "instructor", "picture_url", "rating", "title", "updatedAt" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
