/*
  Warnings:

  - A unique constraint covering the columns `[user_id,movie_id]` on the table `watchlist_item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "watchlist_item_user_id_movie_id_key" ON "watchlist_item"("user_id", "movie_id");
