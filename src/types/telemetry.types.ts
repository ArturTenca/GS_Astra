export type TelemetryReading = {
  id: string;
  colonyId: string;
  metricKey: string;
  value: number;
  unit: string;
  recordedAt: string;
};

export type TelemetrySeries = {
  metricKey: string;
  unit: string;
  label: string;
  readings: TelemetryReading[];
};
