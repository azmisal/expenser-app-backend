-- CreateTable
CREATE TABLE "TransactionPerson" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TransactionPerson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionPerson" ADD CONSTRAINT "TransactionPerson_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
