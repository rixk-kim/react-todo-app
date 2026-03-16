import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import supabase from '../supabaseClient'

export default function LoginScreen() {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [autoLogin, setAutoLogin] = useState(true)

  const navigate = useNavigate()

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email: id, password })
    if (error) alert(error.message)
      else alert('회원가입 완료')
  }

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email: id, password })
    if (error) alert(error.message)
      else navigate('/todo')
  }

  // const handleLogin = () => {
  //   // alert(`로그인 시도: ${id}`)
  //   navigate('/todo')
  // }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className = "w-[360px] bg-white px-6 pt-20 pb-10">

        <div className = "text-center mb-20">
          <span className = " text-2xl font-bold text-gray-700">해야 할일 TODO</span>
        </div>
        <div className = "flex justify-center">
    
         </div>

        <div className = "flex flex-col gap-3">
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className = "w-full px-4 py-4 border border-gray-300 rounded-xl text-sm outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className = "w-full px-4 py-4 border border-gray-300 rounded-xl text-sm outline-none"
          />
        </div>

        <button 
        onClick={handleLogin}
        className = "w-full mt-3 py-4 bg-teal-500 text-white rounded-xl font-bold text-base"
        >
          로그인
        </button>

        <div className = "flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={autoLogin}
            onChange={(e) => setAutoLogin(e.target.checked)}
            className="w-5 h-5 accent-teal-500"
          />
          <span className="text-sm text-gray-700">자동로그인</span>
        </div>

        <div className = "text-center mt-10 text-sm text-gray-400">
          {/* 회원 가입  */}
          <span onClick={ handleSignUp}>회원가입</span>
          <span className = "mx-2">|</span>
          <span>아이디 찾기</span>
          <span className = "mx-2">|</span>
          <span>비밀번호 찾기</span>
        </div>


      </div>
    </div>
  )
}