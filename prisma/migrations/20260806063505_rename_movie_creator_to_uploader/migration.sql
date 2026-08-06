/*
  Warnings:

  - You are about to drop the column `creator_id` on the `movie` table. All the data in the column will be lost.
  - Added the required column `uploader_id` to the `movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "movie" DROP CONSTRAINT "movie_creator_id_fkey";

-- AlterTable
ALTER TABLE "movie" DROP COLUMN "creator_id",
ADD COLUMN     "uploader_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "movie" ADD CONSTRAINT "movie_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
