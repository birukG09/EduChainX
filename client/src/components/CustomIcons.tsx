interface IconProps {
  className?: string;
  size?: number;
}

export function DashboardIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
    </svg>
  );
}

export function CertificateIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
      <path fill="currentColor" d="M14 2v6h6"/>
      <circle fill="currentColor" cx="12" cy="15" r="3"/>
      <path fill="currentColor" d="M10.5 18.5L9 20l1.5 1.5L12 20l1.5 1.5L15 20l-1.5-1.5"/>
    </svg>
  );
}

export function UniversityIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M12 3L2 8l10 5 10-5-10-5z"/>
      <path fill="currentColor" d="M5 10v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/>
      <path fill="currentColor" d="M21 8v8"/>
      <rect fill="currentColor" x="7" y="12" width="2" height="6"/>
      <rect fill="currentColor" x="11" y="12" width="2" height="6"/>
      <rect fill="currentColor" x="15" y="12" width="2" height="6"/>
    </svg>
  );
}

export function UsersIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle fill="currentColor" cx="9" cy="7" r="4"/>
      <path fill="currentColor" d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
      <circle fill="currentColor" cx="16" cy="6" r="3"/>
      <path fill="currentColor" d="M20.2 15.8A3 3 0 0 1 21 18v2"/>
    </svg>
  );
}

export function ChartIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M3 21V3h18v18H3z"/>
      <path fill="none" stroke="currentColor" strokeWidth="2" d="M7 14l3-3 2 2 5-5"/>
      <circle fill="currentColor" cx="7" cy="14" r="2"/>
      <circle fill="currentColor" cx="10" cy="11" r="2"/>
      <circle fill="currentColor" cx="12" cy="13" r="2"/>
      <circle fill="currentColor" cx="17" cy="8" r="2"/>
    </svg>
  );
}

export function AlertIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M12 2L2 22h20L12 2z"/>
      <circle fill="white" cx="12" cy="16" r="1"/>
      <path fill="white" d="M11 10h2v4h-2z"/>
    </svg>
  );
}

export function BlockchainIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect fill="currentColor" x="2" y="4" width="6" height="6" rx="1"/>
      <rect fill="currentColor" x="9" y="4" width="6" height="6" rx="1"/>
      <rect fill="currentColor" x="16" y="4" width="6" height="6" rx="1"/>
      <rect fill="currentColor" x="2" y="14" width="6" height="6" rx="1"/>
      <rect fill="currentColor" x="9" y="14" width="6" height="6" rx="1"/>
      <rect fill="currentColor" x="16" y="14" width="6" height="6" rx="1"/>
      <path fill="currentColor" d="M8 7h1v4h-1zM15 7h1v4h-1z"/>
    </svg>
  );
}

export function SettingsIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle fill="currentColor" cx="12" cy="12" r="3"/>
      <path fill="currentColor" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

export function CodeIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M8 3L4 7l4 4M16 3l4 4-4 4M14 2l-4 20"/>
    </svg>
  );
}

export function LinkIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle fill="currentColor" cx="7" cy="7" r="3"/>
      <circle fill="currentColor" cx="17" cy="17" r="3"/>
      <path fill="currentColor" d="M12 7h5v5M7 17l10-10"/>
    </svg>
  );
}

export function ClockIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <circle fill="currentColor" cx="12" cy="12" r="10"/>
      <path fill="white" d="M12 6v6l4 2"/>
    </svg>
  );
}

export function ShieldIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M12 2L4 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-8-4z"/>
      <path fill="white" d="M9 12l2 2 4-4"/>
    </svg>
  );
}

export function TrendingUpIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M23 6l-9.5 9.5-5-5L1 18l1.5 1.5L9 13l5 5L23 8.5z"/>
    </svg>
  );
}

export function MapIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4z"/>
    </svg>
  );
}

export function AnalyticsIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M3 3v18h18V3H3zm2 2h14v14H5V5zm2 12h2V9H7v8zm4 0h2V7h-2v10zm4 0h2v-6h-2v6z"/>
    </svg>
  );
}

export function AlertTriangleIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path fill="currentColor" d="M12 2L2 22h20L12 2zm0 6l6 10H6l6-10z"/>
      <circle fill="white" cx="12" cy="16" r="1"/>
      <path fill="white" d="M11 10h2v4h-2z"/>
    </svg>
  );
}

// Icon mapping for activity feed
export const IconMap = {
  'custom-certificate': CertificateIcon,
  'custom-alert': AlertIcon,
  'custom-building': UniversityIcon,
  'custom-code': CodeIcon,
  'custom-chain': LinkIcon,
  'custom-clock': ClockIcon,
  'custom-shield': ShieldIcon,
  'custom-chart': ChartIcon,
  'custom-users': UsersIcon,
  'custom-settings': SettingsIcon,
  'custom-blockchain': BlockchainIcon,
  'custom-dashboard': DashboardIcon,
};

interface CustomIconProps {
  name: keyof typeof IconMap;
  className?: string;
  size?: number;
}

export function CustomIcon({ name, className, size }: CustomIconProps) {
  const IconComponent = IconMap[name];
  return IconComponent ? <IconComponent className={className} size={size} /> : null;
}