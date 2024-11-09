import React, { useState } from 'react';
import { Dialog, Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import OllamaModelForm from './OllamaModelForm';
import VLLMModelForm from './VLLMModelForm';
import { ModelConfig } from '../../types/model';

interface CreateModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: ModelConfig) => void;
}

export default function CreateModelModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateModelModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              새 모델 시작
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-indigo-100 p-1 mb-4">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-600'
                  }`
                }
              >
                Ollama
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-600'
                  }`
                }
              >
                VLLM
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <OllamaModelForm onSubmit={onSubmit} />
              </Tab.Panel>
              <Tab.Panel>
                <VLLMModelForm onSubmit={onSubmit} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </Dialog>
  );
} 