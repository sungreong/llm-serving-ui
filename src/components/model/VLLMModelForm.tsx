import React from 'react';
import { ModelConfig, ModelUsageType, ModelEngineType, VLLMModelConfig } from '../../types/model';

interface VLLMModelFormProps {
  onSubmit: (config: Omit<VLLMModelConfig, 'engine'>) => void;
}

export default function VLLMModelForm({ onSubmit }: VLLMModelFormProps) {
  const [modelName, setModelName] = React.useState('');
  const [gpuIds, setGpuIds] = React.useState('0');
  const [hfToken, setHfToken] = React.useState('');
  const [maxTokens, setMaxTokens] = React.useState(2048);
  const [temperature, setTemperature] = React.useState(0.7);
  const [usageType, setUsageType] = React.useState<ModelUsageType>(ModelUsageType.GENERATION);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: modelName,
      gpuId: gpuIds,
      usageType,
      parameters: {
        huggingface_token: hfToken,
        max_tokens: maxTokens,
        temperature: temperature
      }
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
          placeholder="예: meta-llama/Llama-2-7b-hf"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          HuggingFace Access Token
        </label>
        <input
          type="password"
          value={hfToken}
          onChange={(e) => setHfToken(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Tokens
          </label>
          <input
            type="number"
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Temperature
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
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