import { useState } from 'react';
import { Model } from '../../types/model';
import { modelApi } from '../../services/api';
interface Props {
  model: Model;
}

function EmbeddingTestPanel({ model }: Props) {
  const [text, setText] = useState('');
  const [embeddings, setEmbeddings] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const result = await modelApi.testModelEmbedding(model.id, text);
      setEmbeddings(result.data?.embeddings || []);
    } catch (error) {
      console.error('임베딩 테스트 실패:', error);
      setEmbeddings([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">임베딩 모델 테스트</h3>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="텍스트를 입력하세요..."
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleTest}
        disabled={loading}
      >
        {loading ? '테스트 중...' : '테스트 실행'}
      </button>
      {embeddings.length > 0 && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <p className="mb-2">임베딩 결과 (처음 5개 값):</p>
          <pre className="whitespace-pre-wrap">
            {embeddings.slice(0, 5).join(', ')}...
          </pre>
        </div>
      )}
    </div>
  );
}

export default EmbeddingTestPanel; 