import {
    LayoutGrid,
    RotateCcw,
    FolderPlus,
    Download,
    ChevronDown,
    FileText,
    FileJson,
    HardDrive,
    Link2Off,
    FileUp // 1. 新增导入图标
} from 'lucide-react';
import type { Resume, ResumeSection } from "../../../types/resume";
import { SectionEditor } from "../SectionEditor/SectionEditor";
import { BasicsEditor } from "../BasicsEditor/BasicsEditor";
import styles from "./EditorSidebar.module.css";
// 2. 注意：这里不再需要引入 verifyPermission, storeDirectoryHandle 等底层工具了

interface EditorSidebarProps {
    // --- 数据状态 ---
    resume: Resume;
    syncHandle: FileSystemDirectoryHandle | null;

    // --- 基础编辑动作 ---
    onBasicsUpdate: (updatedBasics: Resume['basics']) => void;
    onSectionUpdate: (updatedSection: ResumeSection) => void;
    onAddSection: () => void;
    onDeleteSection: (sectionId: string) => void;
    onResumeReset: () => void;

    // --- 功能性动作 (直接映射 Hook 里的 Actions) ---
    // 这里不再关注实现细节，只关注“动作”本身
    onConnectSync: () => void;
    onDisconnectSync: () => void;
    onImportJson: () => void;
    onExportJson: () => void;
    onPrint: () => void;
    onUploadAvatar: (file: File) => void;
    onRemoveAvatar: () => void;
}

export const EditorSidebar = ({
    resume,
    syncHandle,
    onSectionUpdate,
    onBasicsUpdate,
    onResumeReset,
    onAddSection,
    onDeleteSection,
    onConnectSync,
    onDisconnectSync,
    onImportJson,
    onExportJson,
    onPrint,
    onUploadAvatar,
    onRemoveAvatar
}: EditorSidebarProps) => {

    return (
        <aside className={styles.sidebar}>
            {/* 头部区域 */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <div className={styles.titleWithIcon}>
                        <LayoutGrid size={24} className={styles.iconPrimary} />
                        <h1 className={styles.mainTitle}>简历编辑器</h1>
                    </div>
                </div>

                <div className={styles.toolbar}>
                    <button
                        className={`btn-secondary ${styles.importQuickBtn}`}
                        onClick={onImportJson}
                    >
                        <FileUp size={14} />
                        <span>导入JSON配置</span>
                    </button>

                    {/* 本地同步状态/开关 */}
                    <div
                        className={`${styles.syncStatus} ${syncHandle ? styles.synced : ''}`}
                        // 逻辑简化：直接绑定 Prop
                        onClick={syncHandle ? undefined : onConnectSync}
                        title={syncHandle ? "已开启本地文件夹同步" : "点击关联本地文件夹"}
                    >
                        {syncHandle ? (
                            <>
                                <HardDrive size={14} className={styles.syncIcon} />
                                <span className={styles.statusTag}>已同步至本地</span>
                                <button
                                    className={styles.disconnectBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDisconnectSync(); // 直接调用断开
                                    }}
                                >
                                    <Link2Off size={12} />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className={styles.statusDotGray}></span>
                                <span className={styles.statusTag}>未开启同步</span>
                            </>
                        )}
                    </div>

                    <div className={styles.actions}>
                        <button className="btn-secondary" onClick={onResumeReset}>
                            <RotateCcw size={14} />
                            <span>重置</span>
                        </button>

                        <div className={styles.dropdownWrapper}>
                            <button className={`btn-primary ${styles.dropdownTrigger}`}>
                                <Download size={14} />
                                <span>导出简历</span>
                                <ChevronDown size={12} style={{ marginLeft: 4, opacity: 0.8 }} />
                            </button>

                            {/* 下拉菜单 */}
                            <div className={styles.dropdownMenu}>
                                <button className={styles.dropdownItem} onClick={onPrint}>
                                    <FileText size={14} />
                                    <span>导出 PDF</span>
                                </button>
                                <button className={styles.dropdownItem} onClick={onExportJson}>
                                    <FileJson size={14} />
                                    <span>导出 JSON 配置</span>
                                </button>

                                {/* 分割线与导入按钮 */}
                                <div className={styles.menuDivider}></div>
                                <button className={styles.dropdownItem} onClick={onImportJson}>
                                    <FileUp size={14} />
                                    <span>导入 JSON 配置</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <BasicsEditor
                basics={resume.basics}
                onUpdate={onBasicsUpdate}
                // 🚀 注入新能力
                onImageUpload={onUploadAvatar}
                onImageRemove={onRemoveAvatar}
            />

            <div className={styles.sectionList}>
                {resume.sections.map((section) => (
                    <SectionEditor
                        key={section.id}
                        section={section}
                        onUpdate={onSectionUpdate}
                        onDelete={() => onDeleteSection(section.id)}
                    />
                ))}
            </div>

            <button className={styles.addNewSectionBtn} onClick={onAddSection}>
                <FolderPlus size={18} />
                添加自定义板块
            </button>
        </aside>
    );
}