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

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await modelApi.getModels();
      setModels(response.data);
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
      toast.error('테스트 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">모델 테스트</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">모델 선택</h2>
            <div className="space-y-2">
              {models.map(model => (
                <label key={model.id} className="flex items-center space-x-2">
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

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">프롬프트 입력</h2>
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
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? '테스트 중...' : '테스트 시작'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">응답 결과</h2>
          <div className="space-y-4">
            {responses.map((response, index) => (
              <div key={index} className="border rounded-md p-4">
                    
                <h3 className="font-semibold mb-2">
                  {response.name}
                </h3>
                {response.status === 'error' ? (
                  <p className="text-red-500">{response.message}</p>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm">
                    {response.message}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 