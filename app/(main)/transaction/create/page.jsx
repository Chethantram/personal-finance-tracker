import { getAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import React from "react";
import AddTransactionForm from "../_components/AddTransactionForm";
import { getTransaction } from "@/actions/transaction";

const AddTransaction = async ({ searchParams }) => {
  const {edit} = await searchParams;
  const editId = edit ? edit : null;

  
  const accounts = await getAccounts();

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }
  return (
    <div className="max-w-3xl mx-auto my-4">
      <div className="space-y-6">
        <h1
          className="text-violet-500 fon
          t-bold text-5xl"
        >
          {editId ? "Update" : "Add"} Transaction
        </h1>
        <div className="md:mx-0 mx-3">
          <AddTransactionForm
            editMode={!!editId}
            initialData={initialData}
            accounts={accounts}
            categories={defaultCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
