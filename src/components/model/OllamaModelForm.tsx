import React from 'react';
import { ModelConfig, ModelUsageType, ModelEngineType } from '../../types/model';

interface OllamaModelFormProps {
  onSubmit: (config: ModelConfig) => void;
}

export default function OllamaModelForm({ onSubmit }: OllamaModelFormProps) {
  const [modelName, setModelName] = React.useState('');
  const [gpuIds, setGpuIds] = React.useState('0');
  const [usageType, setUsageType] = React.useState<ModelUsageType>(ModelUsageType.GENERATION);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      engine: ModelEngineType.OLLAMA,
      name: modelName,
      gpuId: gpuIds,
      usageType,
      parameters: {}
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          모델 이름
        </label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="예: llama2:7b"
        />
        <a 
          href="https://ollama.com/library" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-500 mt-1 inline-block"
        >
          모델 라이브러리 보기
        </a>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          GPU Device IDs
        </label>
        <input
          type="text"
          value={gpuIds}
          onChange={(e) => setGpuIds(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="예: 0,1,2"
        />
        <p className="mt-1 text-sm text-gray-500">
          콤마로 구분된 GPU ID 목록을 입력하세요
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          모델 용도
        </label>
        <select
          value={usageType}
          onChange={(e) => setUsageType(e.target.value as ModelUsageType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="generation">Generation</option>
          <option value="embedding">Embedding</option>
          <option value="rerank">Rerank</option>
        </select>
        <p className="mt-1 text-sm text-gray-500">
          모델의 주요 용도를 선택하세요
        </p>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        모델 시작
      </button>
    </form>
  );
} 