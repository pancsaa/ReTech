-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `delivered_at` DATETIME(3) NULL,
    ADD COLUMN `delivered_confirmed` BOOLEAN NOT NULL DEFAULT false;
