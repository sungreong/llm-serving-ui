import React, { useState } from 'react';
import { ModelInfo, ModelConfig, ModelStatus } from '../../types/model';
import { TrashIcon, StopIcon, PlayIcon } from '@heroicons/react/24/outline';

interface ModelCardProps {
  model: ModelInfo;
  onStart: (config: ModelConfig) => Promise<void>;
  onStop: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onViewLogs: (id: string) => Promise<void>;
}

export default function ModelCard({
  model,
  onStart,
  onStop,
  onRemove,
  onViewLogs,
}: ModelCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status: ModelStatus) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStart = () => {
    onStart({ engine: model.engine, name: model.name, usageType: model.usageType });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              getStatusColor(model.status)
            }`}
          >
            {model.status}
          </span>
        </div>
        <div className="flex space-x-2">
          {model.status === 'stopped' ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center p-1 border border-transparent rounded-full text-green-600 hover:bg-green-50"
            >
              <PlayIcon className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => onStop(model.id)}
              className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50"
            >
              <StopIcon className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => onRemove(model.id)}
            className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-600 hover:bg-gray-50"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
        <div>
          <span className="font-medium">컨테이너 ID:</span> {model.containerId}
        </div>
        <div>
          <span className="font-medium">이미지:</span> {model.image}
        </div>
        <div>
          <span className="font-medium">포트:</span> {model.port}
        </div>
        <div>
          <span className="font-medium">GPU ID:</span> {model.gpuId || 'N/A'}
        </div>
      </div>
      <button
        onClick={() => onViewLogs(model.id)}
        className="mt-4 text-sm text-blue-600 hover:text-blue-500"
      >
        로그 보기
      </button>
    </div>
  );
} 