import React from 'react';
import { Model, ModelConfig } from '../../types/model';
import ModelCard from './ModelCard';

interface ModelListProps {
  models: Model[];
  onStart: (config: ModelConfig) => Promise<void>;
  onStop: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onViewLogs: (id: string) => Promise<void>;
  onRestart: (id: string) => Promise<void>;
}

export default function ModelList({
  models,
  onStart,
  onStop,
  onDelete,
  onViewLogs,
  onRestart,
}: ModelListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {models.map((model) => (
        <ModelCard
          key={model.id}
          model={model}
          onStart={onStart}
          onStop={onStop}
          onRemove={onDelete}
          onViewLogs={onViewLogs}
          onRestart={onRestart}
        />
      ))}
    </div>
  );
} 