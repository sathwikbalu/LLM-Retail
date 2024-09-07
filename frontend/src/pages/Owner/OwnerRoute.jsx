import React from 'react'
import { Navigate,Outlet } from 'react-router'
import { useSelector } from 'react-redux'



const OwnerRoute = () => {
    const {userInfo}=useSelector(state=>state.auth)



  return userInfo  && userInfo.isOwner?(<Outlet/>):(<Navigate to='/'replace/>)
}

export default OwnerRoute