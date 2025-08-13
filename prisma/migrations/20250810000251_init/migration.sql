-- CreateTable
CREATE TABLE "Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticker" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "strike" REAL,
    "expiry" TEXT,
    "qty" INTEGER NOT NULL,
    "entryPrice" REAL NOT NULL,
    "lastPrice" REAL,
    "status" TEXT NOT NULL,
    "setup" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
