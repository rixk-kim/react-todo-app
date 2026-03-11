import { useState } from "react"
import TodoItem from "./components/TodoItem"

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "리액트 공부", done: false },
    { id: 2, text: "포트폴리오 만들기", done: false },
  ])
  const [input, setInput] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.done
    if (filter === "done") return t.done
    return true
  })

  const addTodo = () => {
    if (!input.trim()) return
    setTodos([...todos, { id: Date.now(), text: input, done: false }])
    setInput("")
  }

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Todo App</h1>

        {/* 입력 */}
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="할 일 입력..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={addTodo}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            추가
          </button>
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mb-4">
          {["all", "active", "done"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1 rounded-lg text-sm font-medium ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "전체" : f === "active" ? "진행중" : "완료"}
            </button>
          ))}
        </div>

        {/* 리스트 */}
        <ul className="space-y-2">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App