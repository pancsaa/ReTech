/*
  Warnings:

  - Added the required column `shipping_address` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transaction` ADD COLUMN `shipping_address` VARCHAR(191) NOT NULL;
