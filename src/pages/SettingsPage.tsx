import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../contexts/ThemeContext';

interface EngineSettings {
  ollama: {
    defaultGpuPolicy: string;
    containerResourceLimits: {
      memory: string;
      cpu: string;
    };
    keepAliveTime: number;
    portRange: {
      start: number;
      end: number;
    };
  };
  vllm: {
    defaultGpuPolicy: string;
    tensorParallelDegree: number;
    quantization: string;
    memorySettings: {
      maxWorkersPerGpu: number;
      maxModelInstances: number;
    };
    portRange: {
      start: number;
      end: number;
    };
  };
}

interface ApiSettings {
  baseUrl: string;
  timeout: number;
  retryPolicy: {
    maxRetries: number;
    retryInterval: number;
  };
  loggingLevel: 'debug' | 'info' | 'warn' | 'error';
}

interface SystemSettings {
  autoStart: boolean;
  resourceMonitoring: {
    gpuUtilizationThreshold: number;
    memoryThreshold: number;
  };
  errorHandling: {
    autoRestart: boolean;
    maxRestartAttempts: number;
  };
}

interface UiSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    enabled: boolean;
    types: string[];
    duration: number;
  };
}

interface Settings {
  engine: EngineSettings;
  api: ApiSettings;
  system: SystemSettings;
  ui: UiSettings;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    engine: {
      ollama: {
        defaultGpuPolicy: '0',
        containerResourceLimits: {
          memory: '8G',
          cpu: '4',
        },
        keepAliveTime: 3600,
        portRange: {
          start: 11434,
          end: 11534,
        },
      },
      vllm: {
        defaultGpuPolicy: '0',
        tensorParallelDegree: 1,
        quantization: 'none',
        memorySettings: {
          maxWorkersPerGpu: 1,
          maxModelInstances: 1,
        },
        portRange: {
          start: 8000,
          end: 8100,
        },
      },
    },
    api: {
      baseUrl: 'http://localhost',
      timeout: 30000,
      retryPolicy: {
        maxRetries: 3,
        retryInterval: 1000,
      },
      loggingLevel: 'info',
    },
    system: {
      autoStart: false,
      resourceMonitoring: {
        gpuUtilizationThreshold: 90,
        memoryThreshold: 90,
      },
      errorHandling: {
        autoRestart: true,
        maxRestartAttempts: 3,
      },
    },
    ui: {
      theme: 'system',
      language: 'ko',
      timezone: 'Asia/Seoul',
      notifications: {
        enabled: true,
        types: ['error', 'warning', 'success'],
        duration: 3000,
      },
    },
  });

  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API 호출 구현
  };

  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Disclosure as="div" className="mt-4" defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-indigo-100 px-4 py-2 text-left text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
            <span>{title}</span>
            <ChevronUpIcon
              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-indigo-500`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">설정</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <SettingsSection title="모델 엔진 설정">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ollama 설정 */}
              <div>
                <h3 className="text-lg font-medium mb-4">Ollama 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      기본 GPU 할당
                    </label>
                    <input
                      type="text"
                      value={settings.engine.ollama.defaultGpuPolicy}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          engine: {
                            ...settings.engine,
                            ollama: {
                              ...settings.engine.ollama,
                              defaultGpuPolicy: e.target.value,
                            },
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  {/* 추가 Ollama 설정 필드들... */}
                </div>
              </div>

              {/* VLLM 설정 */}
              <div>
                <h3 className="text-lg font-medium mb-4">VLLM 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tensor 병렬 처리
                    </label>
                    <input
                      type="number"
                      value={settings.engine.vllm.tensorParallelDegree}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          engine: {
                            ...settings.engine,
                            vllm: {
                              ...settings.engine.vllm,
                              tensorParallelDegree: parseInt(e.target.value),
                            },
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  {/* 추가 VLLM 설정 필드들... */}
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="API 및 시스템 설정">
            {/* API 설정 필드들... */}
          </SettingsSection>

          <SettingsSection title="UI/UX 설정">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  테마
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="light">라이트</option>
                  <option value="dark">다크</option>
                  <option value="system">시스템</option>
                </select>
              </div>
              {/* 추가 UI 설정 필드들... */}
            </div>
          </SettingsSection>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {/* 기본값 복원 로직 */}}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            기본값 복원
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            설정 저장
          </button>
        </div>
      </form>
    </div>
  );
} 