export interface VLLMParameter {
  name: string;
  description: string;
  data_type: 'string' | 'integer' | 'float' | 'boolean';
  default: any;
  options: any[];
}

export interface VLLMParameterGroup {
  group: string;
  parameters: VLLMParameter[];
}

export interface VLLMParams {
  [key: string]: any;
} 