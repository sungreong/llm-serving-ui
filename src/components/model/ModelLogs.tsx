interface ModelLogsProps {
  modelId: string;
  logs: string[];
  onClose: () => void;
}

export default function ModelLogs({ modelId, logs, onClose }: ModelLogsProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">모델 로그 (ID: {modelId})</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            닫기
          </button>
        </div>
        <div className="overflow-y-auto max-h-96 bg-gray-100 p-4 rounded">
          {logs.map((log, index) => (
            <pre key={index} className="text-sm whitespace-pre-wrap">
              {log}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
} 