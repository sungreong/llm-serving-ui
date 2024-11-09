import React, { useState } from 'react';
import { ModelConfig, ModelEngineType, ModelUsageType } from '../../types/model';

interface ModelFormProps {
  onSubmit: (config: ModelConfig) => Promise<void>;
  onClose: () => void;
}

export default function ModelForm({ onSubmit, onClose }: ModelFormProps) {
  const [formData, setFormData] = useState<ModelConfig>({
    name: '',
    engine: ModelEngineType.OLLAMA,
    usageType: ModelUsageType.DEVELOPMENT
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">새 모델 시작</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            닫기
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              모델 이름
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              엔진 타입
            </label>
            <select
              value={formData.engine}
              onChange={(e) => setFormData({ ...formData, engine: e.target.value as ModelEngineType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={ModelEngineType.OLLAMA}>Ollama</option>
              <option value={ModelEngineType.VLLM}>vLLM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              사용 용도
            </label>
            <select
              value={formData.usageType}
              onChange={(e) => setFormData({ ...formData, usageType: e.target.value as ModelUsageType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={ModelUsageType.DEVELOPMENT}>개발</option>
              <option value={ModelUsageType.PRODUCTION}>운영</option>
              <option value={ModelUsageType.TESTING}>테스트</option>
              <option value={ModelUsageType.GENERATION}>생성</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              시작
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 