const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <li className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg">
      <span
        onClick={() => onToggle(todo.id)}
        className={`flex-1 cursor-pointer ${
          todo.done ? "line-through text-gray-400" : "text-gray-800"
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-400 hover:text-red-600 text-sm ml-4"
      >
        삭제
      </button>
    </li>
  )
}

export default TodoItem