import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboard } from "@/hooks/useDashboard/useDashboard";

// 1. 引入拆分后的子组件
import { Sidebar } from "@/components/Dashboard/Sidebar/Sidebar";
import { Header } from "@/components/Dashboard/Header/Header";
import { CreateCard } from "@/components/Dashboard/CreateCard/CreateCard";
import { ResumeCard } from "@/components/Dashboard/ResumeCard/ResumeCard";

// 2. 引入仅包含全局布局的样式
import Styles from "./Dashboard.module.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const {
        resumes,
        syncHandle,
        createResume,
        deleteResume,
        duplicateResume,
        importResume,
        connectFolder
    } = useDashboard();

    return (
        <div className={Styles.dashboardContainer}>
            {/* 左侧边栏组件 */}
            <Sidebar />

            <main className={Styles.mainContent}>
                {/* 顶部导航与操作区 */}
                <Header 
                    syncHandle={syncHandle}
                    connectFolder={connectFolder}
                    importResume={importResume}
                    createResume={createResume}
                />

                {/* 内容滚动区 */}
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className={Styles.gridContainer}>
                            
                            {/* [1] 新建简历卡片 */}
                            <CreateCard onClick={createResume} />

                            {/* [2] 遍历渲染简历列表 */}
                            {resumes.map((resume) => (
                                <ResumeCard 
                                    key={resume.id}
                                    resume={resume}
                                    onEdit={(id) => navigate(`/editor/${id}`)}
                                    onDelete={deleteResume}
                                    onDuplicate={duplicateResume}
                                />
                            ))}

                        </div>
                    </div>
                </ScrollArea>
            </main>
        </div>
    );
}