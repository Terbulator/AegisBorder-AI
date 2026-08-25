package com.rakshak.ai.engine

data class ThreatPattern(
    val id: String,
    val category: String,
    val severity: String,
    val regex: Regex,
    val urgencyScore: Int,
    val titleHi: String,
    val titleEn: String,
    val voiceHi: String,
    val voiceEn: String
)

data class NlpAnalysisResult(
    val isThreat: Boolean,
    val riskScore: Int,
    val category: String,
    val title: String,
    val voiceMessage: String,
    val matchedUrls: List<String>,
    val matchedPhones: List<String>
)

object IndicNlpEngine {

    private val THREAT_PATTERNS = listOf(
        ThreatPattern(
            id = "ELECTRICITY_CUT",
            category = "URGENCY_UTILITY_FRAUD",
            severity = "CRITICAL",
            regex = Regex("(bijli|electric|power|light|current|bill|vidyut).*(kat|disconn|block|cut|ruk|baje|aaj raat|officer|line)", RegexOption.IGNORE_CASE),
            urgencyScore = 95,
            titleHi = "बिजली कनेक्शन काटने की फर्जी धमकी",
            titleEn = "Urgent Electricity Disconnection Threat",
            voiceHi = "सावधान! बिजली कनेक्शन काटने का फर्जी संदेश आया है। दिए गए नंबर पर कॉल न करें।",
            voiceEn = "Warning! Fake electricity disconnection message. Do not call the given number."
        ),
        ThreatPattern(
            id = "BANK_KYC",
            category = "BANK_IMPERSONATION",
            severity = "CRITICAL",
            regex = Regex("(account|bank|kyc|pan|khata|pancard|yono|debit).*(block|suspend|update|verify|freeze|band|link karo|khatam)", RegexOption.IGNORE_CASE),
            urgencyScore = 92,
            titleHi = "बैंक खाता / केवाईसी बंद होने का फर्जी संदेश",
            titleEn = "Bank Account / KYC Suspension Scam",
            voiceHi = "चेतावनी! बैंक खाता बंद होने का फर्जी लिंक आया है। अपनी गोपनीय जानकारी साझा न करें।",
            voiceEn = "Warning! Fake bank account suspension notice. Do not click links or share OTP."
        ),
        ThreatPattern(
            id = "LOTTERY_CASHBACK",
            category = "LOTTERY_LURE",
            severity = "HIGH",
            regex = Regex("(lottery|jeeta|won|cashback|reward|inam|paisa|kbc|lucky).*(claim|paisa|link|upi|pin|account|khathe)", RegexOption.IGNORE_CASE),
            urgencyScore = 88,
            titleHi = "फर्जी लॉटरी व कैशबैक का लालच",
            titleEn = "Fake Cashback / Lottery Reward Lure",
            voiceHi = "रुकिए! कैशबैक या लॉटरी का पैसा पाने के लिए कभी यूपीआई पिन दर्ज न करें।",
            voiceEn = "Stop! Never enter your UPI PIN to claim lottery or cashback rewards."
        )
    )

    private val URL_REGEX = Regex("(https?://\\S+|www\\.\\S+|[a-zA-Z0-9-]+\\.(?:top|xyz|info|site|buzz|club|online|cc|tk|biz|live|win|apk))", RegexOption.IGNORE_CASE)
    private val PHONE_REGEX = Regex("(?:\\+?91[\\s-]?)?[6-9]\\d{9}")

    fun analyze(text: String, lang: String = "hi"): NlpAnalysisResult {
        if (text.isBlank()) {
            return NlpAnalysisResult(false, 0, "NORMAL", "Safe Message", "", emptyList(), emptyList())
        }

        val normalized = text.replace(Regex("[\\n\\r]+"), " ")
        val matchedUrls = URL_REGEX.findAll(normalized).map { it.value }.toList()
        val matchedPhones = PHONE_REGEX.findAll(normalized).map { it.value }.toList()

        var highestScore = 0
        var detectedCategory = "NORMAL"
        var bestTitle = "Safe Message"
        var bestVoice = ""

        for (pattern in THREAT_PATTERNS) {
            if (pattern.regex.containsMatchIn(normalized)) {
                if (pattern.urgencyScore > highestScore) {
                    highestScore = pattern.urgencyScore
                    detectedCategory = pattern.category
                    bestTitle = if (lang == "hi") pattern.titleHi else pattern.titleEn
                    bestVoice = if (lang == "hi") pattern.voiceHi else pattern.voiceEn
                }
            }
        }

        val hasSuspiciousUrl = matchedUrls.any { it.endsWith(".apk") || it.contains(".top") || it.contains(".xyz") }
        val isThreat = highestScore > 0 || hasSuspiciousUrl
        val finalRisk = if (isThreat) maxOf(highestScore, if (hasSuspiciousUrl) 90 else 75) else 5

        return NlpAnalysisResult(
            isThreat = isThreat,
            riskScore = finalRisk,
            category = detectedCategory,
            title = bestTitle,
            voiceMessage = bestVoice,
            matchedUrls = matchedUrls,
            matchedPhones = matchedPhones
        )
    }
}
