import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react'
import supabase from './supabaseClient'
import LoginPage from './pages/LoginPage'
import TodoPage from './pages/TodoPage'
import CaloriePage from "./pages/CaloriePage";

function App() {

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return <div>로딩중...</div>

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = { <Navigate to = { session ? "/todo" : "/login"} />} />
        <Route path="/login" element = { <LoginPage/>} />
        <Route path="/todo" element = { session ? <TodoPage /> : <Navigate to="/login"/>} />
        <Route path="/calorie" element = {<CaloriePage/> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App