export enum ModelEngineType {
  OLLAMA = "ollama",
  VLLM = "vllm"
}

export enum ModelUsageType {
  EMBEDDING = "embedding",
  GENERATION = "generation"
}

export enum ModelStatus {
  RUNNING = "running",
  STOPPED = "stopped",
  ERROR = "error",
  STARTING = "starting"
}

export interface BaseModelConfig {
  name: string;
  usageType: ModelUsageType;
  gpuId?: string;
}

export interface OllamaModelConfig extends BaseModelConfig {
  engine: ModelEngineType.OLLAMA;
  parameters?: {
    temperature?: number;
  };
}

export interface VLLMModelConfig extends BaseModelConfig {
  engine: ModelEngineType.VLLM;
  parameters?: {
    huggingface_token?: string;
    max_tokens?: number;
    temperature?: number;
    tensor_parallel_size?: number;
    gpu_memory_utilization?: number;
  };
}

export type ModelConfig = OllamaModelConfig | VLLMModelConfig;

export interface Model {
  id: string;
  name: string;
  engine: ModelEngineType;
  status: ModelStatus;
  usageType: ModelUsageType;
  createdAt: string;
  updatedAt: string;
  containerId: string | null;
  image: string;
  port: number | null;
  gpuId: string | null;
}

export interface ModelResponse {
  id: string;
  name: string;
  status: string;
  message: string;
  data?: {
    models?: Model[];
    model?: Model;
    logs?: string[];
    modelId?: string;
    error?: string;
    response?: string;
  };
}

export type ModelInfo = Model;

export interface ContainerInfo {
  containerId: string;
  engine: ModelEngineType;
  image: string;
  port: number;
  gpuId?: string;
}

export interface ModelDetailInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  details: any;
}

export interface ModelDetailResponse {
  id: string;
  name: string;
  type: string;
  details: Record<string, any>;
  status: string;
}