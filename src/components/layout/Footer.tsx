export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-border py-8 px-4">
      <div className="max-w-[520px] mx-auto flex gap-4 items-center">
        <div className="flex items-center gap-1.5 shrink-0">
          <svg className="w-9 h-[18px]" viewBox="0 0 40 20" fill="none">
            <path
              d="M5 15C5 15 10 2 20 10C30 18 35 5 35 5"
              stroke="#E30613"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-[family-name:var(--font-bebas-neue)] text-base tracking-[1px] text-text-primary">
            SMART CHIP
          </span>
        </div>
        <div className="text-[11px] text-text-muted leading-relaxed">
          <p className="text-accent-red font-medium mb-1">No.1 Timing System</p>
          <p>㈜스마트플래닛 Since 2001 www.smartplanet.co.kr</p>
          <p>COPYRIGHT ©SMARTPLANET CO.,LTD. ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </footer>
  );
}
