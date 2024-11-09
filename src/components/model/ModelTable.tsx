import React, { useState, useMemo } from 'react';
import { Model, ModelConfig, ModelEngineType, ModelUsageType } from '../../types/model';
import { PlayIcon, StopIcon, TrashIcon, DocumentTextIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface ModelTableProps {
  models: Model[];
  onStart: (config: ModelConfig) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onViewLogs: (id: string) => void;
}

type SortField = 'name' | 'status' | 'engine' | 'usageType' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function ModelTable({
  models,
  onStart,
  onStop,
  onDelete,
  onViewLogs,
}: ModelTableProps) {
  const [engineTypeFilter, setEngineTypeFilter] = useState<ModelEngineType | 'all'>('all');
  const [usageTypeFilter, setUsageTypeFilter] = useState<ModelUsageType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    running: 'bg-green-100 text-green-800',
    stopped: 'bg-red-100 text-red-800',
    error: 'bg-yellow-100 text-yellow-800',
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedModels = useMemo(() => {
    return models
      .filter(model => {
        const matchesEngineType = engineTypeFilter === 'all' || model.engine === engineTypeFilter;
        const matchesUsageType = usageTypeFilter === 'all' || model.usageType === usageTypeFilter;
        const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (model.containerId?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        return matchesEngineType && matchesUsageType && matchesSearch;
      })
      .sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        if (sortField === 'createdAt') {
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
        }
        
        const aValue = a[sortField as keyof Model];
        const bValue = b[sortField as keyof Model];
        
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * direction;
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * direction;
        }
        
        return ((aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * direction);
      });
  }, [models, engineTypeFilter, usageTypeFilter, sortField, sortDirection, searchTerm]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUpIcon className="h-4 w-4 inline ml-1" /> : 
      <ArrowDownIcon className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="모델 이름 또는 컨테이너 ID로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={engineTypeFilter}
              onChange={(e) => setEngineTypeFilter(e.target.value as ModelEngineType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">모든 엔진</option>
              <option value="ollama">Ollama</option>
              <option value="vllm">VLLM</option>
            </select>
            <select
              value={usageTypeFilter}
              onChange={(e) => setUsageTypeFilter(e.target.value as ModelUsageType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">모든 용도</option>
              <option value="embedding">Embedding</option>
              <option value="generation">Generation</option>
              <option value="rerank">Rerank</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-dark-card rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
          <thead className="bg-gray-50 dark:bg-dark-hover">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                모델 이름 <SortIcon field="name" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('engine')}
              >
                엔진 타입 <SortIcon field="engine" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('usageType')}
              >
                용도 <SortIcon field="usageType" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                상태 <SortIcon field="status" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                컨테이너 ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GPU ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-dark-border">
            {filteredAndSortedModels.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {model.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.engine}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.usageType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[model.status]}`}>
                    {model.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.containerId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.gpuId || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {model.status === 'stopped' ? (
                      <button
                        onClick={() => onStart({
                          engine: model.engine,
                          usageType: model.usageType,
                          name: model.name,
                          gpuId: model.gpuId || undefined,
                        })}
                        className="text-green-600 hover:text-green-900"
                        title="시작"
                      >
                        <PlayIcon className="h-5 w-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onStop(model.id)}
                        className="text-red-600 hover:text-red-900"
                        title="중지"
                      >
                        <StopIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onViewLogs(model.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="로그 보기"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(model.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="삭제"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 