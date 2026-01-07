import { FileText, MoreVertical, Copy, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Styles from "./ResumeCard.module.css"; 
import type { ResumeItem } from "@/hooks/useDashboard/useDashboard";

interface ResumeCardProps {
    resume: ResumeItem;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (resume: ResumeItem) => void;
}

export function ResumeCard({ resume, onEdit, onDelete, onDuplicate }: ResumeCardProps) {
    return (
        <div className={Styles.resumeCard}>
            {/* A. 右上角更多菜单 */}
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full">
                            <MoreVertical size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onDuplicate(resume)}>
                            <Copy size={14} className="mr-2" /> 创建副本
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* B. 卡片主体 (点击进入编辑) - 关键是 Styles.cardMain 的居中控制 */}
            <div className={Styles.cardMain} onClick={() => onEdit(resume.id)}>
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
                    onClick={() => onEdit(resume.id)}
                >
                    <Edit size={14} className="mr-2" /> 编辑
                </Button>

                {/* 右侧边框分隔线 - 依赖父级 relative 定位 */}
                <div className="absolute bottom-[0.75rem] left-1/2 w-[1px] h-[1.25rem] bg-slate-100 -translate-x-1/2 pointer-events-none" />

                <Button
                    variant="ghost"
                    className={cn(Styles.actionBtn, Styles.deleteBtn)}
                    onClick={() => onDelete(resume.id)}
                >
                    <Trash2 size={14} className="mr-2" /> 删除
                </Button>
            </div>
        </div>
    );
}