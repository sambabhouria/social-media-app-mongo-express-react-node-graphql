import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/auth'

const ProtectedRoute = ({ redirectPath = '/', children }) => {
  const { user } = useContext(AuthContext)
  if (user) {
    return <Navigate to={redirectPath} replace />
  }
  // return children ? children : <Outlet />
  return <Outlet />
}

export default ProtectedRoute
