interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Outer hexagon - represents blockchain structure */}
        <defs>
          <linearGradient id="cryptoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-color-[hsl(142,76%,36%)]" />
            <stop offset="50%" className="stop-color-[hsl(120,100%,50%)]" />
            <stop offset="100%" className="stop-color-[hsl(140,60%,45%)]" />
          </linearGradient>
          
          <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" className="stop-color-[hsl(120,100%,50%)]" />
            <stop offset="100%" className="stop-color-[hsl(142,76%,36%)]" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer blockchain hexagon */}
        <polygon
          points="50,5 85,25 85,75 50,95 15,75 15,25"
          fill="url(#cryptoGradient)"
          stroke="hsl(120, 100%, 50%)"
          strokeWidth="2"
          filter="url(#glow)"
          className="animate-pulse-green"
        />
        
        {/* Inner academic symbol - book/graduation cap */}
        <g transform="translate(50,50)">
          {/* Education book base */}
          <rect
            x="-15"
            y="-8"
            width="30"
            height="16"
            rx="2"
            fill="url(#innerGradient)"
            stroke="hsl(120, 100%, 50%)"
            strokeWidth="1"
          />
          
          {/* Book pages */}
          <line x1="-12" y1="-5" x2="12" y2="-5" stroke="hsl(120, 15%, 7%)" strokeWidth="1"/>
          <line x1="-12" y1="0" x2="12" y2="0" stroke="hsl(120, 15%, 7%)" strokeWidth="1"/>
          <line x1="-12" y1="5" x2="12" y2="5" stroke="hsl(120, 15%, 7%)" strokeWidth="1"/>
          
          {/* Blockchain link above */}
          <circle cx="0" cy="-20" r="4" fill="hsl(120, 100%, 50%)" stroke="hsl(142, 76%, 36%)" strokeWidth="1"/>
          <circle cx="-12" cy="-25" r="3" fill="hsl(140, 60%, 45%)" stroke="hsl(142, 76%, 36%)" strokeWidth="1"/>
          <circle cx="12" cy="-25" r="3" fill="hsl(140, 60%, 45%)" stroke="hsl(142, 76%, 36%)" strokeWidth="1"/>
          
          {/* Connection lines */}
          <line x1="-9" y1="-23" x2="-3" y2="-18" stroke="hsl(120, 100%, 50%)" strokeWidth="2"/>
          <line x1="9" y1="-23" x2="3" y2="-18" stroke="hsl(120, 100%, 50%)" strokeWidth="2"/>
          
          {/* Digital verification checkmark */}
          <g transform="translate(18, -12)">
            <circle r="6" fill="hsl(120, 100%, 50%)" stroke="hsl(142, 76%, 36%)" strokeWidth="1"/>
            <path d="M-2,0 L0,2 L4,-2" stroke="hsl(120, 15%, 7%)" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </g>
        </g>
        
        {/* Corner blockchain nodes */}
        <circle cx="20" cy="20" r="2" fill="hsl(120, 100%, 50%)" className="animate-pulse"/>
        <circle cx="80" cy="20" r="2" fill="hsl(140, 60%, 45%)" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
        <circle cx="80" cy="80" r="2" fill="hsl(120, 100%, 50%)" className="animate-pulse" style={{animationDelay: '1s'}}/>
        <circle cx="20" cy="80" r="2" fill="hsl(140, 60%, 45%)" className="animate-pulse" style={{animationDelay: '1.5s'}}/>
      </svg>
    </div>
  );
}

interface LogoTextProps {
  className?: string;
  showSubtitle?: boolean;
}

export function LogoText({ className = "", showSubtitle = true }: LogoTextProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-emerald bg-clip-text text-transparent">
        EduChainX
      </h1>
      {showSubtitle && (
        <p className="text-xs text-muted-foreground mt-1">
          Academic Verification & Financial Forensics
        </p>
      )}
    </div>
  );
}

export function LogoWithText({ className = "", size = "md" }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Logo size={size} />
      <LogoText showSubtitle={size !== "sm"} />
    </div>
  );
}