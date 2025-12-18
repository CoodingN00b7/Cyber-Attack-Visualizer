// controllers/scanController.js
const crypto = require('crypto');

// Simulate the logic from Chapter 7.5.1 (Privacy-Preserving Lookup)
exports.performScan = (req, res) => {
    const { identifier, type } = req.body;

    if (!identifier || !type) {
        return res.status(400).json({ error: "Missing identifier or search type" });
    }

    console.log(`[SCAN REQUEST] Type: ${type} | ID: ${identifier}`);

    // 1. HASHING (Chapter 7.5.1)
    // We hash the input so we never store/log the raw email/phone
    const hash = crypto.createHash('sha256').update(identifier).digest('hex');
    console.log(`[SHA-256 HASH] ${hash.substring(0, 15)}...`);

    // 2. SIMULATE DATABASE LOOKUP (Chapter 12.5)
    // In a real production app, this would query Elasticsearch.
    // Here, we simulate a finding for demo purposes (50% chance).
    
    // DELAY SIMULATION (To mimic searching millions of records)
    setTimeout(() => {
        const isExposed = Math.random() > 0.5; // 50% chance of breach

        if (isExposed) {
            // GENERATE SEVERITY SCORE (Chapter 7.5.2)
            // Formula: Weighted scoring based on sensitivity
            let baseScore = 50;
            if (type === 'AADHAAR' || type === 'PAN') baseScore += 30; // Critical Data
            if (type === 'PHONE') baseScore += 20;
            
            const randomVariance = Math.floor(Math.random() * 20);
            const severityScore = Math.min(baseScore + randomVariance, 99);

            res.json({
                status: 'Exposed',
                identifier: identifier,
                type: type,
                hash: hash,
                severityScore: severityScore,
                source: getRandomSource(),
                date: getRandomDate(),
                breachedData: getBreachedFields(type)
            });
        } else {
            res.json({
                status: 'Safe',
                identifier: identifier,
                type: type,
                hash: hash
            });
        }
    }, 2000); // 2 second delay for realism
};

// Helper Functions for Mock Data
function getRandomSource() {
    const sources = [
        "Dark Web Market (Silk Road v3)",
        "Leaked_DB_Maharashtra_Retail.sql",
        "Public Pastebin Dump #9921",
        "Ransomware Group Leak (LockBit)"
    ];
    return sources[Math.floor(Math.random() * sources.length)];
}

function getRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
}

function getBreachedFields(type) {
    if (type === 'EMAIL') return ['Password Hash', 'IP Address', 'Geo-Location'];
    if (type === 'PHONE') return ['SMS Logs', 'IMSI Code', 'Location History'];
    if (type === 'AADHAAR') return ['Biometric ID Ref', 'Linked Bank Acct', 'Address'];
    return ['Mixed Personal Data'];
}