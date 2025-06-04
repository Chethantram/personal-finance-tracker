'use client'
import { scanReceipt } from '@/actions/transaction';
import { Button } from '@/components/ui/button';
import UseFetch from '@/hooks/use-fetch';
import { Camera, Loader2 } from 'lucide-react';
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

const ReceiptScanner = ({onScanComplete}) => {
    const fileInputRef = useRef();

    const {data,error,loading,fetchData} = UseFetch(scanReceipt);

    const handleReceiptScan = async(file)=>{
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size exceeds 5MB limit.");
            return;
            
        }
        await fetchData(file);
    }

    useEffect(()=>{
        if (data && !loading) {
            onScanComplete(data);
            toast.success("Receipt scanned successfully!");

            
        }},[data,loading])
  return (
    <div>
        <input ref={fileInputRef} type="file" className='hidden' accept='image/*' capture="environment" onChange={(e)=>{
            const file = e.target.files?.[0];
            if (file) {
                handleReceiptScan(file)
            }
        }} />
        <Button className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white" disabled={loading} onClick={()=>fileInputRef.current?.click()}>{
            loading?<><Loader2 className='mr-2 w-4 h-4 animate-spin'/>Scanning Receipt</>:<><Camera className='w-4 h-4'/>Scan Receipt with AI</>}</Button>
    </div>
  )
}

export default ReceiptScanner