export interface PercentileAnchor {
  value: number
  percentile: number
}

export interface PercentileEstimate {
  percentile: number
  comparison: string
  band: string
}

export const incomeAnchors: PercentileAnchor[] = [
  { value: 0, percentile: 0 },
  { value: 105_413, percentile: 50 },
  { value: 290_848, percentile: 90 },
  { value: 2_073_846, percentile: 99 },
  { value: 8_220_379, percentile: 99.9 },
  { value: 34_606_044, percentile: 99.99 },
  { value: 200_198_548, percentile: 99.999 },
]

export const wealthAnchors: PercentileAnchor[] = [
  { value: 0, percentile: 0 },
  { value: 431_138, percentile: 50 },
  { value: 2_198_344, percentile: 90 },
  { value: 8_160_022, percentile: 99 },
  { value: 52_617_860, percentile: 99.9 },
  { value: 368_680_160, percentile: 99.99 },
  { value: 2_756_699_904, percentile: 99.999 },
]

export const financialSource = {
  name: 'World Inequality Lab: Income and Wealth Inequality in India, 1922–2023',
  detail:
    'Tables 2 and 3 provide 2022–23 per-adult income and net-wealth thresholds for the bottom 50%, middle 40%, top 10%, top 1%, and smaller top groups.',
  url: 'https://wid.world/www-site/uploads/2024/03/WorldInequalityLab_WP2024_09_Income-and-Wealth-Inequality-in-India-1922-2023_Final.pdf',
}

function interpolate(value: number, lower: PercentileAnchor, upper: PercentileAnchor) {
  if (lower.value <= 0) {
    const share = value / upper.value
    return lower.percentile + share * (upper.percentile - lower.percentile)
  }

  const logValue = Math.log(value)
  const logLower = Math.log(lower.value)
  const logUpper = Math.log(upper.value)
  const share = (logValue - logLower) / (logUpper - logLower)

  return lower.percentile + share * (upper.percentile - lower.percentile)
}

function describeBand(percentile: number) {
  if (percentile >= 99.999) return 'Top 0.001% or higher'
  if (percentile >= 99.99) return 'Top 0.01%'
  if (percentile >= 99.9) return 'Top 0.1%'
  if (percentile >= 99) return 'Top 1%'
  if (percentile >= 90) return 'Top 10%'
  if (percentile >= 50) return 'Upper half'
  return 'Lower half'
}

function describeComparison(percentile: number) {
  if (percentile >= 99.999) return 'Higher than at least 99.999% of Indian adults'

  const digits = percentile >= 99 ? 2 : percentile >= 90 ? 1 : 0
  return `Higher than about ${percentile.toFixed(digits)}% of Indian adults`
}

export function estimatePercentile(value: number, anchors: PercentileAnchor[]): PercentileEstimate {
  const safeValue = Math.max(0, value)
  const highest = anchors[anchors.length - 1]!

  if (safeValue >= highest.value) {
    return {
      percentile: highest.percentile,
      comparison: describeComparison(highest.percentile),
      band: describeBand(highest.percentile),
    }
  }

  const upperIndex = anchors.findIndex((anchor) => anchor.value >= safeValue)
  const upper = anchors[Math.max(1, upperIndex)]!
  const lower = anchors[Math.max(0, upperIndex - 1)]!
  const percentile = Math.max(0, Math.min(99.999, interpolate(safeValue, lower, upper)))

  return {
    percentile,
    comparison: describeComparison(percentile),
    band: describeBand(percentile),
  }
}

export function formatInr(value: number, compact = false) {
  if (!Number.isFinite(value)) return '₹0'

  if (compact) {
    const absoluteValue = Math.abs(value)
    const sign = value < 0 ? '-' : ''

    if (absoluteValue >= 10_000_000) {
      return `${sign}₹${(absoluteValue / 10_000_000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} cr`
    }

    if (absoluteValue >= 100_000) {
      return `${sign}₹${(absoluteValue / 100_000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} lakh`
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
