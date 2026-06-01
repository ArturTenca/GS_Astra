import { supabase } from '@/lib/supabase';
import type { TelemetryReading, TelemetrySeries } from '@/types/telemetry.types';
import { BaseRepository } from './base.repository';

const METRIC_LABELS: Record<string, string> = {
  o2_percent: 'O₂ level',
  temp_c: 'Temperature',
  pressure_kpa: 'Pressure',
};

type TelemetryRow = {
  id: string;
  colony_id: string;
  metric_key: string;
  value: number;
  unit: string;
  recorded_at: string;
};

function mapReading(row: TelemetryRow): TelemetryReading {
  return {
    id: row.id,
    colonyId: row.colony_id,
    metricKey: row.metric_key,
    value: Number(row.value),
    unit: row.unit,
    recordedAt: row.recorded_at,
  };
}

export class TelemetryRepository extends BaseRepository {
  async listByColony(colonyId: string, limit = 48): Promise<TelemetryReading[]> {
    const { data, error } = await supabase
      .from('colony_telemetry')
      .select('id, colony_id, metric_key, value, unit, recorded_at')
      .eq('colony_id', colonyId)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapReading);
  }

  async getSeriesByColony(colonyId: string, pointsPerMetric = 12): Promise<TelemetrySeries[]> {
    const readings = await this.listByColony(colonyId, pointsPerMetric * 3);
    const byMetric = new Map<string, TelemetryReading[]>();

    for (const reading of readings) {
      const bucket = byMetric.get(reading.metricKey) ?? [];
      if (bucket.length < pointsPerMetric) {
        bucket.push(reading);
      }
      byMetric.set(reading.metricKey, bucket);
    }

    return Array.from(byMetric.entries()).map(([metricKey, metricReadings]) => ({
      metricKey,
      unit: metricReadings[0]?.unit ?? '',
      label: METRIC_LABELS[metricKey] ?? metricKey,
      readings: metricReadings.reverse(),
    }));
  }
}

export const telemetryRepository = new TelemetryRepository();
