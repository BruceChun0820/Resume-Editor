import { FileText, Settings, Trash2 } from "lucide-react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import Styles from "./Sidebar.module.css";

export function Sidebar() {
    return (
        <aside className={Styles.sidebar}>
            <div className={Styles.header}>
                <h2 className={Styles.appTitle}>
                    <span className={Styles.logo}>R</span>
                    Resume Builder
                </h2>
            </div>

            <ScrollArea.Root className={Styles.scrollRoot}>
                <ScrollArea.Viewport className={Styles.scrollViewport}>
                    <nav className={Styles.sidebarNav}>
                        {/* 激活状态：我的简历 */}
                        <button 
                            className={`${Styles.navButton} ${Styles.navButtonActive}`}
                            type="button"
                        >
                            <FileText size={18} />
                            <span>我的简历</span>
                        </button>
                        
                        {/* 禁用状态：设置 */}
                        <button 
                            className={Styles.navButton} 
                            disabled={true}
                            type="button"
                        >
                            <Settings size={18} />
                            <span>设置</span>
                        </button>
                        
                        {/* 禁用状态：回收站 */}
                        <button 
                            className={Styles.navButton} 
                            disabled={true}
                            type="button"
                        >
                            <Trash2 size={18} />
                            <span>回收站</span>
                        </button>
                    </nav>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" className={Styles.scrollbar}>
                    <ScrollArea.Thumb className={Styles.thumb} />
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            <div className={Styles.footer}>v1.0.0</div>
        </aside>
    );
}