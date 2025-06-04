import React, { Suspense } from 'react'
import DashboardPage from './page'
import { BarLoader } from 'react-spinners'

const DashboardLayout = () => {
  return (
    <div className='px-6'>
        <div className='container'>
            <h1 className='text-3xl font-bold text-violet-600'>Dashboard</h1>
            
            </div>
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color="#8F00FF"/>}>
                <DashboardPage/>
            </Suspense>
    </div>
  )
}

export default DashboardLayout