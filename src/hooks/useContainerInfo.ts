import { useState, useEffect } from 'react';
import { ContainerInfo } from '../types/model';
import { modelApi } from '../services/api';

export const useContainerInfo = (modelId: string) => {
  const [containerInfo, setContainerInfo] = useState<ContainerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContainerInfo = async () => {
      try {
        setLoading(true);
        const response = await modelApi.getContainerInfo(modelId);
        setContainerInfo(response.data);
        setError(null);
      } catch (err) {
        setError('컨테이너 정보를 가져오는데 실패했습니다.');
        setContainerInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (modelId) {
      fetchContainerInfo();
    }

    const intervalId = setInterval(() => {
      if (modelId) {
        fetchContainerInfo();
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [modelId]);

  return { containerInfo, loading, error };
}; 