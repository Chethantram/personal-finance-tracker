import { getAccountById } from "@/actions/accounts";
import { notFound } from "next/navigation";

import React, { Suspense } from "react";
import AccountTable from "../_components/AccountTable";
import { BarLoader } from "react-spinners";
import AccountChart from "../_components/AccountChart";

const AccountIdPage = async ({ params }) => {
  const {id} = await params;
  const accountData = await getAccountById(id);
  if (!accountData) {
    notFound();
  }
  const { transactions, ...account } = accountData;
  return (
    <div className="p-7 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-violet-500 fon
          t-bold text-5xl">{account.name}</h1>
          <p className="text-muted-foreground text-sm">
            {account?.type.charAt(0).toUpperCase() +
              account?.type.slice(1).toLowerCase()}{" "}
            Accounts
          </p>
        </div>
        <div>
          <p className="font-bold text-xl">
            ${parseFloat(account?.balance).toFixed(2)}
          </p>
          <p className="text-md text-muted-foreground font-medium">
            {account?._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <Suspense fallback={<BarLoader className="my-4" width={"100%"} color="#8F00FF" />}>
        <AccountChart transactions={transactions} />
      </Suspense>



      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#8F00FF" />}>
        <AccountTable transactions={transactions} />
      </Suspense>
    </div>
  );
};

export default AccountIdPage;
