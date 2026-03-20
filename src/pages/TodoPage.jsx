import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoItem from "../components/TodoItem";
import supabase from "../supabaseClient";

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [summary, setSummary] = useState("");

  //todos 리스트 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error) setTodos(data);
    };
    fetchTodos();
  }, []);

  //todos 완료 체크
  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  //todo 추가
  const addTodo = async (text) => {
    if (!text.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ text, done: false }])
      .select();
    if (!error) {
      setTodos([...todos, data[0]]);
      setInput("");
    }
  };

  //todo 완료 비완료
  const toggleTodo = async (id, done) => {
    await supabase.from("todos").update({ done: !done }).eq("id", id);
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !done } : t)));
  };

  //todo 삭제
  const deleteTodo = async (id) => {
    await supabase.from("todos").delete().eq("id", id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  //요약 함수(gemini 2.5 flash lite 사용)
  const summarizeTodos = async () => {
    const { data: { session } } = await supabase.auth.getSession()
  console.log("session:", session)
  
  const todoTexts = todos.map((t) => t.text)
  const { data, error } = await supabase.functions.invoke("summarize-todos", {
    body: { todos: todoTexts },
  })
  console.log("error:", error)
  if (!error) setSummary(data.summary)
  }


  //네비게이션
  const navigate = useNavigate();

  //로그아웃
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Todo App
        </h1>

        {/* 입력 */}
        <div className="flex gap-2 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTodo(input);
              }
            }}
            placeholder="할 일 입력..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            onClick={() => addTodo(input)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            추가
          </button>
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mb-4">
          {["all", "active", "done"].map((f) => (
            <button
              type="button"
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

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-indigo-600 text-white mt-5 px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            로그아웃
          </button>
          <button
            type="button"
            onClick={ () => navigate('/calorie') }
            className="bg-indigo-600 text-white mt-5 px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            칼로리 체크
          </button>
        </div>
        <div className = "flex flex-col gap-2 mt-5">
          <button
            type = "button"
            onClick = { () => summarizeTodos()}
            className="bg-indigo-600 text-white mt-5 px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            할 일 요약
          </button>
          {summary && (
            <div className = "bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-gray-700">
              {summary}
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
