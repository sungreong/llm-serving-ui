import React, { useState } from 'react';
import { ModelEngineType, ModelUsageType } from '../../types/model';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ModelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  engineType: ModelEngineType;
  usageType: ModelUsageType;
  servingUrl?: string;
}

type TabType = 'curl' | 'python';

export default function ModelGuideModal({ 
  isOpen, 
  onClose, 
  modelName, 
  engineType,
  usageType,
  servingUrl 
}: ModelGuideModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('curl');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (code: string, section: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getCurlExample = () => {
    const realModelName = engineType === ModelEngineType.OLLAMA 
      ? modelName.replace("_", ":")
      : modelName.replace("_", "/");
    const baseUrl = servingUrl || `http://localhost:80/${modelName}/`;
  
    if (engineType === ModelEngineType.OLLAMA) {
      if (usageType === ModelUsageType.EMBEDDING) {
        return `curl -X POST ${baseUrl}api/embed  \\
    -H 'Content-Type: application/json' \\
    -d '{
      "model": "${realModelName}",
      "input": "Hello, World!",
    }'`;
      } else {
        return `curl -X POST ${baseUrl}api/generate \\
    -H 'Content-Type: application/json' \\
    -d '{
      "model": "${realModelName}",
      "prompt": "Hello, World!",
      "stream": false
    }'`;
      }
    } else {
      if (usageType === ModelUsageType.EMBEDDING) {
        return `curl -X POST ${baseUrl}v1/embeddings \\
    -H "Content-Type: application/json" \\
    -d '{
      "model": "${realModelName}",
      "input": "Hello, World!",
      "encoding_format": "float"
    }'`;
      } else {
        return `curl -X POST ${baseUrl}v1/completions \\
    -H "Content-Type: application/json" \\
    -d '{
      "model": "${realModelName}",
      "prompt": "Hello, World!"
    }'`;
      }
    }
  };
  const getPythonExample = () => {
    const realModelName = engineType === ModelEngineType.OLLAMA 
      ? modelName.replace("_", ":")
      : modelName.replace("_", "/");
    const baseUrl = servingUrl || `http://localhost:80/${modelName}/`;
  
    if (engineType === ModelEngineType.OLLAMA) {
      if (usageType === ModelUsageType.EMBEDDING) {
        return `# LangChain을 사용한 방법
  from langchain_ollama import OllamaEmbeddings
  embeddings = OllamaEmbeddings(model='${realModelName}', base_url='${baseUrl}')
  text = "Hello, World!"
  embedding = embeddings.embed_query(text)
  
  # requests를 사용한 직접 API 호출 방법
  import requests
  response = requests.post(
      f"${baseUrl}api/embed",
      json={
          "model": "${realModelName}",
          "input": "Hello, World!",
      }
  )
  print(response.json())`;
      } else {
        return `# LangChain을 사용한 방법
  from langchain_ollama import Ollama
  llm = Ollama(model='${realModelName}', base_url='${baseUrl}')
  response = llm.invoke("Hello, World!")
  
  # requests를 사용한 직접 API 호출 방법
  import requests
  response = requests.post(
      f"${baseUrl}api/generate",
      json={
          "model": "${realModelName}",
          "prompt": "Hello, World!",
          "stream": False
      }
  )
  print(response.json())`;
      }
    } else {
      if (usageType === ModelUsageType.EMBEDDING) {
        return `# OpenAI 클라이언트를 사용한 방법
  from openai import OpenAI

  client = OpenAI(
      api_key="EMPTY",
      base_url="${baseUrl}v1"
  )
  response = client.embeddings.create(
      model="${realModelName}",
      input="Hello, World!"
  )
  
  # LangChain을 사용한 방법
  from langchain_openai import OpenAIEmbeddings
  embeddings = OpenAIEmbeddings(
      model="${realModelName}",
      openai_api_key="EMPTY",
      openai_api_base="${baseUrl}v1"
  )
  text = "Hello, World!"
  embedding = embeddings.embed_query(text)
  
  # requests를 사용한 직접 API 호출 방법
  import requests
  response = requests.post(
      f"{baseUrl}v1/em",
      json={
          "model": "${realModelName}",
          "input": "Hello, World!"
      }
  )
  print(response.json())`;
      } else {
        return `# OpenAI 클라이언트를 사용한 방법
  from openai import OpenAI
  client = OpenAI(
      api_key="EMPTY",
      base_url="${baseUrl}v1"
  )
  response = client.completions.create(
      model="${realModelName}",
      prompt="Hello, World!"
  )
  
  # LangChain을 사용한 방법
  from langchain_openai import OpenAI
  llm = OpenAI(
      model_name="${realModelName}",
      openai_api_key="EMPTY",
      openai_api_base="${baseUrl}v1"
  )
  response = llm.invoke("Hello, World!")
  
  # requests를 사용한 직접 API 호출 방법
  import requests
  response = requests.post(
      f"{baseUrl}v1/completions",
      json={
          "model": "${realModelName}",
          "prompt": "Hello, World!"
      }
  )
  print(response.json())`;
      }
    }
  };

  const CodeBlock = ({ code, section }: { code: string, section: string }) => (
    <div className="relative">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => handleCopy(code, section)}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
        >
          {copiedSection === section ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ClipboardDocumentIcon className="h-5 w-5" />
          )}
          <span>{copiedSection === section ? '복사됨' : '복사'}</span>
        </button>
      </div>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
        <code className="text-sm">{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{modelName} 사용 가이드</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {(['curl', 'python'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-4">
            {activeTab === 'curl' && (
              <CodeBlock code={getCurlExample()} section="curl" />
            )}
            {activeTab === 'python' && (
              <CodeBlock code={getPythonExample()} section="python" />
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 