import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage'
import TodoPage from './pages/TodoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element = { <Navigate to = "/login" />} />
        <Route path="/login" element = { <LoginPage/>} />
        <Route path="/todo" element = { <TodoPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App