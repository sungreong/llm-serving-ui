import React, { useState, useEffect } from 'react';
import { modelApi } from '../services/api';
import { ModelServingInfo, ModelEngineType , ModelUsageType } from '../types/model';
import { toast } from 'react-hot-toast';
import ModelGuideModal from '../components/model/ModelGuideModal';

export default function ModelServingPage() {
  const [servingInfo, setServingInfo] = useState<ModelServingInfo[]>([]);
  const [isNginxEnabled, setIsNginxEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<{name: string, engine: ModelEngineType} | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    fetchServingInfo();
  }, []);

  const fetchServingInfo = async () => {
    try {
      const response = await modelApi.getServingInfo();
      setServingInfo(response.data);
    } catch (error) {
      toast.error('서빙 정보를 가져오는데 실패했습니다');
    }
  };

  const handleNginxToggle = async () => {
    setIsLoading(true);
    try {
      const response = await modelApi.updateNginxConfig();
      if (response.data.success) {
        setIsNginxEnabled(!isNginxEnabled);
        toast.success('Nginx 설정이 업데이트되었습니다');
        fetchServingInfo(); // 정보 새로고침
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Nginx 설정 업데이트에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">모델 서빙 관리</h1>
        <button
          onClick={handleNginxToggle}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md ${
            isNginxEnabled
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          } text-white font-medium disabled:opacity-50`}
        >
          {isLoading ? '처리 중...' : isNginxEnabled ? 'Nginx 비활성화' : 'Nginx 활성화'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  모델 이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  모델 엔진
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  모델 유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  포트
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  서빙 URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  가이드
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servingInfo.map((info) => (
                <tr key={info.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{info.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500">{info.engine}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs text-gray-500">{info.usageType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      info.status === 'running'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {info.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {info.port || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate">
                    {info.servingUrl ? (
                      <a
                        href={info.servingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {info.servingUrl}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedModel({name: info.name, engine: info.engine});
                        setIsGuideOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      가이드
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedModel && (
        <ModelGuideModal
          isOpen={isGuideOpen}
          onClose={() => {
            setIsGuideOpen(false);
            setSelectedModel(null);
          }}
          modelName={selectedModel.name}
          engineType={selectedModel.engine}
          usageType={servingInfo.find(info => info.name === selectedModel.name)?.usageType || ModelUsageType.GENERATION}
          servingUrl={servingInfo.find(info => info.name === selectedModel.name)?.servingUrl}
        />
      )}
    </div>
  );
} 