import { ModelResponse, ModelInfo } from '../../types/model';

interface ResponsePanelProps {
  responses: ModelResponse[];
  models: ModelInfo[];
}

export default function ResponsePanel({ responses, models }: ResponsePanelProps) {
  return (
    <div className="space-y-4">
      {responses.map((response) => {
        const modelName = models.find(m => m.id === response.id)?.name || response.id;
        return (
          <div key={response.id} className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              {modelName}
            </h4>
            {response.status === 'error' ? (
              <p className="text-red-600">{response.message}</p>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {response.message}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
} 