"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import UseFetch from "@/hooks/use-fetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "SAVINGS",
      balance: "",
      isDefault: false,
    },
  });
  const [open, setOpen] = useState(false);
  const {
    data: createAccountData,
    error,
    loading: createAccountLoading,
    fetchData: createAccountFn,
  } = UseFetch(createAccount);

  useEffect(() => {
    if (createAccountData && !createAccountLoading) {
      toast.success(
        createAccountData.message || "Account Created Successfully"
      );
      reset();
      setOpen(false);
    }
    
  }, [createAccountData, reset]);

  useEffect(() => {
    if (error && !createAccountLoading) {
      toast.error(error.message || "Error creating account");
    }
  }, [error]);
  
  const onSubmitHandler = async (data) => {
    await createAccountFn(data);
  };
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
            <div className="space-y-3">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name
              </label>
              <Input
                type="text"
                id="name"
                className=""
                placeholder="eg : Main checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-3">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValues={watch("type")}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label htmlFor="balance" className="text-sm font-medium">
                Account Balance
              </label>
              <Input
                type={"number"}
                id="balance"
                step="0.01"
                className=""
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-red-500 text-sm">{errors.balance.message}</p>
              )}
            </div>
            <div className="space-y-3 flex items-center justify-between">
              <div>
                <label
                  htmlFor="isDefault"
                  className="text-sm font-medium cursor-pointer"
                >
                  Set as Default Account
                </label>
                <p className="text-sm text-muted-foreground font-medium">
                  This account will be selected by default for Transaction
                </p>
              </div>

              <Switch
                id="isDefault"
                onCheckedChange={(checked) => setValue("isDefault", checked)}
                checked={watch("isDefault")}
              />
            </div>
            <div className="flex my-5 gap-5">
              <DrawerClose asChild>
                <Button variant={"outline"} className={"flex-1 "}>
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                disabled={createAccountLoading}
                className={
                  "flex-1 bg-violet-600 text-white hover:bg-violet-800 "
                }
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
