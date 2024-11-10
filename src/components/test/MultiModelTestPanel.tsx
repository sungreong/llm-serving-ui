import { useState, useRef } from 'react';
import { Model, ModelUsageType, ModelResponse, ModelEmbeddingResponse } from '../../types/model';
import { modelApi } from '../../services/api';

interface Props {
  models: Model[];
  usageType: ModelUsageType;
}

interface TestResult {
  modelId: string;
  modelName: string;
  result: string | number[];
  error?: string;
}

function MultiModelTestPanel({ models, usageType }: Props) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const handleTest = async () => {
    setLoading(true);
    setResults([]);

    const testPromises = models.map(async (model) => {
      try {
        if (usageType === ModelUsageType.GENERATION) {
          const response = await modelApi.testModelGeneration(model.id, input);
          return {
            modelId: model.id,
            modelName: model.name,
            result: response.data?.message || '응답 없음'
          };
        } else {
          const response = await modelApi.testModelEmbedding(model.id, input);
          return {
            modelId: model.id,
            modelName: model.name,
            result: response.data?.embeddings || []
          };
        }
      } catch (error) {
        return {
          modelId: model.id,
          modelName: model.name,
          result: '',
          error: '테스트 실패'
        };
      }
    });

    const results = await Promise.all(testPromises);
    setResults(results);
    setLoading(false);
  };

  const toggleExpand = (modelId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(modelId)) {
      newExpanded.delete(modelId);
    } else {
      newExpanded.add(modelId);
    }
    setExpandedResults(newExpanded);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다.');
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  const renderEmbeddingResult = (result: number[], modelId: string) => {
    const isExpanded = expandedResults.has(modelId);
    const displayResult = isExpanded ? result : result.slice(0, 50);
    const resultString = JSON.stringify(displayResult);

    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">
            임베딩 결과 {isExpanded ? '(전체)' : '(처음 10개 값)'}:
          </p>
          <div className="space-x-2">
            <button
              onClick={() => copyToClipboard(JSON.stringify(result))}
              className="text-blue-500 text-sm hover:text-blue-700"
            >
              전체 복사
            </button>
            <button
              onClick={() => toggleExpand(modelId)}
              className="text-blue-500 text-sm hover:text-blue-700"
            >
              {isExpanded ? '접기' : '더 보기'}
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded border overflow-x-auto max-h-[200px]">
          <pre className="text-sm whitespace-pre-wrap">
            {resultString}
          </pre>
        </div>
      </div>
    );
  };

  const isEmbedding = usageType === ModelUsageType.EMBEDDING;
  const placeholder = isEmbedding ? "텍스트를 입력하세요..." : "프롬프트를 입력하세요...";
  const title = isEmbedding ? "임베딩 모델 테스트" : "생성 모델 테스트";

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleTest}
          disabled={loading}
        >
          {loading ? '테스트 중...' : '테스트 실행'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.modelId} className="p-4 border rounded bg-white shadow-sm">
              <h4 className="font-semibold mb-2">{result.modelName}</h4>
              {result.error ? (
                <div className="text-red-500">{result.error}</div>
              ) : (
                <div>
                  {isEmbedding ? (
                    renderEmbeddingResult(result.result as number[], result.modelId)
                  ) : (
                    <div className="relative">
                      <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                        {result.result as string}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(result.result as string)}
                        className="absolute top-2 right-2 text-blue-500 text-sm hover:text-blue-700"
                      >
                        복사
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiModelTestPanel; 