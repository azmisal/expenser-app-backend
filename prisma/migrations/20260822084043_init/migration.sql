-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "mySpent" DOUBLE PRECISION NOT NULL,
    "isSplit" BOOLEAN NOT NULL DEFAULT false,
    "splitType" TEXT NOT NULL DEFAULT 'none',
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
