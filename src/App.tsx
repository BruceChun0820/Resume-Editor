import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Editor from "@/pages/Editor/Editor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 访问根路径 / 时，显示“我的简历库”门户 */}
        <Route path="/" element={<Dashboard />} />
        
        {/* 访问 /editor/xxx 时，显示编辑器 */}
        {/* :id 是动态参数，稍后我们在 Editor 里通过 useParams 获取 */}
        <Route path="/editor/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;