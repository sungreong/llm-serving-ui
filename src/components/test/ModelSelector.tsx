import { Model } from '../../types/model';

interface ModelSelectorProps {
  models: Model[];
  selectedModels: string[];
  onSelect: (modelIds: string[]) => void;
}

export default function ModelSelector({
  models,
  selectedModels,
  onSelect,
}: ModelSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">테스트할 모델 선택</label>
      <div className="space-y-2">
        {models.map((model) => (
          <label key={model.id} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedModels.includes(model.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onSelect([...selectedModels, model.id]);
                } else {
                  onSelect(selectedModels.filter((id) => id !== model.id));
                }
              }}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">{model.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 