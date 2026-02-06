// src/components/AI/AIPolishButton/AIPolishButton.tsx
import React, { useState } from 'react';
import { polishText } from '@/services/aiService';
import { Sparkles, Loader2 } from 'lucide-react';
import styles from './AIPolishButton.module.css';
import { AIPolishModal } from '../AIPolishModal/AIPolishModal'; 

interface AIPolishButtonProps {
    text: string;
    onPolished: (newText: string) => void;
    className?: string;
}

export const AIPolishButton: React.FC<AIPolishButtonProps> = ({ text, onPolished, className }) => {
    // status 控制整体流程：idle (空闲) -> loading (按钮转圈) -> modal (弹窗打开)
    const [status, setStatus] = useState<'idle' | 'loading' | 'modal'>('idle');
    const [isRetrying, setIsRetrying] = useState(false);
    
    const [result, setResult] = useState('');

    // 1. 首次点击按钮（按钮转圈 -> 打开弹窗）
    const handleStart = async () => {
        // 简单清洗 HTML 标签检查字数
        const plainText = text.replace(/<[^>]+>/g, '').trim();
        if (!plainText || plainText.length < 2) {
            alert("内容太少，没法润色呀~");
            return;
        }

        setStatus('loading'); // 按钮开始转圈
        
        // 调用 AI
        const res = await polishText(text);
        
        if (res.error) {
            alert(`润色失败: ${res.error}`);
            setStatus('idle');
        } else {
            setResult(res.content);
            setStatus('modal'); // 打开弹窗
        }
    };

    // 2. 在弹窗内点击“重写”（弹窗保持打开 -> 显示骨架屏 -> 更新内容）
    const handleRetry = async () => {
        setIsRetrying(true); // 开启骨架屏
        
        // 再次调用 AI
        const res = await polishText(text);
        
        if (res.error) {
            alert(`重写失败: ${res.error}`);
        } else {
            setResult(res.content); // 更新结果，骨架屏会自动消失
        }
        
        setIsRetrying(false); // 关闭骨架屏
    };

    const handleAccept = () => {
        onPolished(result);
        setStatus('idle');
        setIsRetrying(false);
    };

    const handleClose = () => {
        setStatus('idle');
        setIsRetrying(false);
    }

    return (
        <>
            <button
                onClick={handleStart}
                disabled={status === 'loading'}
                type="button"
                className={`${styles.button} ${className || ''}`}
                title="使用 AI 优化这段描述"
            >
                {status === 'loading' ? (
                    <>
                        <Loader2 size={14} />
                        <span>优化中...</span> 
                    </>
                ) : (
                    <>
                        <Sparkles size={14} />
                        <span>AI 润色</span>
                    </>
                )}
            </button>

            <AIPolishModal 
                isOpen={status === 'modal'} // 只要 status 是 modal，弹窗就一直开着
                onClose={handleClose}
                originalText={text}
                polishedText={result}
                onAccept={handleAccept}
                onRetry={handleRetry}
                isRetrying={isRetrying} // 把内部重试状态传给 Modal
            />
        </>
    );
};