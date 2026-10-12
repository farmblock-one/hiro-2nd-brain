/** Mặt mèo Tuxedo: đầu đen, mõm và đốm trắng, mắt xanh lá. */
export function CatFace({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Mèo Tuxedo"
    >
      {/* tai */}
      <path d="M14 46 L18 8 L46 24 Z" fill="#1b1d23" stroke="#2f323c" strokeWidth="2" strokeLinejoin="round" />
      <path d="M86 46 L82 8 L54 24 Z" fill="#1b1d23" stroke="#2f323c" strokeWidth="2" strokeLinejoin="round" />
      <path d="M21 36 L23 17 L36 25 Z" fill="#f4a6b8" opacity=".8" />
      <path d="M79 36 L77 17 L64 25 Z" fill="#f4a6b8" opacity=".8" />
      {/* đầu */}
      <ellipse cx="50" cy="56" rx="38" ry="34" fill="#1b1d23" stroke="#2f323c" strokeWidth="2" />
      {/* đốm trắng hình chữ Y */}
      <path d="M50 38 C44 50 34 58 36 74 C40 86 60 86 64 74 C66 58 56 50 50 38 Z" fill="#f6f0e4" />
      {/* mắt */}
      <ellipse cx="34" cy="52" rx="7" ry="8" fill="#9be15d" />
      <ellipse cx="66" cy="52" rx="7" ry="8" fill="#9be15d" />
      <ellipse cx="34" cy="52" rx="2.6" ry="6" fill="#121317" />
      <ellipse cx="66" cy="52" rx="2.6" ry="6" fill="#121317" />
      <circle cx="36" cy="49" r="1.6" fill="#fff" />
      <circle cx="68" cy="49" r="1.6" fill="#fff" />
      {/* mũi và miệng */}
      <path d="M46 66 L54 66 L50 71 Z" fill="#f4a6b8" />
      <path d="M50 71 Q50 77 44 77 M50 71 Q50 77 56 77" fill="none" stroke="#121317" strokeWidth="1.8" strokeLinecap="round" />
      {/* râu */}
      <g stroke="#f6f0e4" strokeWidth="1.2" strokeLinecap="round" opacity=".7">
        <path d="M30 68 L10 64 M30 72 L11 75" />
        <path d="M70 68 L90 64 M70 72 L89 75" />
      </g>
    </svg>
  );
}

/** Mèo ngủ cuộn tròn: dùng khi Inbox trống. */
export function SleepingCat({ className }: { className?: string }) {
  return (
    <svg
      width="160"
      height="110"
      viewBox="0 0 160 110"
      className={className}
      role="img"
      aria-label="Mèo Tuxedo đang ngủ"
    >
      <ellipse cx="80" cy="76" rx="62" ry="30" fill="#1b1d23" stroke="#2f323c" strokeWidth="2" />
      {/* ngực trắng */}
      <ellipse cx="62" cy="88" rx="22" ry="12" fill="#f6f0e4" />
      {/* đầu gối lên chân */}
      <circle cx="52" cy="64" r="24" fill="#1b1d23" stroke="#2f323c" strokeWidth="2" />
      <path d="M32 50 L34 30 L48 42 Z" fill="#1b1d23" stroke="#2f323c" strokeWidth="2" strokeLinejoin="round" />
      <path d="M72 50 L70 30 L56 42 Z" fill="#1b1d23" stroke="#2f323c" strokeWidth="2" strokeLinejoin="round" />
      <path d="M52 56 C48 64 44 68 46 76 C50 82 56 82 58 76 C60 68 56 64 52 56 Z" fill="#f6f0e4" />
      {/* mắt nhắm */}
      <path d="M38 64 Q43 69 48 64 M56 64 Q61 69 66 64" fill="none" stroke="#9be15d" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M49 72 L55 72 L52 76 Z" fill="#f4a6b8" />
      {/* đuôi */}
      <path d="M130 84 C150 84 152 60 134 56" fill="none" stroke="#1b1d23" strokeWidth="12" strokeLinecap="round" />
      <path d="M130 84 C150 84 152 60 134 56" fill="none" stroke="#2f323c" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
      {/* Zzz */}
      <g fill="#9be15d" fontFamily="ui-rounded, system-ui" fontWeight="700">
        <text x="92" y="30" fontSize="14">z</text>
        <text x="104" y="20" fontSize="11" opacity=".8">z</text>
        <text x="113" y="12" fontSize="9" opacity=".6">z</text>
      </g>
    </svg>
  );
}
