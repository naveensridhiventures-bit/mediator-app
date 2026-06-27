import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UserForm from './pages/UserForm.jsx'
import ThankYou from './pages/ThankYou.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import LeadDetail from './pages/LeadDetail.jsx'
import { AdminAuthProvider, useAdminAuth } from './hooks/useAdminAuth.jsx'

function ProtectedRoute({ children }) {
  const { isAuth } = useAdminAuth()
  return isAuth ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/lead/:id" element={<ProtectedRoute><LeadDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  )
}
