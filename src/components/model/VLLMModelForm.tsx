import React, { useState, useEffect } from 'react';
import { ModelConfig, ModelUsageType, VLLMModelConfig } from '../../types/model';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { VLLMParameter, VLLMParameterGroup, VLLMParams } from '../../types/vllm';
import vllmParamData from '../../data/vllm_param.json';

interface VLLMModelFormProps {
  onSubmit: (config: Omit<VLLMModelConfig, 'engine'>) => void;
}

export default function VLLMModelForm({ onSubmit }: VLLMModelFormProps) {
  const [modelName, setModelName] = useState('');
  const [gpuIds, setGpuIds] = useState('0');
  const [hfToken, setHfToken] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedParams, setAdvancedParams] = useState<VLLMParams>({});
  const [usageType, setUsageType] = useState<ModelUsageType>(ModelUsageType.GENERATION);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 기본값으로 초기화
    const initialParams: VLLMParams = {};
    (vllmParamData as VLLMParameterGroup[]).forEach(group => {
      group.parameters.forEach(param => {
        const paramName = param.name.replace('--', '');
        initialParams[paramName] = param.default;
      });
    });
    setAdvancedParams(initialParams);
  }, []);

  const handleParamChange = (name: string, value: any) => {
    setAdvancedParams(prev => ({
      ...prev,
      [name.replace('--', '')]: value
    }));
  };

  const renderParameterInput = (param: VLLMParameter) => {
    const paramName = param.name.replace('--', '');
    const value = advancedParams[paramName];

    switch (param.data_type) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value ?? false}
            onChange={(e) => handleParamChange(paramName, e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
        );
      case 'string':
        if (param.options && param.options.length > 0) {
          return (
            <select
              value={value ?? ''}
              onChange={(e) => handleParamChange(paramName, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {param.options.map((option) => (
                <option key={String(option)} value={String(option)}>
                  {String(option)}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            type="text"
            value={value ?? ''}
            onChange={(e) => handleParamChange(paramName, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        );
      case 'integer':
        return (
          <input
            type="number"
            value={value ?? 0}
            onChange={(e) => handleParamChange(paramName, parseInt(e.target.value))}
            step={1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        );
      case 'float':
        return (
          <input
            type="number"
            value={value ?? 0}
            onChange={(e) => handleParamChange(paramName, parseFloat(e.target.value))}
            step={0.1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: modelName,
      gpuId: gpuIds,
      usageType,
      parameters: {
        huggingface_token: hfToken,
        ...advancedParams
      }
    });
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 기본 필드들 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">모델 이름</label>
        <input
          type="text"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="예: meta-llama/Llama-2-7b-hf"
          required
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
          required
        />
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
        </select>
      </div>

      {/* 상세 파라미터 토글 버튼 */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md"
      >
        <span>상세 파라미터 설정</span>
        {showAdvanced ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </button>

      {/* 상세 파라미터 섹션 */}
      {showAdvanced && (
        <div className="space-y-6">
          {(vllmParamData as VLLMParameterGroup[]).map((group) => (
            <div key={group.group} className="border rounded-md p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleGroup(group.group)}
              >
                <h3 className="font-medium text-gray-900">{group.group}</h3>
                {expandedGroups.has(group.group) ? 
                  <ChevronUpIcon className="h-5 w-5" /> : 
                  <ChevronDownIcon className="h-5 w-5" />
                }
              </div>
              {expandedGroups.has(group.group) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {group.parameters.map((param) => (
                    <div key={param.name} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {param.name.replace('--', '')}
                        <span className="text-xs text-gray-500 block">
                          {param.description}
                        </span>
                      </label>
                      {renderParameterInput(param)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        모델 시작
      </button>
    </form>
  );
} 