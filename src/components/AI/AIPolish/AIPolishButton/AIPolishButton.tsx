// src/components/AI/AIPolish/AIPolishButton/AIPolishButton.tsx
import React, { useState } from 'react';
import { polishText } from '@/services/aiService';
import { Sparkles, Loader2 } from 'lucide-react';
import styles from './AIPolishButton.module.css';
import { AIPolishModal } from '../AIPolishModal/AIPolishModal'; 

interface AIPolishButtonProps {
    text: string;
    onPolished: (newText: string) => void;
    className?: string; // 允许父组件微调位置
}

export const AIPolishButton: React.FC<AIPolishButtonProps> = ({ text, onPolished, className }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'modal'>('idle');
    const [result, setResult] = useState('');

    const handleStart = async () => {
        const plainText = text.replace(/<[^>]+>/g, '').trim();
        if (!plainText || plainText.length < 2) {
            alert("内容太少，没法润色呀~");
            return;
        }
        setStatus('loading');
        await fetchAI();
    };

    const fetchAI = async () => {
        const res = await polishText(text);
        if (res.error) {
            alert(`润色失败: ${res.error}`);
            setStatus('idle');
        } else {
            setResult(res.content);
            setStatus('modal');
        }
    };

    const handleRetry = async () => {
        await fetchAI(); 
    };

    const handleAccept = () => {
        onPolished(result);
        setStatus('idle');
    };

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
                isOpen={status === 'modal'}
                onClose={() => setStatus('idle')}
                originalText={text}
                polishedText={result}
                onAccept={handleAccept}
                onRetry={handleRetry}
                isRetrying={status === 'loading'}
            />
        </>
    );
};