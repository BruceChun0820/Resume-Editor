import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area"; // 替换 Shadcn 组件
import { useDashboard } from "@/hooks/useDashboard/useDashboard";

// 1. 引入拆分后的子组件
import { Sidebar } from "@/components/Dashboard/Sidebar/Sidebar";
import { Header } from "@/components/Dashboard/Header/Header";
import { CreateCard } from "@/components/Dashboard/CreateCard/CreateCard";
import { ResumeCard } from "@/components/Dashboard/ResumeCard/ResumeCard";

// 引入样式
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
        connectFolder,
        disconnectFolder
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
                    disconnectFolder={disconnectFolder}
                />

                {/* 内容滚动区 (Radix UI) */}
                <ScrollArea.Root className={Styles.scrollRoot}>
                    <ScrollArea.Viewport className={Styles.scrollViewport}>
                        <div className={Styles.contentContainer}>
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
                    </ScrollArea.Viewport>
                    {/* 滚动条 */}
                    <ScrollArea.Scrollbar orientation="vertical" className={Styles.scrollbar}>
                        <ScrollArea.Thumb className={Styles.thumb} />
                    </ScrollArea.Scrollbar>
                </ScrollArea.Root>
            </main>
        </div>
    );
}