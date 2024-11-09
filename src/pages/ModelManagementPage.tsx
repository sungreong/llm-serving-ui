import { useState, useEffect } from 'react';
import { modelApi } from '../services/api';
import ModelCard from '../components/model/ModelCard';
import ModelForm from '../components/model/ModelForm';
import ModelLogs from '../components/model/ModelLogs';
import { ModelInfo, ModelConfig } from '../types/model';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ModelManagementPage() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      const response = await modelApi.getModels();
      setModels(response.data);
    } catch (error) {
      console.error('모델 목록을 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartModel = async (config: ModelConfig) => {
    try {
      setIsLoading(true);
      await modelApi.startModel(config);
      await fetchModels();
      setIsModalOpen(false);
    } catch (error) {
      console.error('모델 시작에 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopModel = async (id: string) => {
    try {
      setIsLoading(true);
      await modelApi.stopModel(id);
      await fetchModels();
    } catch (error) {
      console.error('모델 중지에 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      setIsLoading(true);
      await modelApi.removeModel(id);
      await fetchModels();
    } catch (error) {
      console.error('모델 삭제에 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewLogs = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await modelApi.getLogs(id);
      setLogs(response.data.logs);
      setSelectedModelId(id);
      setShowLogs(true);
    } catch (error) {
      console.error('로그를 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">모델 관리</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          새 모델 시작
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid gap-4 p-4">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onStart={handleStartModel}
              onStop={handleStopModel}
              onRemove={handleDeleteModel}
              onViewLogs={handleViewLogs}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <ModelForm
          onSubmit={handleStartModel}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {showLogs && selectedModelId && (
        <ModelLogs
          modelId={selectedModelId}
          logs={logs}
          onClose={() => setShowLogs(false)}
        />
      )}
    </div>
  );
} 