import { Search, Upload, FolderSync, HardDrive, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Styles from "./Header.module.css";

interface HeaderProps {
    syncHandle: FileSystemDirectoryHandle | null;
    connectFolder: () => void;
    importResume: () => void;
}

export function Header({ syncHandle, connectFolder, importResume }: HeaderProps) {
    return (
        <header className={Styles.header}>
            {/* 左侧：标题 */}
            <h1 className="text-xl font-bold text-slate-800 shrink-0">我的简历库</h1>
            
            {/* 右侧：操作区容器 */}
            <div className={Styles.actionsContainer}>
                <div className={Styles.searchWrapper}>
                    <Search className={Styles.searchIcon} />
                    
                    {/* 【关键修改 2】
                        - !pl-10: 强制左内边距 40px，给图标留位 (解决重合)
                        - w-64: 固定宽度，防止搜索框忽长忽短 
                    */}
                    <Input 
                        placeholder="搜索简历..." 
                        className="!pl-10 w-64 bg-slate-50 border-slate-200 focus-visible:ring-1" 
                    />
                </div>

                <Button
                    variant="outline"
                    onClick={connectFolder}
                    className={cn(Styles.syncButton, syncHandle ? Styles.syncButtonActive : "")}
                >
                    {syncHandle ? (
                        <>
                            <HardDrive size={14} className="shrink-0" />
                            <span className="text-xs">已同步:</span>
                            <span className={Styles.folderName}>{syncHandle.name}</span>
                            <RefreshCw size={12} className="opacity-50 ml-1" />
                        </>
                    ) : (
                        <><FolderSync size={16} /> 关联文件夹</>
                    )}
                </Button>

                <Button variant="outline" onClick={importResume} className={cn("btn-secondary", "gap-2 border-slate-200 text-slate-600 hover:text-slate-900")}>
                    <Upload size={16} /> 导入 JSON
                </Button>
            </div>
        </header>
    );
}