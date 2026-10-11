-- AlterTable
-- The `photo` column was written as an empty string at signup and never read by
-- any query. Dropping it removes dead state rather than changing behaviour.
ALTER TABLE "User" DROP COLUMN "photo";