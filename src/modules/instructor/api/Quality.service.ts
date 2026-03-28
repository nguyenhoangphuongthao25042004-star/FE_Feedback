type QualityTrendItem = {
  semester: string
  teachingQualityIndex: number
  facultyAverage: number
}

type QualityIndexData = {
  kpis: {
    teachingQualityIndex: number
    facultyAverage: number
    ranking: number
    trendPercent: number
  }
  trend: QualityTrendItem[]
}

type FeatureImportanceItem = {
  feature: string
  instructorScore: number
  facultyAverage: number
}

const FALLBACK_QUALITY_INDEX: QualityIndexData = {
  kpis: {
    teachingQualityIndex: 4.46,
    facultyAverage: 4.08,
    ranking: 6,
    trendPercent: 3.2
  },
  trend: [
    { semester: '2025-HK1', teachingQualityIndex: 4.16, facultyAverage: 3.87 },
    { semester: '2025-HK2', teachingQualityIndex: 4.28, facultyAverage: 3.96 },
    { semester: '2026-HK1', teachingQualityIndex: 4.32, facultyAverage: 4.01 },
    { semester: '2026-HK2', teachingQualityIndex: 4.46, facultyAverage: 4.08 }
  ]
}

const FALLBACK_FEATURE_IMPORTANCE: FeatureImportanceItem[] = [
  { feature: 'clarity', instructorScore: 88, facultyAverage: 80 },
  { feature: 'fairness', instructorScore: 84, facultyAverage: 79 },
  { feature: 'interaction', instructorScore: 76, facultyAverage: 72 },
  { feature: 'support', instructorScore: 82, facultyAverage: 75 },
  { feature: 'motivation', instructorScore: 79, facultyAverage: 73 },
  { feature: 'course fit', instructorScore: 86, facultyAverage: 78 }
]

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

const normalizeQualityIndex = (payload: unknown): QualityIndexData => {
  const source = (payload as { data?: unknown })?.data ?? payload

  if (!source || !Array.isArray((source as { trend?: unknown }).trend)) {
    return FALLBACK_QUALITY_INDEX
  }

  const trend = ((source as { trend: unknown[] }).trend ?? [])
    .map((item) => {
      const record = item as Record<string, unknown>
      return {
        semester: String(record.semester ?? record.name ?? '-'),
        teachingQualityIndex: Number(record.teachingQualityIndex ?? record.tqi ?? 0),
        facultyAverage: Number(record.facultyAverage ?? record.avgFaculty ?? 0)
      }
    })
    .filter((item) => item.semester !== '-')

  if (trend.length === 0) {
    return FALLBACK_QUALITY_INDEX
  }

  const latest = trend[trend.length - 1]
  const previous = trend[trend.length - 2] ?? trend[trend.length - 1]
  const safePrevious = previous.teachingQualityIndex === 0 ? 1 : previous.teachingQualityIndex
  const computedTrend = Number((((latest.teachingQualityIndex - previous.teachingQualityIndex) / safePrevious) * 100).toFixed(1))
  const sourceRecord = source as Record<string, unknown>
  const sourceKpis = (sourceRecord.kpis ?? {}) as Record<string, unknown>

  return {
    kpis: {
      teachingQualityIndex: Number(sourceKpis.teachingQualityIndex ?? latest.teachingQualityIndex.toFixed(2)),
      facultyAverage: Number(sourceKpis.facultyAverage ?? latest.facultyAverage.toFixed(2)),
      ranking: Number(sourceKpis.ranking ?? sourceRecord.rank ?? 0),
      trendPercent: Number(sourceKpis.trendPercent ?? computedTrend)
    },
    trend
  }
}

const normalizeFeatureImportance = (payload: unknown): FeatureImportanceItem[] => {
  const source = (payload as { data?: unknown })?.data ?? payload

  if (!Array.isArray(source)) {
    return FALLBACK_FEATURE_IMPORTANCE
  }

  const normalized = source
    .map((item) => {
      const record = item as Record<string, unknown>
      return {
        feature: String(record.feature ?? record.name ?? '').trim(),
        instructorScore: Number(record.instructorScore ?? record.value ?? 0),
        facultyAverage: Number(record.facultyAverage ?? record.avg ?? 0)
      }
    })
    .filter((item) => item.feature.length > 0)

  return normalized.length > 0 ? normalized : FALLBACK_FEATURE_IMPORTANCE
}

export const getQualityIndex = async (): Promise<QualityIndexData> => {
  try {
    const response = await fetch('/api/instructor/quality-index', { method: 'GET' })

    if (!response.ok) {
      throw new Error('quality-index request failed')
    }

    const payload = await response.json()
    return normalizeQualityIndex(payload)
  } catch {
    await delay(300)
    return FALLBACK_QUALITY_INDEX
  }
}

export const getFeatureImportance = async (): Promise<FeatureImportanceItem[]> => {
  try {
    const response = await fetch('/api/instructor/feature-importance', { method: 'GET' })

    if (!response.ok) {
      throw new Error('feature-importance request failed')
    }

    const payload = await response.json()
    return normalizeFeatureImportance(payload)
  } catch {
    await delay(300)
    return FALLBACK_FEATURE_IMPORTANCE
  }
}
