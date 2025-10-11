import { ref, computed } from 'vue'
import type { ReportData } from '@/types/report'

// Simple in-memory store for reports
// In a real application, this would be replaced with API calls or a proper state management solution
const reports = ref<
  Map<
    string,
    ReportData & {
      ratingSystem: string
      guidelines: string[]
      customGuidelines: string[]
      suggestedRating?: string
      processingDuration?: number
    }
  >
>(new Map())

export function useReportsStore() {
  // Get all reports
  const allReports = computed(() => Array.from(reports.value.values()))

  // Get a specific report by ID
  const getReport = (reportId: string) => {
    return reports.value.get(reportId) || null
  }

  // Store a new report
  const storeReport = (
    report: ReportData & {
      ratingSystem: string
      guidelines: string[]
      customGuidelines: string[]
      suggestedRating?: string
      processingDuration?: number
    }
  ) => {
    reports.value.set(report.id, report)
    return report
  }

  // Update an existing report
  const updateReport = (reportId: string, updates: Partial<ReportData>) => {
    const existingReport = reports.value.get(reportId)
    if (existingReport) {
      const updatedReport = { ...existingReport, ...updates }
      reports.value.set(reportId, updatedReport)
      return updatedReport
    }
    return null
  }

  // Delete a report
  const deleteReport = (reportId: string) => {
    return reports.value.delete(reportId)
  }

  // Get reports by status
  const getReportsByStatus = (status: 'processing' | 'completed' | 'failed') => {
    return allReports.value.filter(report => report.status === status)
  }

  // Get reports by rating system
  const getReportsByRatingSystem = (ratingSystem: string) => {
    return allReports.value.filter(report => report.ratingSystem === ratingSystem)
  }

  return {
    allReports,
    getReport,
    storeReport,
    updateReport,
    deleteReport,
    getReportsByStatus,
    getReportsByRatingSystem,
  }
}
