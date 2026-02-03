// src/hooks/useActiveSection/useActiveSection.ts
import { useState, useCallback } from 'react';

export const useActiveSection = (initialId = 'basic') => {
  const [activeSectionId, setActiveSectionId] = useState<string>(initialId);

  // 封装一个切换函数，方便后续扩展逻辑（如埋点或校验）
  const switchSection = useCallback((id: string) => {
    setActiveSectionId(id);
  }, []);

  return {
    activeSectionId,
    setActiveSectionId: switchSection,
  };
};