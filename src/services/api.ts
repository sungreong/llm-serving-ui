import axios from 'axios';
import { 
  ModelConfig, 
  ModelInfo, 
  ModelResponse, 
  ModelEngineType,
  ContainerInfo,
  ModelDetailInfo,
  ModelDetailResponse,
  ModelEmbeddingResponse,
  NginxConfig,
  ModelServingInfo
} from '../types/model';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const modelApi = {
  getModels: () => api.get<ModelInfo[]>('/models'),
  startModel: (config: ModelConfig) => api.post<ModelResponse>('/models/start', config),
  stopModel: (id: string) => api.post<ModelResponse>(`/models/${id}/stop`),
  removeModel: (id: string) => api.delete<ModelResponse>(`/models/${id}`),
  getLogs: (id: string) => api.get<{logs: string[]}>(`/models/${id}/logs`),
  testModelGeneration: (id: string, prompt: string) => api.post<ModelResponse>(`/models/${id}/test`, { prompt }),
  testModelEmbedding: (id: string, prompt: string) => api.post<ModelEmbeddingResponse>(`/models/${id}/test`, { prompt }),
  getContainerInfo: (id: string) => api.get<ContainerInfo>(`/models/${id}/container`),
  restartModel: (id: string) => api.post<ModelResponse>(`/models/${id}/restart`),
  getModelInfo: (id: string) => api.get<ModelDetailResponse>(`/models/${id}/info`),
  updateNginxConfig: () => api.post<NginxConfig>('/admin/update-nginx'),
  getServingInfo: () => api.get<ModelServingInfo[]>('/models/serving'),
};



export default api; 