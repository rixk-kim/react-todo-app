import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

function CaloriePage() {
  const [logs, setLogs] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState(0);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchLogs = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/login');
            return;
        }
      const { data, error } = await supabase
        .from("calorie_logs")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error) setLogs(data);
    };
    fetchLogs();
  }, []);

  //add Log
  const addLog = async (text, num) => {
    if(!text.trim() || !num) return;
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error } = await supabase
    .from("calorie_logs")
    .insert([{ food_name: text, calories: num, user_id: session.user.id}])
    .select();
    if (!error) {
        setLogs([...logs, data[0]])
        setFoodName("")
        setCalories(0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-8">
          칼로리
        </h1>
        <div className="flex flex-col gap-2 mb-4">
          {/* 음식 이름 */}
          <input
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="음식 입력"
          ></input>
          {/* 칼로리 수 */}
          <input 
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          onChange = { (e) => setCalories(Number(e.target.value))}
          type = "number"
          placeholder="칼로리 수 입력"></input>
          {/* 추가 버튼 과 칼로리 합산 */}
          <div className="flex items-center justify-center">
            <button
            type="button"
            onClick={() => addLog(foodName, calories)}
            className = "bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700"
            >
                추가
            </button>

            <p className="text-right w-full font-bold text-green-600 mt-4">
                총 칼로리: {logs.reduce((sum, log) => sum + log.calories, 0)} kcal
            </p>
          </div>
          <ul className="space-y-2 mt-4">
            {logs.map((log) => (
                <li key={log.id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg">
                    <span>{log.food_name}</span>
                    <div>
                        <span>{log.calories} kcal</span>
    
                    </div>

                </li>
            ))}
          </ul>
          <div  className = "flex items-center justify-center">
            <button 
              type="button"
              onClick = {() => navigate('/todo')}
            className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700">
              할 일 체크
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaloriePage;
