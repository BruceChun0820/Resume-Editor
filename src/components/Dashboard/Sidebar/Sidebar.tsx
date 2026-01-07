import { FileText, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Styles from "@/components/Dashboard/Sidebar/Sidebar.module.css";
export function Sidebar() {
    return (
        <aside className={Styles.sidebar}>
            <div className="p-6">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-slate-900">
                    <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">R</span>
                    Resume Builder
                </h2>
            </div>
            <ScrollArea className="flex-1">
                <nav className={Styles.sidebarNav}>
                    <Button variant="secondary" className={Styles.navButton}>
                        <FileText size={18} />
                        <span>我的简历</span>
                    </Button>
                    <Button variant="ghost" disabled={true} className={`${Styles.navButton} text-slate-500 hover:text-slate-900`}>
                        <Settings size={18} />
                        <span>设置</span>
                    </Button>
                    <Button disabled={true} variant="ghost" className={`${Styles.navButton} text-slate-500 hover:text-slate-900`}>
                        <Trash2 size={18} />
                        <span>回收站</span>
                    </Button>
                </nav>
            </ScrollArea>
            <div className="p-4 border-t text-xs text-slate-400 text-center">v1.0.0</div>
        </aside>
    );
}