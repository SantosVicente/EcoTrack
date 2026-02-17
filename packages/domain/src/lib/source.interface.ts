export interface Source {
  id: string;
  createdById: string;
  name: string;
  type: 'SENSOR' | 'MANUAL' | 'API';
  location?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type CreateSourceDto = Omit<Source, 'id' | 'createdAt' | 'updatedAt'>;
