export const mockReport = {
  id: 'report_1760957588204_1c52zuu9r',
  ratingSystemId: 'rating_system_1760956230151_9z7o7jkn1',
  status: 'completed',
  rating: {
    suggested: 'T16',
    analysis:
      'Phim có một số cảnh bạo lực nhẹ, lời thoại mang tính tiêu cực và hình ảnh gợi cảm không kéo dài. Mức phân loại phù hợp là T16 (không dành cho khán giả dưới 16 tuổi).',
  },
  scenes: [
    {
      confidence: 0.94,
      summarize:
        'Xô xát ngắn giữa vài nhân vật, có xuất hiện dao/gậy và động tác mạnh. Mức độ bạo lực vừa, không kéo dài, không tập trung vào chi tiết máu me; bối cảnh căng thẳng với nhịp cắt nhanh và tiếng la hét, va chạm rõ rệt.',
      startTime: '5000000',
      endTime: '15000000',
      guideline: 'Bạo lực (Violence)',
      severity: 'medium',
      screenshots: ['5500000', '7200000', '9800000', '12100000'],
      analysis: {
        video: {
          motion: 0.85,
          blood: 0.3,
          weapons: 0.6,
        },
        audio: {
          scream: 0.7,
          explosion: 0.5,
        },
      },
    },
    {
      confidence: 0.88,
      summarize:
        'Đối thoại xuất hiện một số từ ngữ thô tục rải rác trong cuộc tranh cãi. Mật độ thấp, không nhắm trực tiếp đến nhóm yếu thế; sắc thái gay gắt nhưng không kéo dài, phù hợp diễn biến xung đột tâm lý giữa các nhân vật.',
      startTime: '20000000',
      endTime: '25000000',
      guideline: 'Ngôn ngữ thô tục (Crude Language)',
      severity: 'low',
      screenshots: ['20300000', '22700000', '24100000'],
      analysis: {
        video: {},
        audio: {
          profanity: 0.35,
          aggression: 0.4,
        },
      },
    },
    {
      confidence: 0.81,
      summarize:
        'Cảnh gợi cảm nhẹ với trang phục và góc máy nhấn mạnh cơ thể trong thời lượng ngắn. Không có hành vi tình dục rõ ràng hay hình ảnh lộ liễu; nhạc nền mang tính gợi mở, diễn xuất dừng ở mức ám chỉ và không kích động quá mức.',
      startTime: '30000000',
      endTime: '40000000',
      guideline: 'Khỏa thân, tình dục (Nudity & Sexual Content)',
      severity: 'medium',
      screenshots: ['30200000', '32800000', '34500000', '36900000', '38100000'],
      analysis: {
        video: {
          skin: 0.7,
          focus: 0.5,
        },
        audio: {
          mood: 0.8,
        },
      },
    },
    {
      confidence: 0.75,
      summarize:
        'Hành vi mạo hiểm dễ bị bắt chước, có sử dụng vật dụng nguy hiểm và thái độ thách thức. Ngữ cảnh căng thẳng với rủi ro cao, hậu quả tiềm ẩn nghiêm trọng; cảnh quay nhấn mạnh mức độ nguy hiểm, cần cân nhắc hướng dẫn phụ huynh khi xem.',
      startTime: '45000000',
      endTime: '50000000',
      guideline: 'Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)',
      severity: 'critical',
      screenshots: ['45100000', '46800000', '48300000', '49600000'],
      analysis: {
        video: {
          danger: 0.8,
          weapons: 0.6,
        },
        audio: {
          threat: 0.7,
        },
      },
    },
  ],
  error: {},
  metadata: {
    title: 'Hồi Ức Trong Đêm',
    duration: '01:45:28',
    language: 'vi',
    fileSizeMB: 1200,
    uploadedBy: 'moderator_01',
    aiModel: 'FilmAnalyzer-v2.4',
    version: '2025.10',
  },
  createdAt: {
    _seconds: 1760957588,
    _nanoseconds: 204000000,
  },
  updatedAt: {
    _seconds: 1760957588,
    _nanoseconds: 204000000,
  },
}
