import React, { useState } from 'react';
import { ModelInfo, ModelConfig, ModelStatus, ModelEngineType, ModelDetailInfo } from '../../types/model';
import { TrashIcon, StopIcon, PlayIcon, ArrowPathIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContainerInfo } from '../../hooks/useContainerInfo';
import { modelApi } from '../../services/api';
import ReactJson from 'react-json-view';

interface ModelCardProps {
  model: ModelInfo;
  onStart: (config: ModelConfig) => Promise<void>;
  onStop: (id: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onViewLogs: (id: string) => Promise<void>;
  onRestart: (id: string) => Promise<void>;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export default function ModelCard({
  model,
  onStart,
  onStop,
  onRemove,
  onViewLogs,
  onRestart,
  isSelectionMode = false,
  isSelected = false,
  onSelect,
}: ModelCardProps) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modelDetails, setModelDetails] = useState<ModelDetailInfo | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { containerInfo, loading, error } = useContainerInfo(model.id);

  const getStatusColor = (status: ModelStatus) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-yellow-100 text-yellow-800';
      case 'starting':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStart = async () => {
    try {
      setIsStarting(true);
      onStart({ 
        engine: model.engine, 
        name: model.name, 
        usageType: model.usageType 
      });
    } catch (error) {
      console.error('모델 시작 요청 실패:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const renderActionButtons = () => {
    switch (model.status) {
      case ModelStatus.STARTING:
        return (
          <>
            <button
              disabled
              className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 cursor-not-allowed"
            >
              <StopIcon className="h-5 w-5" />
            </button>
            <button
              disabled
              className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 cursor-not-allowed"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </>
        );
      case ModelStatus.RUNNING:
        return (
          <>
            <button
              onClick={() => onStop(model.id)}
              className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50"
            >
              <StopIcon className="h-5 w-5" />
            </button>
            <button
              disabled
              className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 cursor-not-allowed"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </>
        );
      case ModelStatus.STOPPED:
        return (
          <button
            onClick={() => onRestart(model.id)}
            disabled={isStarting}
            className={`inline-flex items-center p-1 border border-transparent rounded-full 
              ${isStarting 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:bg-blue-50'
              }`}
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>
        );
      case ModelStatus.ERROR:
        return (
          <>
            <button
              disabled
              className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 cursor-not-allowed"
            >
              <StopIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onRestart(model.id)}
              className="inline-flex items-center p-1 border border-transparent rounded-full text-blue-600 hover:bg-blue-50"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const truncateString = (str: string, length: number = 10) => {
    if (!str) return 'N/A';
    return str.length > length ? `${str.substring(0, length)}...` : str;
  };

  const handleShowDetails = async () => {
    try {
      setIsLoadingDetails(true);
      setShowDetailsModal(true);
      if (!modelDetails) {
        const response = await modelApi.getModelInfo(model.id);
        setModelDetails(response.data);
      }
    } catch (error) {
      console.error('모델 상세 정보를 가져오는데 실패했습니다:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            {isSelectionMode && (
              <div className="mt-1">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect?.(model.id)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(model.status)}`}>
                  {isStarting ? '시작 중...' : model.status}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {model.engine}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            {renderActionButtons()}
            <button
              onClick={() => onRemove(model.id)}
              disabled={model.status === ModelStatus.STARTING}
              className={`inline-flex items-center p-1 border border-transparent rounded-full 
                ${model.status === ModelStatus.STARTING 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <span className="font-medium">컨테이너 ID:</span>{' '}
            <span className="group relative">
              <span className="cursor-help">
                {truncateString(containerInfo?.containerId || 'N/A')}
              </span>
              {containerInfo?.containerId && (
                <span className="invisible group-hover:visible absolute left-0 top-full mt-1 w-auto p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 whitespace-nowrap">
                  {containerInfo.containerId}
                </span>
              )}
            </span>
          </div>
          <div>
            <span className="font-medium">이미지:</span>{' '}
            <span className="group relative">
              <span className="cursor-help">
                {truncateString(containerInfo?.image || 'N/A')}
              </span>
              {containerInfo?.image && (
                <span className="invisible group-hover:visible absolute left-0 top-full mt-1 w-auto p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 whitespace-nowrap">
                  {containerInfo.image}
                </span>
              )}
            </span>
          </div>
          <div>
            <span className="font-medium">포트:</span> {containerInfo?.port || 'N/A'}
          </div>
          <div>
            <span className="font-medium">GPU ID:</span> {containerInfo?.gpuId || 'N/A'}
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => onViewLogs(model.id)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            로그 보기
          </button>
          <button
            onClick={handleShowDetails}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <InformationCircleIcon className="h-5 w-5 mr-1" />
            상세 정보
          </button>
        </div>
      </div>

      {/* 상세 정보 모달 */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">
                {model.name} 상세 정보
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(80vh-8rem)]">
              {isLoadingDetails ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">로딩 중...</p>
                </div>
              ) : modelDetails ? (
                <ReactJson
                  src={modelDetails.details}
                  theme="rjv-default"
                  displayDataTypes={false}
                  enableClipboard={true}
                  style={{ 
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                  }}
                  collapsed={3}
                />
              ) : (
                <div className="text-center text-gray-500">
                  상세 정보를 불러올 수 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
