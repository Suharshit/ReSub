// Small inline icons (stroke = currentColor), so no icon library is needed.
type P = { className?: string };

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const Logo = ({ className }: P) => (
  <svg className={className} width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#6d6afe" />
        <stop offset="1" stopColor="#22c55e" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="9" fill="url(#lg)" />
    <path
      d="M10.5 17.5a6 6 0 0 0 10.6 3.4M21.5 14.5a6 6 0 0 0-10.6-3.4"
      stroke="#fff"
      strokeWidth="2.2"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M10.2 7.8v3.6h3.6M21.8 24.2v-3.6h-3.6" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCalendarX = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="4.5" width="18" height="16" rx="3" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4M10 13.5l4 4M14 13.5l-4 4" />
  </svg>
);

export const IconBan = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.6 5.6l12.8 12.8" />
  </svg>
);

export const IconTrendDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 7l6 6 4-4 8 8" />
    <path d="M15 17h6v-6" />
  </svg>
);

export const IconPlug = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 2.5v5M15 2.5v5M6 7.5h12v3a6 6 0 0 1-12 0v-3zM12 16.5v5" />
  </svg>
);

export const IconRadar = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 12l6-6" />
  </svg>
);

export const IconSend = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z" />
  </svg>
);

export const IconChart = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 3v18h18" />
    <path d="M7 15l4-4 3 3 5-6" />
  </svg>
);

export const IconMail = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6l8-3z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </svg>
);

export const IconDownload = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const IconLock = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
