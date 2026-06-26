type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="brand-logo" aria-label="Diagnóstico 360">
      <div className={compact ? "brand-mark brand-mark-compact" : "brand-mark"}>
        <svg viewBox="0 0 34 34" aria-hidden="true">
          <path
            d="M4 26 L9 16 L14 21 L21 9 L30 9"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.8"
          />
          <circle cx="30" cy="9" fill="currentColor" r="3" />
        </svg>
      </div>
      {!compact && (
        <div className="brand-word">
          Diagnóstico<span>360</span>
        </div>
      )}
    </div>
  );
}
