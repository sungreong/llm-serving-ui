import React, { useState, useEffect } from 'react';
import { Model, ModelUsageType } from '../types/model';
import { modelApi } from '../services/api';
import MultiModelTestPanel from '../components/test/MultiModelTestPanel';

function ModelTestPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedUsageType, setSelectedUsageType] = useState<ModelUsageType>(ModelUsageType.GENERATION);
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const response = await modelApi.getModels();
      if (response.data) {
        // running 상태인 모델만 필터링
        const runningModels = response.data.filter(model => model.status === 'running');
        setModels(runningModels);
      }
    } catch (error) {
      console.error('모델 로딩 실패:', error);
    }
  };

  const filteredModels = models.filter(model => model.usageType === selectedUsageType);

  const handleModelSelect = (modelId: string, checked: boolean) => {
    if (checked) {
      const modelToAdd = models.find(m => m.id === modelId);
      if (modelToAdd) {
        setSelectedModels([...selectedModels, modelToAdd]);
      }
    } else {
      setSelectedModels(selectedModels.filter(m => m.id !== modelId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedModels(filteredModels);
    } else {
      setSelectedModels([]);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">모델 테스트</h2>
        
        {/* 모델 타입 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">모델 타입</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedUsageType}
            onChange={(e) => {
              setSelectedUsageType(e.target.value as ModelUsageType);
              setSelectedModels([]);
            }}
          >
            <option value={ModelUsageType.GENERATION}>생성 모델</option>
            <option value={ModelUsageType.EMBEDDING}>임베딩 모델</option>
          </select>
        </div>

        {/* 모델 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">모델 선택</label>
          <div className="border rounded p-4">
            <div className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedModels.length === filteredModels.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span>전체 선택</span>
              </label>
            </div>
            <div className="space-y-2">
              {filteredModels.map(model => (
                <label key={model.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedModels.some(m => m.id === model.id)}
                    onChange={(e) => handleModelSelect(model.id, e.target.checked)}
                  />
                  <span>{model.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 테스트 패널 */}
        {selectedModels.length > 0 && (
          <div className="mt-6">
            <MultiModelTestPanel 
              models={selectedModels}
              usageType={selectedUsageType}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ModelTestPage; 