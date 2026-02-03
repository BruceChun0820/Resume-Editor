import { Search, Upload, FolderSync, HardDrive, RefreshCw, X } from "lucide-react";
import styles from "./Header.module.css";

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
        <header className={styles.header}>
            <h1 className={styles.title}>我的简历库</h1>

            <div className={styles.actionsContainer}>
                {/* 搜索框 */}
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="搜索简历..."
                        /* 组合 class：全局样式 + 局部微调 */
                        className={`input-base ${styles.searchInput}`}
                    />
                </div>

                {/* 同步按钮 */}
                <button
                    onClick={handleSyncClick}
                    className={`btn-secondary ${styles.syncBtn} ${
                        syncHandle ? styles.syncBtnConnected : ''
                    }`}
                    type="button"
                >
                    {syncHandle ? (
                        <>
                            {/* 层 1: 正常显示状态 */}
                            <div className={styles.layerInfo}>
                                <HardDrive size={14} color="var(--color-success)" />
                                <div className={styles.folderInfo}>
                                    <span className={styles.folderLabel}>已同步本地</span>
                                    <span className={styles.folderName} title={syncHandle.name}>
                                        {syncHandle.name}
                                    </span>
                                </div>
                                <RefreshCw size={12} className={styles.spinIcon} color="var(--color-success-hover)" />
                            </div>

                            {/* 层 2: 悬停断开状态 */}
                            <div className={styles.layerDisconnect}>
                                <X size={16} />
                                <span>断开连接</span>
                            </div>
                        </>
                    ) : (
                        // 未连接状态
                        <div className={styles.layerInfo}>
                            <FolderSync size={16} />
                            <span>关联文件夹</span>
                        </div>
                    )}
                </button>

                {/* 导入按钮 */}
                <button
                    onClick={importResume}
                    className={`btn-secondary ${styles.importBtn}`}
                    type="button"
                >
                    <Upload size={16} /> 
                    导入 JSON
                </button>
            </div>
        </header>
    );
}