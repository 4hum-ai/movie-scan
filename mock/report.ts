export const mockReport = {
    "id": "report_1760859176159_q79oaogbx",
    "ratingSystemId": "rating_system_1760758240474_kpnf7t3eb",
    "status": "completed",
    "rating": {
        "suggested": "T16",
        "analysis": "Phim có một số cảnh bạo lực nhẹ, lời thoại mang tính tiêu cực và hình ảnh gợi cảm không kéo dài. Mức phân loại phù hợp là T16 (không dành cho khán giả dưới 16 tuổi)."
    },
    "scenes": [
        {
            "confidence": 0.94,
            "startTime": "2025-10-19T10:00:05Z",
            "endTime": "2025-10-19T10:00:15Z",
            "guideline": "Bạo lực (Violence)",
            "severity": "medium",
            "screenshots": [
                "2025-10-19T10:00:05.5Z",
                "2025-10-19T10:00:07.2Z",
                "2025-10-19T10:00:09.8Z",
                "2025-10-19T10:00:12.1Z"
            ],
            "analysis": {
                "video": {
                    "motionIntensity": 0.85,
                    "bloodDetection": 0.3,
                    "weaponPresence": 0.6
                },
                "audio": {
                    "screamIntensity": 0.7,
                    "explosionPeak": 0.5
                }
            }
        },
        {
            "confidence": 0.88,
            "startTime": "2025-10-19T10:00:20Z",
            "endTime": "2025-10-19T10:00:25Z",
            "guideline": "Ngôn ngữ thô tục (Crude Language)",
            "severity": "low",
            "screenshots": [
                "2025-10-19T10:00:20.3Z",
                "2025-10-19T10:00:22.7Z",
                "2025-10-19T10:00:24.1Z"
            ],
            "analysis": {
                "video": {},
                "audio": {
                    "profanityFrequency": 0.35,
                    "speechToneAggression": 0.4
                }
            }
        },
        {
            "confidence": 0.81,
            "startTime": "2025-10-19T10:00:30Z",
            "endTime": "2025-10-19T10:00:40Z",
            "guideline": "Khỏa thân, tình dục (Nudity & Sexual Content)",
            "severity": "medium",
            "screenshots": [
                "2025-10-19T10:00:30.2Z",
                "2025-10-19T10:00:32.8Z",
                "2025-10-19T10:00:34.5Z",
                "2025-10-19T10:00:36.9Z",
                "2025-10-19T10:00:38.1Z"
            ],
            "analysis": {
                "video": {
                    "skinExposureLevel": 0.7,
                    "cameraFocusDuration": 0.5
                },
                "audio": {
                    "backgroundMusicMood": 0.8
                }
            }
        },
        {
            "confidence": 0.75,
            "startTime": "2025-10-19T10:00:45Z",
            "endTime": "2025-10-19T10:00:50Z",
            "guideline": "Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)",
            "severity": "critical",
            "screenshots": [
                "2025-10-19T10:00:45.1Z",
                "2025-10-19T10:00:46.8Z",
                "2025-10-19T10:00:48.3Z",
                "2025-10-19T10:00:49.6Z"
            ],
            "analysis": {
                "video": {
                    "dangerousAction": 0.8,
                    "weaponHandling": 0.6
                },
                "audio": {
                    "threateningTone": 0.7
                }
            }
        }
    ],
    "error": {},
    "metadata": {
        "title": "Hồi Ức Trong Đêm",
        "duration": "01:45:28",
        "language": "vi",
        "fileSizeMB": 1200,
        "uploadedBy": "moderator_01",
        "aiModel": "FilmAnalyzer-v2.4",
        "version": "2025.10"
    },
    "createdAt": {
        "_seconds": 1760859176,
        "_nanoseconds": 159000000
    },
    "updatedAt": {
        "_seconds": 1760859176,
        "_nanoseconds": 159000000
    }
}