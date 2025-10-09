export interface GetTokenRequest {
  requestId: string
  clientId: string
  traceId: string
  access_key: string
}

export interface GetTokenResponse {
  requestId: string
  clientId: string
  traceId: string
  code?: number
  message?: string
  timestamp?: string
  processDuration?: number
  access_token?: string
}

export interface VideoAnalysisRequest {
  requestId: string
  clientId: string
  traceId: string
  video_file: File | Blob
}

export interface VideoAnalysisResult {
  analysis_result: FrameResult[]
}

export interface FrameResult {
  frame_time: number
  contents?: FrameContent | null
}

export interface FrameContent {
  general_nsfw?: number | null
  general_suggestive?: number | null
  sexual_intent?: number | null
  undressed?: number | null
  sexual_activity?: number | null
  realistic_nsfw?: number | null
  female_underwear?: number | null
  bra?: number | null
  panties?: number | null
  negligee?: number | null
  female_swimwear?: number | null
  bodysuit?: number | null
  miniskirt?: number | null
  sports_bra?: number | null
  sportswear_bottoms?: number | null
  male_underwear?: number | null
  male_shirtless?: number | null
  cleavage?: number | null
  female_nudity?: number | null
  male_nudity?: number | null
  breast?: number | null
  genitals?: number | null
  butt?: number | null
  bulge?: number | null
  kissing?: number | null
  licking?: number | null
  sex_toy?: number | null
  animal_genitalia_and_human?: number | null
  animated_animal_genitalia?: number | null
  animal_genitalia_only?: number | null
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface HTTPValidationError {
  detail: ValidationError[]
}

export interface VideoAnalysisConfig {
  baseUrl: string
  clientId: string
  accessKey: string
  timeout?: number
}

export interface VideoAnalysisState {
  isLoading: boolean
  error: string | null
  result: VideoAnalysisResult | null
  progress: number
}

export interface AuthState {
  isLoading: boolean
  error: string | null
  token: string | null
  expiresAt: number | null
}

export type ContentType = keyof FrameContent
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

export interface ContentDetection {
  type: ContentType
  confidence: number
  severity: SeverityLevel
  frameTime: number
}

export interface AnalysisSummary {
  totalFrames: number
  flaggedFrames: number
  maxConfidence: number
  detectedContent: ContentDetection[]
  severityBreakdown: Record<SeverityLevel, number>
}
