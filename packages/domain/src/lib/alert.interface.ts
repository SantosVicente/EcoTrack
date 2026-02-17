export interface Alert {
  id: string;
  metricId: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateAlertDto = Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>;
