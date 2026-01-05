import { useNavigate } from "react-router-dom";
import {
    Plus, FileText, Settings, Trash2, MoreVertical,
    Download, Copy, Pencil, Search, Upload,
    FolderSync,
    HardDrive,
    RefreshCw,
    Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { useDashboard } from "@/hooks/useDashboard/useDashboard";
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

            {/* --- 左侧边栏 --- */}
            <aside className={Styles.sidebar}>
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
                        <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                            R
                        </span>
                        Resume Builder
                    </h2>
                </div>

                <ScrollArea className="flex-1">
                    <nav className={Styles.sidebarNav}>
                        <Button
                            variant="secondary"
                            className={Styles.navButton}
                        >
                            <FileText size={18} />
                            <span>我的简历</span>
                        </Button>

                        <Button
                            variant="ghost"
                            className={`${Styles.navButton} text-slate-500 hover:text-slate-900`}
                        >
                            <Settings size={18} />
                            <span>设置</span>
                        </Button>

                        <Button
                            variant="ghost"
                            className={`${Styles.navButton} text-slate-500 hover:text-slate-900`}
                        >
                            <Trash2 size={18} />
                            <span>回收站</span>
                        </Button>
                    </nav>
                </ScrollArea>

                <div className="p-4 border-t text-xs text-slate-400 text-center">
                    v1.0.0 Alpha
                </div>
            </aside>

            {/* --- 右侧主内容区 --- */}
            <main className={Styles.mainContent}>
                {/* 顶部导航栏 */}
                <header className={Styles.header}>
                    <h1 className="text-lg font-semibold text-slate-800">我的简历库</h1>
                    <div className="flex items-center gap-4">
                        <div className={Styles.searchWrapper}>
                            <Search className={Styles.searchIcon} />
                            <Input placeholder="搜索简历..." className="pl-9 bg-slate-50 border-slate-200" />
                        </div>

                        {/* 同步按钮：根据 syncHandle 状态切换样式和内容 */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={connectFolder}
                            className={cn(
                                Styles.syncButton,
                                syncHandle ? Styles.syncButtonActive : ""
                            )}
                            title={syncHandle ? `当前同步位置: ${syncHandle.name}\n点击修改存储位置` : "关联本地文件夹以开启自动同步"}
                        >
                            {syncHandle ? (
                                <>
                                    {/* 已连接状态 (绿色) */}
                                    <HardDrive size={14} className="shrink-0" />
                                    <span className="text-xs">已同步:</span>
                                    <span className={Styles.folderName}>{syncHandle.name}</span>
                                    <RefreshCw size={12} className="opacity-50 ml-1" />
                                </>
                            ) : (
                                <>
                                    {/* 未连接状态 (灰色) */}
                                    <FolderSync size={16} />
                                    关联文件夹
                                </>
                            )}
                        </Button>

                        <Button variant="outline" size="sm" onClick={importResume} className="gap-1 border-slate-300 text-slate-600 hover:text-slate-900">
                            <Upload size={16} /> 导入 JSON
                        </Button>
                        <Button onClick={createResume} size="sm" className="gap-1 bg-slate-900 hover:bg-slate-800">
                            <Plus size={16} /> 新建简历
                        </Button>
                    </div>
                </header>

                {/* 内容滚动区 */}
                <ScrollArea className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className={Styles.gridContainer}>

                            {/* [1] 新建简历卡片 (保持原有样式，稍作高度适配) */}
                            <Card
                                onClick={createResume}
                                className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[250px] group shadow-none"
                            >
                                <div className="w-14 h-14 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Plus size={28} className="text-slate-400 group-hover:text-slate-600" />
                                </div>
                                <h3 className="font-semibold text-slate-600">新建简历</h3>
                                <p className="text-xs text-slate-400 mt-1">从空白开始</p>
                            </Card>

                            {/* [2] 真实简历卡片 (新布局) */}
                            {resumes.map((resume) => (
                                <div key={resume.id} className={Styles.resumeCard}>

                                    {/* A. 右上角更多菜单 (创建副本/导出/重命名) */}
                                    <div className="absolute top-2 right-2 z-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                {/* 保留功能：创建副本 */}
                                                <DropdownMenuItem onClick={() => duplicateResume(resume)}>
                                                    <Copy size={14} className="mr-2" /> 创建副本
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {/* B. 卡片主体 (点击进入编辑) */}
                                    <div
                                        className={Styles.cardMain}
                                        onClick={() => navigate(`/editor/${resume.id}`)}
                                    >
                                        <div className={Styles.iconCircle}>
                                            <FileText size={28} />
                                        </div>
                                        <h3 className={Styles.cardTitle} title={resume.name}>
                                            {resume.name}
                                        </h3>
                                        <p className={Styles.cardDate}>
                                            {resume.updatedAt?.split('T')[0] || "刚刚创建"}
                                        </p>
                                    </div>

                                    {/* C. 底部按钮组 (编辑 / 删除) */}
                                    <div className={Styles.cardActions}>
                                        <Button
                                            variant="ghost"
                                            className={Styles.actionBtn}
                                            onClick={() => navigate(`/editor/${resume.id}`)}
                                        >
                                            <Edit size={14} className="mr-2" /> 编辑
                                        </Button>

                                        {/* 右侧边框分隔线 */}
                                        <div className="absolute bottom-[0.75rem] left-1/2 w-[1px] h-[1.25rem] bg-slate-100 -translate-x-1/2 pointer-events-none" />

                                        <Button
                                            variant="ghost"
                                            className={`${Styles.actionBtn} ${Styles.deleteBtn}`}
                                            onClick={() => deleteResume(resume.id)}
                                        >
                                            <Trash2 size={14} className="mr-2" /> 删除
                                        </Button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </ScrollArea>
            </main>
        </div>
    );
}