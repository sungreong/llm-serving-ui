import { ModelResponse } from '../../types/model';

interface ResponsePanelProps {
  responses: ModelResponse[];
}

export default function ResponsePanel({ responses }: ResponsePanelProps) {
  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <div key={response.data?.modelId} className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            모델 ID: {response.data?.modelId}
          </h4>
          {response.error ? (
            <p className="text-red-600">{response.error}</p>
          ) : (
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {response.data?.response}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
} 