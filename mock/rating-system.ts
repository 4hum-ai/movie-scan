export const mockRatingSystem = {
    "id": "rating_system_1760758240474_kpnf7t3eb",
    "name": "Vietnam Film Classification",
    "references": [
        {
            "title": "Thông tư số 05/2023/TT-BVHTTDL quy định tiêu chí phân loại phim và thực hiện hiển thị mức phân loại phim, cảnh báo",
            "source": "Bộ Văn hóa, Thể thao và Du lịch (Ministry of Culture, Sports and Tourism)",
            "url": "https://bvhttdl.gov.vn/"
        }
    ],
    "levels": [
        {
            "key": "P",
            "title": "P - Phổ cập",
            "description": "Suitable for all ages",
            "guide": "Nội dung giáo dục, giải trí khuyến khích giá trị đạo đức tích cực và mối quan hệ xã hội. Không có cảnh bạo lực, khỏa thân, ma túy, kinh dị hay ngôn ngữ thô tục."
        },
        {
            "key": "K",
            "title": "K - Kèm theo",
            "description": "Viewers under 13 admitted when accompanied by parents or guardians",
            "guide": "Cần sự hướng dẫn của phụ huynh. Có thể có bạo lực nhẹ, khỏa thân phía sau, yếu tố kinh dị nhẹ nhưng không chi tiết và có kết quả tích cực."
        },
        {
            "key": "T13",
            "title": "T13 - Tuổi 13",
            "description": "Not suitable for viewers under 13 years old",
            "guide": "Không phù hợp với trẻ dưới 13 tuổi. Có thể có bạo lực, kinh dị ở mức trung bình nhưng không chi tiết, không thường xuyên và có tác động nhẹ."
        },
        {
            "key": "T16",
            "title": "T16 - Tuổi 16",
            "description": "Not suitable for viewers under 16 years old",
            "guide": "Không phù hợp với trẻ dưới 16 tuổi. Có thể có bạo lực, khỏa thân ở mức trung bình, kinh dị mạnh, ngôn ngữ thô tục nhưng không thường xuyên."
        },
        {
            "key": "T18",
            "title": "T18 - Tuổi 18",
            "description": "Not suitable for viewers under 18 years old",
            "guide": "Không phù hợp với trẻ dưới 18 tuổi. Có thể có bạo lực mạnh, khỏa thân toàn thân, kinh dị căng thẳng, ngôn ngữ thô tục mạnh nhưng không kéo dài."
        },
        {
            "key": "C",
            "title": "C - Cấm",
            "description": "Prohibited from screening",
            "guide": "Bị cấm chiếu. Vi phạm Điều 9 Luật Điện ảnh. Tất cả các tiêu chí đều ở mức quá mức cho phép."
        }
    ],
    "createdAt": {
        "_seconds": 1760758240,
        "_nanoseconds": 474000000
    },
    "guidelines": [
        {
            "group": "Content Safety",
            "name": "Bạo lực (Violence)",
            "description": "Detect realistic violence situations, presence of children/women in violent scenes, animal abuse, violence encouragement, characters enjoying pain, glorifying violence, gratuitous violence, detailed crime and violence with weapons, painful/bloody images.",
            "keywords": [
                {
                    "key": "violence",
                    "label": "Violence"
                },
                {
                    "key": "crime",
                    "label": "Crime"
                },
                {
                    "key": "weapons",
                    "label": "Weapons"
                },
                {
                    "key": "pain",
                    "label": "Pain"
                },
                {
                    "key": "blood",
                    "label": "Blood"
                }
            ]
        },
        {
            "group": "Content Safety",
            "name": "Khỏa thân, tình dục (Nudity & Sexual Content)",
            "description": "Identify nudity and sexual activities not for pornographic purposes, sexual stimulation behaviors, sexual violence including rape and forced sexual violence, direct/indirect portrayal methods, frequency of sexual content, age of characters in sexual scenes.",
            "keywords": [
                {
                    "key": "nudity",
                    "label": "Nudity"
                },
                {
                    "key": "sexual",
                    "label": "Sexual Content"
                },
                {
                    "key": "rape",
                    "label": "Rape"
                },
                {
                    "key": "sexual-violence",
                    "label": "Sexual Violence"
                }
            ]
        },
        {
            "group": "Content Safety",
            "name": "Kinh dị (Horror)",
            "description": "Identify horror elements causing tension, stimulation, or threatening feelings affecting viewers' psychology and health. Assess impact of realistic, stimulating, and continuous horror sound/image effects, overall film atmosphere, duration and frequency of horror scenes.",
            "keywords": [
                {
                    "key": "horror",
                    "label": "Horror"
                },
                {
                    "key": "fear",
                    "label": "Fear"
                },
                {
                    "key": "tension",
                    "label": "Tension"
                }
            ]
        },
        {
            "group": "Content Safety",
            "name": "Hành vi nguy hiểm, dễ bắt chước (Dangerous Behavior)",
            "description": "Identify detailed descriptions of crime techniques, violence, weapon usage instructions for easily accessible weapons like knives, sharp objects, harmful items. Detect direct/indirect encouragement of imitable actions like drug use, weapons, suicide, self-harm, school violence, or other illegal activities.",
            "keywords": [
                {
                    "key": "dangerous",
                    "label": "Dangerous Behavior"
                },
                {
                    "key": "weapons",
                    "label": "Weapons"
                },
                {
                    "key": "self-harm",
                    "label": "Self-harm"
                },
                {
                    "key": "suicide",
                    "label": "Suicide"
                }
            ]
        },
        {
            "group": "Legal Compliance",
            "name": "Ma túy, chất kích thích (Drugs & Substances)",
            "description": "Detect drug use, stimulants, and addictive substances. Must not guide production, illegal use, advertising, marketing, buying/selling, transportation, storage, or other illegal purposes except when condemning such behavior.",
            "keywords": [
                {
                    "key": "drugs",
                    "label": "Drugs"
                },
                {
                    "key": "substances",
                    "label": "Substances"
                },
                {
                    "key": "addiction",
                    "label": "Addiction"
                }
            ]
        },
        {
            "group": "Cultural Sensitivity",
            "name": "Chủ đề, nội dung (Theme & Content)",
            "description": "Evaluate content impact on emotional, ideological, aesthetic formation and understanding for different age groups. Must not cause distorted perception of moral values, family relationships, ethnicity, religion, children's rights, discrimination, and sensitive topics.",
            "keywords": [
                {
                    "key": "theme",
                    "label": "Theme"
                },
                {
                    "key": "religion",
                    "label": "Religion"
                },
                {
                    "key": "ethnicity",
                    "label": "Ethnicity"
                },
                {
                    "key": "discrimination",
                    "label": "Discrimination"
                }
            ]
        },
        {
            "group": "Age Appropriateness",
            "name": "Ngôn ngữ thô tục (Crude Language)",
            "description": "Detect rude gestures, images, sounds, crude language, insults, vulgarity, profanity including slang. Assess vulgarity level, context usage, community sensitivity, cultural and social aspects related to crude language use, dialogue stimulating sexual abuse interest, discriminatory language violating human rights.",
            "keywords": [
                {
                    "key": "language",
                    "label": "Crude Language"
                },
                {
                    "key": "insults",
                    "label": "Insults"
                },
                {
                    "key": "profanity",
                    "label": "Profanity"
                },
                {
                    "key": "slang",
                    "label": "Slang"
                }
            ]
        }
    ],
    "updatedAt": {
        "_seconds": 1760758503,
        "_nanoseconds": 114000000
    }
}