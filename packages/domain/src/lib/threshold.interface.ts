export interface Threshold {
  id: string;
  sourceId: string;
  createdById: string;
  metricType: 'ENERGY' | 'WATER' | 'WASTE' | 'CARBON';
  maxValue: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateThresholdDto = Omit<
  Threshold,
  'id' | 'createdAt' | 'updatedAt'
>;
