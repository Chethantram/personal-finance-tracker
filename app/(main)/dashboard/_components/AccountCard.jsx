"use client";
import { updateAccount } from '@/actions/accounts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import UseFetch from '@/hooks/use-fetch'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const AccountCard = ({account}) => {

    const {data:updateDefault,error,loading:updateDefaultLoading,fetchData:updateDefaultFn} = UseFetch(updateAccount)

    const handleUpdateDefault = async (e) => {
        e.preventDefault();

        if(account?.isDefault){
            toast.warning("AtLeast one account should be default");
            return;
        }
        await updateDefaultFn(account?.id);
    }

    useEffect(() => {
     if (updateDefault?.success) {
        toast.success("Default Account updated successfully");
        
     }
    }, [updateDefault]);


    useEffect(() => {
     if (error) {
        toast.error(error.message || "Default Account updated successfully");
        
     }
    }, [error]);

  return (
    <Link href={`/account/${account?.id}`}>
    <Card className={' hover:bg-gray-50 h-full hover:shadow-lg transition duration-300 ease-in-out cursor-pointer'}>
        <CardHeader className={"flex items-center justify-between"}>
            <CardTitle>{account?.name}</CardTitle>
            <Switch onClick={handleUpdateDefault} disabled={updateDefaultLoading} checked={account?.isDefault} className={'cursor-pointer'}/>
        </CardHeader>
        <CardContent>
            <div>
                <h2 className='text-2xl font-bold'>${parseFloat(account?.balance).toFixed(2)}</h2>
                <p className='text-sm text-muted-foreground'>{account?.type.charAt(0).toUpperCase() + account?.type.slice(1).toLowerCase()}  Account</p>

                <div className='flex items-center gap-4 mt-3'>
                    <span className='flex items-center gap-1'><ArrowUpRight className='size-4 text-green-500'/>Income</span>
                    <span className='flex items-center gap-1'><ArrowDownRight className='size-4 text-red-500'/>Expenses</span>
                </div>
            </div>
        </CardContent>
    </Card>
    </Link>
  )
}

export default AccountCard