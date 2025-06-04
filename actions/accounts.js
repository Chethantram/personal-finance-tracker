"use server";
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

export const updateAccount = async (accountId) => {
  try {
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

    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const account = await db.account.update({
      where: {
        id: accountId,
      },
      data: {
        isDefault: true,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: serializedTransaction(account) };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
};

export async function getAccountById(accountId) {
  try {
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

    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },

        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });
    if (!account) {
      return null;
    }

    return {
      ...serializedTransaction(account),
      transactions: account.transactions.map(serializedTransaction),
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}

export const bulkDeleteTransaction = async(transactionIds)=>{
  try {
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

    // find the transaction of transaction Id
    const transactions = await db.transaction.findMany({
      where:{
        id:{in:transactionIds},
        userId:user.id
      }
    });

    // transactions of account to update balance
    const accountBalance = transactions.reduce((acc,transaction)=>{
      const change = transaction.type === "EXPENSE" ?
      transaction.amount :-transaction.amount;

      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    },{});

    // Delete transaction and update the balance
    await db.$transaction(async(tx)=>{
      //Delete transaction
      await tx.transaction.deleteMany({
        where:{
          id:{ in:transactionIds},
          userId:user.id,
        }
      });
      // update Transaction
       for (const [accountId, balanceChange] of Object.entries(accountBalance)) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
      
    });
    revalidatePath('/dashboard');
    revalidatePath('/account/[id]');
    return {success:true}
  } catch (error) {
    console.log(error);
    return { success: false, message: error.message };
  }
}
