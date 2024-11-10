import React, { useState, useEffect } from 'react';
import { ModelInfo, ModelResponse } from '../types/model';
import { modelApi } from '../services/api';
import { toast } from 'react-hot-toast';

interface TestResponse {
  success: boolean;
  message?: string;
  data?: {
    modelId: string;
    response: string;
    error?: string;
  };
}

export default function ModelTestPage() {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<ModelResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'all' | 'paginated'>('paginated');
  const responsesPerPage = 3;

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await modelApi.getModels();
      const runningModels = response.data.filter(model => model.status === 'running');
      setModels(runningModels);
    } catch (error) {
      toast.error('모델 목록을 가져오는데 실패했습니다');
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModels.length || !prompt.trim()) return;

    setLoading(true);
    setResponses([]);

    try {
      const promises = selectedModels.map(modelId => 
        modelApi.testModel(modelId, prompt)
      );

      const results = await Promise.all(promises);
      console.log(results);
      setResponses(results.map(r => r.data));
    } catch (error) {
      console.error(error);
      toast.error('테스트 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(responses.length / responsesPerPage);
  const currentResponses = viewMode === 'all' 
    ? responses 
    : responses.slice((currentPage - 1) * responsesPerPage, currentPage * responsesPerPage);

  // 전체 선택 함수 추가
  const handleSelectAll = () => {
    if (selectedModels.length === models.length) {
      // 모두 선택된 상태면 전체 해제
      setSelectedModels([]);
    } else {
      // 아니면 전체 선택
      setSelectedModels(models.map(model => model.id));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">모델 테스트</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">모델 선택</h2>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            {selectedModels.length === models.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {models.map(model => (
            <label key={model.id} className="flex items-center space-x-2 min-w-[200px]">
              <input
                type="checkbox"
                checked={selectedModels.includes(model.id)}
                onChange={() => handleModelSelect(model.id)}
                className="rounded text-blue-500"
              />
              <span>{model.name}</span>
            </label>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">프롬프트 입력</h2>
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-2 border rounded-md"
            placeholder="테스트할 프롬프트를 입력하세요"
            required
          />
          <button
            type="submit"
            disabled={loading || !selectedModels.length}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '테스트 중...' : '테스트 시작'}
          </button>
        </div>
      </form>

      {responses.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">응답 결과</h2>
            <div className="flex items-center gap-4">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'all' | 'paginated')}
                className="rounded-md border-gray-300"
              >
                <option value="paginated">페이지 보기 (3개씩)</option>
                <option value="all">전체 보기</option>
              </select>
            </div>
          </div>

          <div className={`grid gap-6 ${
            viewMode === 'all' 
              ? 'grid-cols-1 md:grid-cols-2' 
              : responses.length === 1 
                ? 'grid-cols-1' 
                : responses.length === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-3'
          }`}>
            {currentResponses.map((response, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow flex flex-col">
                <div className="flex flex-col space-y-2 mb-4">
                  <h3 className="text-lg font-semibold break-all">
                    {response.name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-sm self-start ${
                    response.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {response.status === 'error' ? '오류' : '성공'}
                  </span>
                </div>
                {response.status === 'error' ? (
                  <p className="text-red-500">{response.message}</p>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md flex-1 overflow-auto max-h-[400px]">
                    <pre className="whitespace-pre-wrap text-sm">
                      {response.message}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          {viewMode === 'paginated' && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 