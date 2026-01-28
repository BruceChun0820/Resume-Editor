import { Search, Upload, FolderSync, HardDrive, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Styles from "./Header.module.css";

interface HeaderProps {
    syncHandle: FileSystemDirectoryHandle | null;
    connectFolder: () => void;
    importResume: () => void;
    disconnectFolder: () => void;
}

export function Header({ syncHandle, connectFolder, importResume, disconnectFolder }: HeaderProps) {

    const handleSyncClick = () => {
        if (syncHandle) {
            disconnectFolder();
        } else {
            connectFolder();
        }
    };

    return (
        <header className={Styles.header}>
            <h1 className="text-xl font-bold text-slate-800 shrink-0">我的简历库</h1>

            <div className={Styles.actionsContainer}>
                <div className={Styles.searchWrapper}>
                    <Search className={Styles.searchIcon} />
                    <Input
                        placeholder="搜索简历..."
                        className="!pl-10 w-64 bg-slate-50 border-slate-200 focus-visible:ring-1"
                    />
                </div>

                {/* [1] 统一样式：应用 btn-secondary 
                    [2] 交互容器：相对定位，用于内部绝对定位的图标切换
                */}
                <Button
                    variant="ghost" // 这里为了配合 btn-secondary 的自定义样式，先把 variant 设为 ghost 或默认
                    onClick={handleSyncClick}
                    className={cn(
                        "btn-secondary relative overflow-hidden group w-48 transition-all duration-300",
                        // 如果已连接，给一个特殊的边框色或背景色提示
                        syncHandle ? "border-green-200 bg-green-50/50 hover:bg-red-50 hover:border-red-200" : ""
                    )}
                >
                    {syncHandle ? (
                        <>
                            {/* --- 层 1: 正常状态 (硬盘图标 + 文件夹名) --- */}
                            {/* transition-opacity + duration-300 实现淡入淡出 */}
                            <div className="flex items-center gap-2 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                                <HardDrive size={14} className="text-green-600" />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] text-slate-400">已同步</span>
                                    <span className="text-xs font-medium text-slate-700 max-w-[100px] truncate">
                                        {syncHandle.name}
                                    </span>
                                </div>
                                {/* [3] 旋转动画：animate-spin */}
                                <RefreshCw size={12} className="text-green-400 animate-spin ml-auto" />
                            </div>

                            {/* --- 层 2: 悬停状态 (叉叉图标 + 断开提示) --- */}
                            {/* 绝对定位铺满按钮，初始透明度 0，悬停时变 1 */}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-red-600">
                                <X size={16} />
                                <span className="font-medium">断开连接</span>
                            </div>
                        </>
                    ) : (
                        // 未连接状态
                        <div className="flex items-center gap-2 text-slate-600">
                            <FolderSync size={16} />
                            <span>关联文件夹</span>
                        </div>
                    )}
                </Button>

                {/* 导入按钮：统一 btn-secondary */}
                <Button
                    variant="ghost"
                    onClick={importResume}
                    className="btn-secondary gap-2 text-slate-600"
                >
                    <Upload size={16} /> 导入 JSON
                </Button>
            </div>
        </header>
    );
}