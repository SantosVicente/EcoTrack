export interface Metric {
  id: string;
  sourceId: string;
  createdById: string;
  type: 'ENERGY' | 'WATER' | 'WASTE' | 'CARBON';
  rawValue: number;
  calculatedValue?: number;
  unit: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateMetricDto = Omit<
  Metric,
  'id' | 'createdAt' | 'updatedAt' | 'calculatedValue' | 'status'
>;
