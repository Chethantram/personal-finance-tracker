"use client";
import { updateBudget } from "@/actions/budget";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import UseFetch from "@/hooks/use-fetch";
import { Check, Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const BudgetProcess = ({ initialBudget, currentExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );

  const { data, error, loading, fetchData } = UseFetch(updateBudget);

  const percentageUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("please enter a valid amount");
    }
    await fetchData(amount);
  };

  useEffect(() => {
    if (data?.success) {
      toast.success("Budget updated successfully");
      setIsEditing(false);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  const handleCancel = () => {
    setIsEditing(false);
    setNewBudget(initialBudget?.amount?.toString() || "");
  };
  return (
    <Card>
      <CardHeader className={"space-y-4"}>
        <CardTitle>Monthly budget (Default Account)</CardTitle>
        <div>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type={"number"}
                className={"w-34"}
                placeholder="Enter Amount"
                value={newBudget}
                disabled={loading}
                onChange={(e) => setNewBudget(e.target.value)}
              />
              <Button
                onClick={handleUpdateBudget}
                variant={"ghost"}
                size={"icon"}
                disabled={loading}
                className={"text-green-500"}
              >
                <Check />
              </Button>
              <Button
                onClick={handleCancel}
                variant={"ghost"}
                size={"icon"}
                disabled={loading}
                className={"text-red-500"}
              >
                <X />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CardDescription>
                {initialBudget
                  ? `$${currentExpenses.toFixed(
                      2
                    )} of $${initialBudget.amount.toFixed(2)} spent`
                  : "No budget set"}
              </CardDescription>
              <Button
                variant={"ghost"}
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <>
            <Progress value={percentageUsed} extraStyle={`${percentageUsed >= 90 ? "bg-red-500" : percentageUsed>=75 ? "bg-yellow-500":percentageUsed<=74 ?"bg-green-500": ""}`}/>
            <p className="text-right text-muted-foreground text-sm mt-1">{percentageUsed.toFixed(1)}% used</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProcess;
