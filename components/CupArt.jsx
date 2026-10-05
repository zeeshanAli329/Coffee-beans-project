// Placeholder artwork shown when a product has no image yet.
export default function CupArt() {
  return (
    <svg viewBox="0 0 120 120" className="cup-art" role="img" aria-label="Coffee cup">
      <defs><linearGradient id="cupg" x1="0" x2="1"><stop offset="0" stopColor="#f6e7d3" /><stop offset="1" stopColor="#e2c9a8" /></linearGradient></defs>
      <path d="M40 22c-6 6 6 10 0 18M58 18c-6 6 6 10 0 18M76 22c-6 6 6 10 0 18" stroke="#c9a37a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M26 48h60v22a26 26 0 0 1-26 26h-8a26 26 0 0 1-26-26V48Z" fill="url(#cupg)" stroke="#5a3a2a" strokeWidth="3" />
      <path d="M86 54h6a10 10 0 0 1 0 22h-8" fill="none" stroke="#5a3a2a" strokeWidth="3" />
      <ellipse cx="56" cy="48" rx="30" ry="6" fill="#6b3f26" stroke="#5a3a2a" strokeWidth="3" />
      <ellipse cx="56" cy="104" rx="38" ry="5" fill="#5a3a2a" opacity=".18" />
    </svg>
  );
}
