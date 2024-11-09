export enum ModelEngineType {
  OLLAMA = "ollama",
  VLLM = "vllm"
}

export enum ModelUsageType {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TESTING = "testing",
  GENERATION = "generation"
}

export enum ModelStatus {
  RUNNING = "running",
  STOPPED = "stopped",
  ERROR = "error"
}

export interface ModelConfig {
  engine: ModelEngineType;
  name: string;
  usageType: ModelUsageType;
  gpuId?: string;
  parameters?: {
    huggingface_token?: string;
    max_tokens?: number;
    temperature?: number;
  };
}

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
  success: boolean;
  message: string;
  data?: {
    models?: Model[];
    model?: Model;
    logs?: string[];
    modelId?: string;
    error?: string;
    response?: string;
  };
  error?: string;
}

export type ModelInfo = Model;