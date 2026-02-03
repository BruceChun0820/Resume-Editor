import { FileText, MoreVertical, Copy, Edit, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"; // 使用 Radix 原语
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
            {/* A. 右上角更多菜单 (Radix UI) */}
            <div className="absolute top-0 right-0 z-10">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className={Styles.menuBtn} type="button">
                            <MoreVertical size={16} />
                        </button>
                    </DropdownMenu.Trigger>
                    
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className={Styles.dropdownContent} align="end" sideOffset={5}>
                            <DropdownMenu.Item 
                                className={Styles.dropdownItem} 
                                onClick={() => onDuplicate(resume)}
                            >
                                <Copy size={14} className="mr-2" /> 
                                创建副本
                            </DropdownMenu.Item>
                            {/* 如果有更多选项可以在此添加 */}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            {/* B. 卡片主体 */}
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

            {/* C. 底部按钮组 */}
            <div className={Styles.cardActions}>
                <button
                    className={Styles.actionBtn}
                    onClick={() => onEdit(resume.id)}
                    type="button"
                >
                    <Edit size={14} /> 编辑
                </button>

                {/* 分割线 */}
                <div className={Styles.separator} />

                <button
                    className={`${Styles.actionBtn} ${Styles.deleteBtn}`}
                    onClick={() => onDelete(resume.id)}
                    type="button"
                >
                    <Trash2 size={14} /> 删除
                </button>
            </div>
        </div>
    );
}