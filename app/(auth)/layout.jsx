import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex justify-center items-center pt-32 bg-gray-100'>
        {children}
    </div>
  )
}

export default AuthLayout