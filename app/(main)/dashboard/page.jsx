import { getAccounts, getDashboardData } from "@/actions/dashboard";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus } from "lucide-react";
import React, { Suspense } from "react";
import AccountCard from "./_components/AccountCard";
import { getCurrentBudget } from "@/actions/budget";
import BudgetProcess from "./_components/BudgetProcess";
import DashboardOverview from "./_components/DashboardOverview";

const DashboardPage = async () => {
  const accounts = await getAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  const transactions = await getDashboardData();
  return (
    <div>

      {/* Budget progress */}
      <BudgetProcess
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* overview */}
      <Suspense fallback={<div>Loading...</div>}>
      <DashboardOverview accounts={accounts} transactions={transactions || []}/>
      </Suspense>
      {/* Account grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <CreateAccountDrawer>
          <Card
            className={
              "bg-gray-100 hover:bg-gray-200 h-full hover:shadow-lg transition duration-300 ease-in-out cursor-pointer"
            }
          >
            <CardContent
              className={
                "flex text-muted-foreground mt-5 flex-col items-center justify-center  "
              }
            >
              <Plus className="w-10 h-10 " />
              <h2 className="text-md font-bold">Create Account</h2>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.map((account) => {
          return <AccountCard key={account.id} account={account} />;
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
