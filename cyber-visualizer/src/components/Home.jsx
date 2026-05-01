import React, { useCallback, useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Lock, Search, Shield, Smartphone, Mail, Globe2, BadgeInfo, RefreshCw, Database, ShieldAlert, Clock3, Fingerprint, FileSearch, BadgeCheck } from "lucide-react";
import { useTheme } from "../ThemeContext";

const API = import.meta?.env?.VITE_API_URL || "http://localhost:5000";
const SCAN_TYPES = ["EMAIL", "PHONE", "IP", "AADHAAR", "PAN", "URL"];

const TYPE_META = {
  EMAIL: { label: "Email", placeholder: "name@example.com", icon: Mail },
  PHONE: { label: "Phone", placeholder: "9876543210", icon: Smartphone },
  IP: { label: "IP Address", placeholder: "192.168.1.1", icon: Globe2 },
  AADHAAR: { label: "Aadhaar", placeholder: "123456789012", icon: BadgeInfo },
  PAN: { label: "PAN", placeholder: "ABCDE1234F", icon: BadgeInfo },
  URL: { label: "URL", placeholder: "https://example.com", icon: Globe2 }
};

const PREVENTION = {
  EMAIL: [
    "Change mailbox password immediately",
    "Enable 2FA or passkeys on email and recovery accounts",
    "Review connected apps and forwarding rules",
    "Monitor for phishing and password reset abuse"
  ],
  PHONE: [
    "Enable SIM-swap protection with your carrier",
    "Use app-based 2FA instead of SMS OTPs",
    "Never share OTPs or banking credentials via SMS",
    "Block suspicious numbers and report abuse"
  ],
  IP: [
    "Rotate exposed credentials and revoke sessions",
    "Patch services and close unused ports",
    "Use firewall or reverse proxy for assets",
    "Monitor logs for scanning and intrusion attempts"
  ],
  AADHAAR: [
    "Never share full Aadhaar unless required",
    "Use Virtual ID (VID) when possible",
    "Lock biometrics in mAadhaar app",
    "Monitor for document misuse and fraud"
  ],
  PAN: [
    "Avoid credential reuse on PAN-linked services",
    "Check CIBIL and ITR for unauthorized activity",
    "Keep copies restricted and masked",
    "Update passwords on financial accounts"
  ],
  URL: [
    "Never enter credentials on suspicious domains",
    "Verify certificates and domain spelling",
    "Use browser phishing protection",
    "Clear cookies and site storage if compromised"
  ]
};

function toTitle(value = "") {
  return value
    .toString()
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function maskValue(value = "") {
  const text = value.toString().trim();
  if (!text) return "Hidden";
  if (text.length <= 8) return `${text.slice(0, 2)}***${text.slice(-1)}`;
  return `${text.slice(0, 3)}${"*".repeat(Math.max(4, text.length - 7))}${text.slice(-3)}`;
}

function clampRisk(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, numeric));
}

function displayStatus(result) {
  return result?.assessment || result?.displayStatus || result?.status || "UNKNOWN";
}

function getResultPalette(result) {
  const risk = clampRisk(result?.risk);
  const exposed = String(result?.status || "").toUpperCase() === "EXPOSED";

  if (exposed || risk >= 60) {
    return {
      header: "linear-gradient(135deg, #ff4d4d 0%, #b31217 52%, #3a090b 100%)",
      status: "red",
      progress: "bg-red-500",
      border: "rgba(255,59,59,.55)",
      badge: "bg-red-500/10 text-red-300 border-red-500/30",
      leftStripe: "#FF3B3B",
      glow: "0 0 0 1px rgba(255,77,77,.3), 0 26px 90px rgba(179,18,23,.46), inset 0 1px 0 rgba(255,255,255,.08)"
    };
  }

  if (risk > 30) {
    return {
      header: "linear-gradient(135deg, #ffd45f 0%, #ff9a1f 50%, #6b3d03 100%)",
      status: "amber",
      progress: "bg-amber-500",
      border: "rgba(255,200,87,.5)",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
      leftStripe: "#FFC857",
      glow: "0 0 0 1px rgba(255,200,87,.28), 0 22px 70px rgba(255,138,0,.38), inset 0 1px 0 rgba(255,255,255,.08)"
    };
  }

  return {
    header: "linear-gradient(135deg, #1ef8a6 0%, #10b981 48%, #064e3b 100%)",
    status: "green",
    progress: "bg-emerald-500",
    border: "rgba(16,185,129,.5)",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    leftStripe: "#00FF9C",
    glow: "0 0 0 1px rgba(16,185,129,.3), 0 24px 72px rgba(16,185,129,.4), inset 0 1px 0 rgba(255,255,255,.08)"
  };
}

function getResultTone(result) {
  const risk = clampRisk(result?.risk);
  const exposed = String(result?.status || "").toUpperCase() === "EXPOSED";
  if (exposed || risk >= 60) return "high";
  if (risk > 30) return "moderate";
  return "safe";
}

async function hashValue(value = "") {
  const text = value.toString().trim();
  if (!text) return "";

  if (globalThis.crypto?.subtle) {
    const encoded = new TextEncoder().encode(text);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest))
      .slice(0, 12)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(16);
}

function formatDate(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.toString();
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function normalizeInputByType(type, value) {
  const raw = String(value ?? "");

  if (type === "PHONE") {
    return raw.replace(/\D/g, "").slice(0, 10);
  }

  if (type === "AADHAAR") {
    return raw.replace(/\D/g, "").slice(0, 12);
  }

  if (type === "PAN") {
    return raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 10);
  }

  return raw;
}

function maxLengthByType(type) {
  if (type === "PHONE") return 10;
  if (type === "AADHAAR") return 12;
  if (type === "PAN") return 10;
  return undefined;
}

function Home() {
  const { dark } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [selectedType, setSelectedType] = useState("EMAIL");
  const [identifier, setIdentifier] = useState("");
  const [useLocalDb, setUseLocalDb] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scanning, setScanning] = useState(0);
  const [privacyFingerprint, setPrivacyFingerprint] = useState("");

  const lowPowerDevice = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const memory = Number(navigator.deviceMemory || 0);
    const cpu = Number(navigator.hardwareConcurrency || 0);
    const isAndroid = /android/i.test(navigator.userAgent || "");
    return isAndroid && ((memory > 0 && memory <= 4) || (cpu > 0 && cpu <= 6));
  }, []);

  const useLiteMotion = prefersReducedMotion || lowPowerDevice;

  const PreventionItems = useMemo(() => PREVENTION[selectedType] || PREVENTION.EMAIL, [selectedType]);

  // Auto-enable local DB for Aadhaar and PAN
  useEffect(() => {
    if (selectedType === "AADHAAR" || selectedType === "PAN") {
      setUseLocalDb(true);
    } else {
      setUseLocalDb(false);
    }
  }, [selectedType]);

  useEffect(() => {
    if (isOpen && result) {
      hashValue(result.identifier || "").then((hash) => {
        setPrivacyFingerprint(hash);
      });
    } else {
      setPrivacyFingerprint("");
    }
  }, [isOpen, result]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("modalStateChange", {
        detail: { isModalOpen: isOpen }
      })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("modalStateChange", {
          detail: { isModalOpen: false }
        })
      );
    };
  }, [isOpen]);

  const validateInput = useCallback((type, value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Please enter a value to scan.";

    switch (type) {
      case "EMAIL":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? "" : "Invalid email format.";
      case "PHONE":
        return /^[6-9]\d{9}$/.test(trimmed) ? "" : "Invalid 10-digit Indian phone number.";
      case "IP":
        return /^((25[0-5]|2[0-4]\d|1?\d?\d)(\.|$)){4}$/.test(trimmed) ? "" : "Invalid IPv4 address.";
      case "AADHAAR":
        return /^\d{12}$/.test(trimmed) ? "" : "Aadhaar must be 12 digits.";
      case "PAN":
        return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(trimmed.toUpperCase()) ? "" : "Invalid PAN format.";
      case "URL":
        try {
          new URL(trimmed);
          return "";
        } catch {
          return "Invalid URL format.";
        }
      default:
        return "";
    }
  }, []);

  const handleScan = useCallback(async () => {
    const nextError = validateInput(selectedType, identifier);
    setError(nextError);
    if (nextError) return;

    const scannedIdentifier = identifier.trim();

    setLoading(true);
    setScanning(0);
    
    try {
      const scanInterval = setInterval(() => {
        setScanning(prev => (prev >= 95 ? 95 : prev + Math.random() * 40));
      }, 200);

      const response = await fetch(`${API}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: selectedType,
          identifier: scannedIdentifier,
          localMode: useLocalDb
        })
      });

      clearInterval(scanInterval);

      if (!response.ok) {
        throw new Error("Scan failed");
      }

      const data = await response.json();
      const scanResult = data?.result || data?.attack || data?.data || data;

      if (scanResult && typeof scanResult === "object") {
        const normalizedStatus = String(scanResult.status || "").toUpperCase();
        const fallbackRisk = normalizedStatus === "EXPOSED" ? 85 : 0;
        const nextResult = {
          ...scanResult,
          type: (scanResult.type || selectedType).toUpperCase(),
          identifier: scanResult.identifier || scannedIdentifier,
          status: scanResult.status || (scanResult.exposed ? "EXPOSED" : "SAFE"),
          assessment: scanResult.assessment || scanResult.displayStatus || "",
          risk: clampRisk(scanResult.risk ?? scanResult.severityScore ?? fallbackRisk),
          source: scanResult.source || (useLocalDb ? "Local SQLite" : "Live API"),
          breachName: scanResult.breachName || "Scan Complete",
          compromisedData: Array.isArray(scanResult.compromisedData) 
            ? scanResult.compromisedData 
            : scanResult.compromisedData ? [scanResult.compromisedData] : ["No confirmed compromise"],
          updatedAt: scanResult.updatedAt || scanResult.scanDate || new Date().toISOString()
        };

        setResult(nextResult);
        setScanning(100);
        setIsOpen(true);
        setIdentifier("");

        // Save to dashboard if logged in
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user?.email) {
          const historyKey = `search_history_${user.email}`;
          const existing = JSON.parse(localStorage.getItem(historyKey) || "[]");
          existing.unshift({ ...nextResult, timestamp: new Date().toISOString() });
          localStorage.setItem(historyKey, JSON.stringify(existing.slice(0, 50)));
        }
      }
    } catch (err) {
      console.error("Scan error:", err);
      setScanning(0);
      setError("Scan failed. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setScanning(0), 300);
    }
  }, [identifier, selectedType, useLocalDb, validateInput]);

  const palette = getResultPalette(result);
  const resultTone = getResultTone(result);

  return (
    <main className="relative min-h-[calc(100vh-4.5rem)] md:min-h-[calc(100vh-6.5rem)] overflow-hidden px-3 pt-3 pb-3 sm:px-6 lg:px-8 flex flex-col" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${dark ? "opacity-100" : "opacity-80"}`}
      >
        <div className={`absolute inset-0 ${dark ? "bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_36%),radial-gradient(circle_at_90%_20%,rgba(56,189,248,0.11),transparent_34%),radial-gradient(circle_at_10%_100%,rgba(2,132,199,0.1),transparent_30%),linear-gradient(rgba(22,78,99,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(22,78,99,0.24)_1px,transparent_1px)]" : "bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_36%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.1),transparent_34%),linear-gradient(rgba(8,145,178,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(8,145,178,0.09)_1px,transparent_1px)]"} bg-[size:100%_100%,100%_100%,100%_100%,30px_30px,30px_30px]`} />
      </div>
      {/* Gradient orbs */}
      {dark && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-blue-900/20 blur-3xl" />
          <div className="absolute right-[-8rem] top-32 h-80 w-80 rounded-full bg-cyan-900/15 blur-3xl" />
        </div>
      )}

      <section className="relative mx-auto w-full max-w-3xl text-center flex-1 flex flex-col overflow-hidden">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-7"
        >
          <h1 className={`text-[1.68rem] leading-tight sm:text-5xl font-black mb-2 sm:mb-3 tracking-[0.12em] sm:tracking-[0.16em] uppercase bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent px-2`}>
            CYBER ATTACK VISUALIZER
          </h1>
          <p className={`text-lg sm:text-2xl font-extrabold ${dark ? "text-cyan-300" : "text-sky-700"}`}>
            Have I Been Breached?
          </p>
          <p className={`mt-2 text-[13px] leading-6 sm:text-base ${dark ? "text-slate-300" : "text-slate-600"} max-w-2xl mx-auto px-2`}>
            Check if your email, phone, Aadhaar, PAN, IP or URL has been exposed in a data breach.
          </p>
        </motion.div>

        {/* Scan Types */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-5 rounded-[26px] border p-2.5 sm:p-3 backdrop-blur-2xl shadow-[0_22px_60px_rgba(0,0,0,.22)]"
          style={{
            background: dark ? "linear-gradient(140deg, rgba(5,18,34,.74), rgba(5,21,37,.58))" : "linear-gradient(140deg, rgba(255,255,255,.76), rgba(240,249,255,.68))",
            borderColor: dark ? "rgba(56,189,248,.24)" : "rgba(14,165,233,.18)",
            boxShadow: dark ? "0 24px 64px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.06)" : "0 20px 52px rgba(2,132,199,.12), inset 0 1px 0 rgba(255,255,255,.8)"
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-2">
          {SCAN_TYPES.map((type) => {
            const active = selectedType === type;
            const Icon = TYPE_META[type].icon;
            return (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setError("");
                  setIdentifier("");
                }}
                className={`group relative overflow-hidden inline-flex items-center justify-center gap-2 px-3 py-3 rounded-full font-bold text-sm transition-all w-full ${
                  active
                    ? "text-[#061522] shadow-lg"
                    : dark 
                      ? "bg-[rgba(7,25,45,.54)] text-[#A7C6DA] hover:bg-[rgba(9,35,61,.76)] border border-[rgba(34,211,238,.2)]"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm"
                }`}
                style={active ? {
                  background: "linear-gradient(135deg,#7dd3fc 0%,#22d3ee 45%,#0ea5e9 100%)",
                  boxShadow: "0 10px 30px rgba(14,165,233,.38), inset 0 1px 0 rgba(255,255,255,.55)"
                } : undefined}
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 hidden w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[360%] sm:block" />
                <Icon size={16} />
                {TYPE_META[type].label}
              </button>
            );
          })}
          </div>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative border rounded-[26px] p-4 sm:p-6 shadow-[0_28px_70px_rgba(0,0,0,.25)] mb-6 backdrop-blur-3xl"
          style={{
            background: dark ? "linear-gradient(145deg, rgba(5,20,36,.84), rgba(7,25,45,.72))" : "linear-gradient(145deg, rgba(255,255,255,.86), rgba(239,246,255,.76))",
            borderColor: dark ? "rgba(56,189,248,.3)" : "rgba(8,145,178,.2)",
            boxShadow: dark ? "0 26px 72px rgba(0,0,0,.36), inset 0 1px 0 rgba(255,255,255,.05)" : "0 20px 58px rgba(2,132,199,.12), inset 0 1px 0 rgba(255,255,255,.86)"
          }}
        >
          <button
            type="button"
            onClick={() => setUseLocalDb(!useLocalDb)}
            disabled={(selectedType === "AADHAAR" || selectedType === "PAN")}
            aria-label={useLocalDb ? "Switch to Live API source" : "Switch to local SQLite source"}
            className={`absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 sm:right-6 sm:top-6 sm:h-12 sm:w-12 ${
              (selectedType === "AADHAAR" || selectedType === "PAN") ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
            }`}
            style={{
              borderColor: !useLocalDb ? "rgba(74,222,128,.5)" : "rgba(56,189,248,.5)",
              background: !useLocalDb
                ? "linear-gradient(135deg, #22c55e 0%, #16a34a 54%, #0f766e 100%)"
                : "linear-gradient(135deg, #38bdf8 0%, #06b6d4 52%, #2563eb 100%)",
              boxShadow: !useLocalDb
                ? "0 0 0 1px rgba(74,222,128,.18), 0 12px 30px rgba(34,197,94,.45), inset 0 1px 0 rgba(255,255,255,.55)"
                : "0 0 0 1px rgba(56,189,248,.2), 0 12px 30px rgba(14,165,233,.42), inset 0 1px 0 rgba(255,255,255,.55)"
            }}
          >
            <Database size={18} className="text-white drop-shadow-[0_2px_6px_rgba(2,6,23,.35)]" />
          </button>

          <div className="mb-4 sm:mb-5 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5 text-left">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border"
                  style={{
                    background: dark ? "rgba(8,32,55,.62)" : "rgba(226,242,255,.7)",
                    borderColor: dark ? "rgba(56,189,248,.34)" : "rgba(14,165,233,.24)"
                  }}
                >
                  <Database size={16} className="text-cyan-300" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                    Scan Source
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    {selectedType === "AADHAAR" || selectedType === "PAN"
                      ? "Local DB required for Aadhaar & PAN"
                      : useLocalDb ? "Offline local database selected" : "Live API lookup selected"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(normalizeInputByType(selectedType, e.target.value))}
              onKeyPress={(e) => e.key === "Enter" && !loading && handleScan()}
              placeholder={TYPE_META[selectedType].placeholder}
              disabled={loading}
              maxLength={maxLengthByType(selectedType)}
              className={`flex-1 px-4 sm:px-5 py-4 rounded-2xl border outline-none transition glass-input text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{
                background: dark ? "rgba(2,16,30,.76)" : undefined,
                borderColor: dark ? "rgba(56,189,248,.34)" : undefined
              }}
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className="group relative overflow-hidden px-8 py-4 rounded-2xl font-bold transition flex items-center justify-center gap-2 whitespace-nowrap text-white disabled:opacity-50 hover:brightness-110 shadow-[0_16px_30px_rgba(16,185,129,.28)] min-h-[56px]"
              style={{
                background: "linear-gradient(135deg, #38bdf8 0%, #06b6d4 48%, #2563eb 100%)",
                boxShadow: "0 16px 34px rgba(14,165,233,.35), inset 0 1px 0 rgba(255,255,255,.55)"
              }}
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 hidden w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[360%] sm:block" />
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Check
                </>
              )}
            </button>
          </div>

          {/* Progress bar */}
          {loading && scanning > 0 && (
            <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scanning}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500"
              />
            </div>
          )}

          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl text-sm font-medium bg-red-600/20 text-red-200 border border-red-500/35 shadow-[0_0_26px_rgba(220,38,38,.22)]">
              {error}
            </div>
          )}
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center mb-4 sm:mb-6"
        >
          {[
            { label: "6 Scan Types", note: "Email, Phone, IP, Aadhaar, PAN, URL" },
            { label: "Offline Ready", note: "SQLite-backed local database" },
            { label: "Instant Results", note: "Real-time breach detection" }
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden border rounded-2xl p-3.5 sm:p-4 backdrop-blur-xl"
              style={{
                background: dark ? "rgba(5,20,36,.7)" : "rgba(255,255,255,.74)",
                borderColor: dark ? "rgba(56,189,248,.32)" : "rgba(8,145,178,.16)",
                boxShadow: dark ? "0 14px 34px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.05)" : "0 10px 28px rgba(8,145,178,.1), inset 0 1px 0 rgba(255,255,255,.85)"
              }}
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 hidden w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[360%] sm:block" />
              <p className="font-bold text-sm sm:text-base" style={{ color: "var(--text-primary)" }}>
                {item.label}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {item.note}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Result Modal */}
      <AnimatePresence>
        {isOpen && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: useLiteMotion ? 0.14 : 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-2 sm:px-4 pt-4 pb-2 sm:py-4 bg-black/35 backdrop-blur-[8px] sm:backdrop-blur-xl sm:p-6 modal-overlay"
            style={{
              backdropFilter: useLiteMotion ? "blur(8px)" : undefined,
              WebkitBackdropFilter: useLiteMotion ? "blur(8px)" : undefined
            }}
          >
            <motion.div
              initial={useLiteMotion ? { opacity: 0, y: 24 } : { opacity: 0, y: 48, scale: 0.97 }}
              animate={useLiteMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
              exit={useLiteMotion ? { opacity: 0, y: 20 } : { opacity: 0, y: 40, scale: 0.98 }}
              transition={useLiteMotion ? { duration: 0.18, ease: "easeOut" } : { type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
              className={`border w-full max-w-5xl rounded-t-[30px] sm:rounded-[30px] overflow-hidden relative h-[90dvh] sm:h-auto sm:max-h-[94vh] flex flex-col modal-card`}
              style={{
                background: dark ? "linear-gradient(180deg, rgba(5,20,16,.95), rgba(6,16,14,.92))" : "linear-gradient(180deg, rgba(255,255,255,.97), rgba(248,250,252,.95))",
                borderColor: palette.border,
                boxShadow: palette.glow
              }}
            >
              <div className="absolute left-1/2 top-2 z-20 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/35 sm:hidden" />

              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-3 top-3 z-20 rounded-full p-2 transition shadow-lg"
                style={{ 
                  backgroundColor: dark ? "rgba(2, 10, 8, 0.86)" : "rgba(255, 255, 255, 0.9)",
                  color: dark ? "#f1f5f9" : "#334155"
                }}
                aria-label="Close result"
              >
                ✕
              </button>

              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 sm:px-5 py-4 sm:py-5 pr-14 sm:pr-16 text-white"
                style={{ background: palette.header }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-75">Scan Result</p>
                    <h2 className="text-lg sm:text-2xl font-black mt-1 break-all">{maskValue(result.identifier)}</h2>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-sm opacity-95">
                  <span>{TYPE_META[result.type]?.label}</span>
                  <span>•</span>
                  <span>{result.source}</span>
                  <span>•</span>
                  <span>Assessment: {displayStatus(result)}</span>
                </div>
                <div className="mt-3 inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide"
                     style={{
                       background: resultTone === "high" ? "rgba(127,29,29,.34)" : resultTone === "moderate" ? "rgba(120,53,15,.32)" : "rgba(6,95,70,.32)",
                       borderColor: resultTone === "high" ? "rgba(254,202,202,.46)" : resultTone === "moderate" ? "rgba(253,230,138,.44)" : "rgba(167,243,208,.42)"
                     }}>
                  {resultTone === "high" ? "Critical Exposure" : resultTone === "moderate" ? "Moderate Risk" : "No Confirmed Exposure"}
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={useLiteMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: useLiteMotion ? 0.16 : 0.28, delay: useLiteMotion ? 0 : 0.08, ease: "easeOut" }}
                className="flex-1 min-h-0 p-3.5 sm:p-5 space-y-4 sm:space-y-5 pt-4 sm:pt-5 overflow-y-auto"
              >
                {/* Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Status", value: displayStatus(result), tone: result.status === "EXPOSED" ? "red" : result.assessment ? "cyan" : "green", icon: result.status === "EXPOSED" ? ShieldAlert : BadgeCheck },
                    { label: "Risk Score", value: `${clampRisk(result.risk)}/100`, tone: clampRisk(result.risk) > 70 ? "red" : clampRisk(result.risk) > 40 ? "amber" : "cyan", icon: AlertTriangle },
                    { label: "Source", value: result.source || "Unknown", tone: "blue", icon: FileSearch },
                    { label: "Checked At", value: formatDate(result.updatedAt || result.scanDate), tone: "slate", icon: Clock3 }
                  ].map((item) => {
                    const ToneIcon = item.icon;
                    const toneClass = {
                      red: dark ? "bg-red-950/55 text-red-200 border-red-900/70 shadow-[0_0_26px_rgba(220,38,38,.24)]" : "bg-red-50 text-red-700 border-red-200",
                      amber: dark ? "bg-amber-950/50 text-amber-200 border-amber-900/70 shadow-[0_0_24px_rgba(245,158,11,.2)]" : "bg-amber-50 text-amber-700 border-amber-200",
                      green: dark ? "bg-emerald-950/55 text-emerald-200 border-emerald-900/70 shadow-[0_0_24px_rgba(16,185,129,.2)]" : "bg-emerald-50 text-emerald-700 border-emerald-200",
                      cyan: dark ? "bg-cyan-950/45 text-cyan-200 border-cyan-900/60" : "bg-cyan-50 text-cyan-700 border-cyan-200",
                      blue: dark ? "bg-sky-950/45 text-sky-200 border-sky-900/60" : "bg-sky-50 text-sky-700 border-sky-200",
                      slate: dark ? "bg-slate-900/80 text-slate-200 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200"
                    }[item.tone];

                    return (
                      <div key={item.label} className={`border rounded-2xl p-4 glass-card-compact ${toneClass}`}>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <p className="text-xs font-bold uppercase tracking-wider opacity-80">{item.label}</p>
                          <ToneIcon size={16} />
                        </div>
                        <p className="text-base sm:text-lg font-black leading-tight break-words">{item.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border p-3 sm:p-4" style={{
                  borderColor: palette.border,
                  background: dark ? "rgba(2,14,10,.75)" : "rgba(255,255,255,.82)"
                }}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Overall Risk</p>
                    <p className="text-sm font-black" style={{ color: "var(--text-primary)" }}>{clampRisk(result.risk)}%</p>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
                  <div
                    className={`h-full rounded-full transition-all ${clampRisk(result.risk) > 70 ? "bg-red-500" : clampRisk(result.risk) > 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${clampRisk(result.risk)}%` }}
                  />
                </div>
                </div>

                {/* Breach Details */}
                <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="glass-card-compact border rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4" style={{ borderLeftWidth: 4, borderLeftColor: palette.leftStripe }}>
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-cyan-500" />
                      <p className="font-black">Exposure Summary</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Breach Record</p>
                        <p className="mt-1.5 font-semibold break-words" style={{ color: "var(--text-primary)" }}>{result.breachName || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Breach Date</p>
                        <p className="mt-1.5 font-semibold" style={{ color: "var(--text-primary)" }}>{result.breachDate || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Identifier Fingerprint</p>
                        <p className="mt-1.5 font-mono text-xs sm:text-sm break-all" style={{ color: "var(--text-secondary)" }}>{privacyFingerprint ? `sha256:${privacyFingerprint}` : "Generating..."}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Privacy Mask</p>
                        <p className="mt-1.5 font-mono text-xs sm:text-sm break-all" style={{ color: "var(--text-secondary)" }}>{maskValue(result.identifier)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card-compact border rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2">
                      <Fingerprint size={18} className="text-cyan-500" />
                      <p className="font-black">Compromised Data</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(result.compromisedData) ? result.compromisedData : [result.compromisedData]).map((item, idx) => (
                        <span
                          key={`${item}-${idx}`}
                          className="glass-badge px-3 py-1.5 rounded-full text-xs font-bold"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="glass-card-compact border rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" />
                    <p className="font-black">Recommended Actions</p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {PreventionItems.map((item, index) => (
                      <div
                        key={item}
                        className="glass rounded-xl p-3.5 border"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div className="glass-card-compact rounded-xl p-3.5 border">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Scan Type</p>
                    <p className="font-semibold">{TYPE_META[result.type]?.label || result.type}</p>
                  </div>
                  <div className="glass-card-compact rounded-xl p-3.5 border">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Mode</p>
                    <p className="font-semibold">{useLocalDb ? "Local Database" : "Live Lookup"}</p>
                  </div>
                  <div className="glass-card-compact rounded-xl p-3.5 border">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Reference</p>
                    <p className="font-semibold break-all">{privacyFingerprint ? `#${privacyFingerprint.slice(0, 10)}` : "Pending"}</p>
                  </div>
                </div>

                <div className="glass-card-compact rounded-2xl p-4 sm:p-5 border" style={{
                  borderColor: palette.border,
                  boxShadow: resultTone === "high"
                    ? "0 0 26px rgba(220,38,38,.2)"
                    : resultTone === "moderate"
                      ? "0 0 24px rgba(245,158,11,.18)"
                      : "0 0 24px rgba(16,185,129,.18)"
                }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Security Guidance</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                    {result.status === "EXPOSED"
                      ? "Treat this as an active exposure. Rotate credentials, check recovery channels, and review financial or government-linked services tied to this identifier."
                      : result.assessment
                        ? "This is a verified lookup, not a breach signal. Keep identity hygiene strong, but do not treat the phone result as an exposure event."
                        : "Keep your identity hygiene strong: use unique passwords, enable MFA, and avoid reusing the same credential across services."}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!isOpen && (
      <footer className="relative mt-auto shrink-0 pt-6 sm:pt-8">
        <div className="mx-auto max-w-5xl px-1 sm:px-2">
          <div className="rounded-full border px-4 py-2.5 backdrop-blur-md glass" style={{ backgroundColor: "rgba(var(--accent-rgb), 0.05)", color: "var(--text-secondary)", borderColor: "var(--border)" }}>
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] font-semibold sm:text-[11px]" style={{ color: "var(--text-primary)" }}>
                <span>DPDP Act 2023 Aligned Privacy Workflow</span>
                <span className="opacity-50">•</span>
                <span>SHA-256 Identifier Fingerprinting</span>
              </div>

              <div className="text-[9px] sm:text-[10px]" style={{ color: "var(--text-secondary)" }}>
                <a href="https://github.com/CoodingN00b7" target="_blank" rel="noreferrer" className="font-semibold transition-colors" style={{ color: "var(--accent)" }}>
                  Developed By Fardeen Akmal
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      )}
    </main>
  );
}

export default Home;
