import { useState } from 'react';
import { Model } from '../../types/model';
import { modelApi } from '../../services/api';
interface Props {
  model: Model;
}

function GenerationTestPanel({ model }: Props) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const result = await modelApi.testModelGeneration(model.id, prompt);
      setResponse(result.data?.message || '응답 없음');
    } catch (error) {
      console.error('생성 테스트 실패:', error);
      setResponse('오류가 발생했습니다.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">생성 모델 테스트</h3>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="프롬프트를 입력하세요..."
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleTest}
        disabled={loading}
      >
        {loading ? '테스트 중...' : '테스트 실행'}
      </button>
      {response && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
}

export default GenerationTestPanel; 