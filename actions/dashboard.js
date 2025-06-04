"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializedTransaction = (obj) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function createAccount(data) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("UnAuthorized");
  }
  // Check if the user exists in the database
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  try {
    // Covert the balance to a float
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance");
    }
    // Check if the account already exists
    const existingAccount = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });
    //if the account already exists, set isDefault to false otherwise set it to true
    const shouldBeDefault =
      existingAccount.length === 0 ? true : data.isDefault;
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        userId: user.id,
        balance: balanceFloat,
        isDefault: shouldBeDefault,
      },
    });

    const serializedAccount = serializedTransaction(account);
    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    console.error("Error creating account:", error);
    throw new Error("Error creating account");
  }
}


export async function getAccounts() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("UnAuthorized");
  }
  // Check if the user exists in the database
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  try {
    const accounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include:{
        _count: {
          select: {
            transactions: true,
          },
        },
      }
    });
    const serializedAccounts = accounts.map(serializedTransaction);


    return serializedAccounts;
    
  } catch (error) {
    console.log(error);
    
    throw new Error("Error fetching accounts");
  }
}


export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializedTransaction);
}