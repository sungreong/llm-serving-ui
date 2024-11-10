import { useState, useEffect, useMemo } from 'react';
import { modelApi } from '../services/api';
import ModelCard from '../components/model/ModelCard';
import CreateModelModal from '../components/model/CreateModelModal';
import ModelLogs from '../components/model/ModelLogs';
import { ModelInfo, ModelConfig, ModelEngineType, ModelStatus } from '../types/model';
import { PlusIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

type SortField = 'name' | 'status' | 'engine' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function ModelManagementPage() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ModelStatus | 'all'>('all');
  const [engineFilter, setEngineFilter] = useState<ModelEngineType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setIsLoading(true);
      console.log(process.env.REACT_APP_API_URL);
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
      console.log(config);
      await modelApi.startModel(config);
      await fetchModels();
      setIsModalOpen(false);

      const checkStatus = setInterval(async () => {
        await fetchModels();
      }, 5000);

      setTimeout(() => {
        clearInterval(checkStatus);
      }, 60000);
    } catch (error) {
      console.error('모델 시작에 실패했습니다:', error);
    }
  };

  const handleStopModel = async (id: string) => {
    try {
      setIsLoading(true);
      console.log(id);
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

  const handleRestartModel = async (id: string) => {
    try {
      setIsLoading(true);
      await modelApi.restartModel(id);
      await fetchModels();
    } catch (error) {
      console.error('모델 재시작에 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedModels = useMemo(() => {
    return models
      .filter(model => {
        const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
        const matchesEngine = engineFilter === 'all' || model.engine === engineFilter;
        return matchesSearch && matchesStatus && matchesEngine;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'engine':
            comparison = a.engine.localeCompare(b.engine);
            break;
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [models, searchTerm, statusFilter, engineFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedModels.size === filteredAndSortedModels.length) {
      setSelectedModels(new Set());
    } else {
      setSelectedModels(new Set(filteredAndSortedModels.map(model => model.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedModels.size) return;
    
    const confirmed = window.confirm(`선택한 ${selectedModels.size}개의 모델을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      setIsLoading(true);
      console.log(selectedModels);
      const promises = Array.from(selectedModels).map(id => modelApi.removeModel(id));
      await Promise.all(promises);
      await fetchModels();
      setSelectedModels(new Set());
      setIsSelectionMode(false);
      toast.success('선택한 모델들이 삭제되었습니다.');
    } catch (error) {
      console.error('모델 일괄 삭제 중 오류 발생:', error);
      toast.error('일부 모델 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">모델 관리</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium
              ${isSelectionMode 
                ? 'bg-gray-100 text-gray-700 border-gray-300' 
                : 'bg-white text-gray-700 border-gray-300'}`}
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {isSelectionMode ? '선택 모드 해제' : '선택 모드'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            새 모델 시작
          </button>
        </div>
      </div>

      {isSelectionMode && (
        <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {selectedModels.size === filteredAndSortedModels.length 
                ? '전체 선택 해제' 
                : '전체 선택'}
            </button>
            <span className="text-sm text-gray-600">
              {selectedModels.size}개 선택됨
            </span>
          </div>
          {selectedModels.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              선택 삭제
            </button>
          )}
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="space-y-4">
          {/* 검색 및 필터링 */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="모델 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ModelStatus | 'all')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">모든 상태</option>
              {Object.values(ModelStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={engineFilter}
              onChange={(e) => setEngineFilter(e.target.value as ModelEngineType | 'all')}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">모든 엔진</option>
              {Object.values(ModelEngineType).map(engine => (
                <option key={engine} value={engine}>{engine}</option>
              ))}
            </select>
          </div>

          {/* 정렬 버튼들 */}
          <div className="flex gap-2">
            {['name', 'status', 'engine', 'createdAt'].map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field as SortField)}
                className={`px-3 py-1 text-sm rounded-md flex items-center gap-1
                  ${sortField === field ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
              >
                {field}
                {sortField === field && (
                  sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 모델 카드 목록 */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="grid gap-4 p-4">
          {filteredAndSortedModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onStart={handleStartModel}
              onStop={handleStopModel}
              onRemove={handleDeleteModel}
              onViewLogs={handleViewLogs}
              onRestart={handleRestartModel}
              isSelectionMode={isSelectionMode}
              isSelected={selectedModels.has(model.id)}
              onSelect={handleSelectModel}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <CreateModelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleStartModel}
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