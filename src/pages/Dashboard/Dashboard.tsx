// src/pages/Dashboard.tsx
import { useNavigate } from "react-router-dom";
import {
    Plus, FileText, Settings, Trash2, MoreVertical,
    Download, Copy, Pencil, Search, Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDashboard } from "@/hooks/useDashboard/useDashboard";
import Styles from "./Dashboard.module.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const { resumes, createResume, deleteResume, duplicateResume, importResume } = useDashboard();

    return (
        // 2. 应用容器样式
        <div className={Styles.dashboardContainer}>

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
                        <div className="relative w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input placeholder="搜索简历..." className="pl-9 bg-slate-50 border-slate-200" />
                        </div>
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
                        {/* 3. 网格布局样式 */}
                        <div className={Styles.gridContainer}>

                            {/* [1] 新建简历卡片 */}
                            <Card
                                onClick={createResume}
                                className="border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[240px] group"
                            >
                                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Plus size={32} className="text-slate-400 group-hover:text-slate-600" />
                                </div>
                                <h3 className="font-semibold text-slate-600">创建新简历</h3>
                                <p className="text-sm text-slate-400 mt-1">从空白简历开始</p>
                            </Card>

                            {/* [2] 真实简历卡片 */}
                            {resumes.map((resume) => (
                                <Card
                                    key={resume.id}
                                    onClick={() => navigate(`/editor/${resume.id}`)}
                                    className="group hover:shadow-lg transition-all duration-300 border-slate-200 flex flex-col cursor-pointer"
                                >
                                    {/* 4. 卡片预览区样式 */}
                                    <div className={Styles.cardPreview}>
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                            <FileText size={48} opacity={0.2} />
                                        </div>
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                                            <Button size="sm" variant="secondary" className="h-8 text-xs">编辑</Button>
                                            <Button size="sm" variant="secondary" className="h-8 text-xs">预览</Button>
                                        </div>
                                    </div>

                                    <CardHeader className="pb-2 pt-4 px-4">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base font-bold text-slate-800 truncate pr-2">
                                                {resume.name}
                                            </CardTitle>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400 hover:text-slate-700">
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => navigate(`/editor/${resume.id}`)}>
                                                            <Pencil size={14} className="mr-2" /> 重命名
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => duplicateResume(resume)}>
                                                            <Copy size={14} className="mr-2" /> 创建副本
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Download size={14} className="mr-2" /> 导出 PDF
                                                        </DropdownMenuItem>
                                                        <Separator className="my-1" />
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => deleteResume(resume.id)}>
                                                            <Trash2 size={14} className="mr-2" /> 删除
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-4 pb-2">
                                        <p className="text-xs text-slate-400">上次编辑: {resume.updatedAt}</p>
                                    </CardContent>

                                    <div className="mt-auto px-4 pb-4 pt-2">
                                        <div className="flex gap-2">
                                            <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">全职</span>
                                            <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">Java</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </main>
        </div>
    );
}