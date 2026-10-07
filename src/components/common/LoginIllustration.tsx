import { useId } from 'react';

/**
 * Original flat/isometric illustration for the Login page.
 * Theme: student project tracking & learning analytics (white–purple palette).
 */

type SlabProps = { x: number; y: number; s: number; h: number; top: string; left: string; right: string };

function Slab({ x, y, s, h, top, left, right }: SlabProps) {
  const half = s / 2;
  return (
    <g>
      <polygon points={`${x - s},${y} ${x},${y + half} ${x},${y + half + h} ${x - s},${y + h}`} fill={left} />
      <polygon points={`${x + s},${y} ${x},${y + half} ${x},${y + half + h} ${x + s},${y + h}`} fill={right} />
      <polygon points={`${x},${y - half} ${x + s},${y} ${x},${y + half} ${x - s},${y}`} fill={top} />
    </g>
  );
}

export default function LoginIllustration({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `${uid}-${name}`;

  const skin = '#F2C29F';
  const skin2 = '#E3A983';

  return (
    <svg
      viewBox="0 0 560 440"
      className={className}
      role="img"
      aria-label="ภาพประกอบอาจารย์และนักศึกษากำลังติดตามความคืบหน้าโครงงานผ่านแดชบอร์ด"
    >
      <defs>
        <linearGradient id={id('bar')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id={id('beam')} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id('line')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <radialGradient id={id('blob')} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#EDE4FD" />
          <stop offset="100%" stopColor="#F7F3FE" stopOpacity="0" />
        </radialGradient>
        <filter id={id('sh')} x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#4C1D95" floodOpacity="0.14" />
        </filter>
      </defs>

      <style>{`
        .li-float-a { animation: liFloat 6s ease-in-out infinite; transform-box: fill-box; }
        .li-float-b { animation: liFloat 7s ease-in-out -2s infinite; transform-box: fill-box; }
        .li-float-c { animation: liFloat 5s ease-in-out -1s infinite; transform-box: fill-box; }
        .li-pulse { animation: liPulse 3.2s ease-in-out infinite; }
        @keyframes liFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-9px) } }
        @keyframes liPulse { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .li-float-a, .li-float-b, .li-float-c, .li-pulse { animation: none; }
        }
      `}</style>

      {/* Background */}
      <ellipse cx="290" cy="215" rx="265" ry="200" fill={`url(#${id('blob')})`} />
      <ellipse cx="290" cy="392" rx="235" ry="24" fill="#E9DFFB" />
      <ellipse cx="290" cy="392" rx="160" ry="14" fill="#E0D2FA" />

      {/* Decorative dots grid */}
      <g fill="#D8C9F6">
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 6 }).map((__, c) => (
            <circle key={`${r}-${c}`} cx={474 + c * 12} cy={300 + r * 12} r="1.8" />
          )),
        )}
      </g>

      {/* ===== Isometric data stack (left) ===== */}
      <g>
        <rect className="li-pulse" x="64" y="70" width="92" height="170" fill={`url(#${id('beam')})`} />
        <Slab x={110} y={330} s={58} h={24} top="#A78BFA" left="#6D28D9" right="#5B21B6" />
        <Slab x={110} y={296} s={58} h={24} top="#B9A0FB" left="#7C3AED" right="#6425C9" />
        <Slab x={110} y={262} s={58} h={24} top="#C4B5FD" left="#8B5CF6" right="#7140DD" />
        <Slab x={110} y={228} s={58} h={24} top="#DDD3FE" left="#9D74F7" right="#8250E6" />
        {/* light strips on slabs */}
        {[248, 282, 316, 350].map((yy) => (
          <g key={yy}>
            <line x1={62} y1={yy - 4} x2={82} y2={yy + 6} stroke="#EDE7FF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <circle cx={92} cy={yy + 10} r="2" fill="#F5F0FF" />
          </g>
        ))}
        {/* small cubes */}
        <Slab x={186} y={366} s={22} h={14} top="#C4B5FD" left="#7C3AED" right="#5B21B6" />
        <g className="li-float-c">
          <Slab x={186} y={326} s={16} h={12} top="#DDD3FE" left="#8B5CF6" right="#6D28D9" />
        </g>
      </g>

      {/* ===== Dashboard board ===== */}
      <g>
        {/* stand */}
        <line x1="290" y1="214" x2="276" y2="386" stroke="#C9B8EE" strokeWidth="6" strokeLinecap="round" />
        <line x1="400" y1="214" x2="414" y2="386" stroke="#C9B8EE" strokeWidth="6" strokeLinecap="round" />
        <rect x="214" y="44" width="262" height="176" rx="16" fill="#FFFFFF" filter={`url(#${id('sh')})`} />
        <rect x="214" y="44" width="262" height="30" rx="16" fill="#F4EEFE" />
        <rect x="214" y="60" width="262" height="14" fill="#F4EEFE" />
        <circle cx="232" cy="59" r="4" fill="#C4B5FD" />
        <circle cx="245" cy="59" r="4" fill="#DDD3FE" />
        <circle cx="258" cy="59" r="4" fill="#EDE7FF" />
        <rect x="380" y="54" width="80" height="10" rx="5" fill="#E4D9FB" />

        {/* bar chart */}
        <g>
          {[
            { x: 236, h: 46 },
            { x: 256, h: 70 },
            { x: 276, h: 56 },
            { x: 296, h: 92 },
            { x: 316, h: 78 },
          ].map((b) => (
            <rect key={b.x} x={b.x} y={196 - b.h} width="13" height={b.h} rx="4" fill={`url(#${id('bar')})`} />
          ))}
          <line x1="230" y1="198" x2="336" y2="198" stroke="#EAE2FA" strokeWidth="2" />
        </g>

        {/* donut */}
        <g transform="translate(400 118)">
          <circle r="30" fill="none" stroke="#EEE7FC" strokeWidth="11" />
          <circle
            r="30"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray="132 189"
            transform="rotate(-90)"
          />
          <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill="#2E1A5C" fontFamily="inherit">
            72%
          </text>
        </g>

        {/* trend line */}
        <polyline
          points="358,196 378,184 396,188 416,172 436,176 456,158"
          fill="none"
          stroke={`url(#${id('line')})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="456" cy="158" r="4.5" fill="#FFFFFF" stroke="#6D28D9" strokeWidth="2.5" />
      </g>

      {/* ===== Floating cards ===== */}
      <g className="li-float-a" filter={`url(#${id('sh')})`}>
        <rect x="146" y="92" width="96" height="48" rx="12" fill="#FFFFFF" />
        <circle cx="166" cy="116" r="10" fill="#EDE4FD" />
        <path d="M161 116 l4 4 l7 -8" fill="none" stroke="#6D28D9" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="182" y="106" width="46" height="7" rx="3.5" fill="#D9CCF7" />
        <rect x="182" y="119" width="32" height="7" rx="3.5" fill="#EEE7FC" />
      </g>

      <g className="li-float-b" filter={`url(#${id('sh')})`}>
        <rect x="470" y="70" width="70" height="64" rx="14" fill="#FFFFFF" />
        {/* graduation cap icon */}
        <polygon points="505,88 527,97 505,106 483,97" fill="#6D28D9" />
        <path d="M492 101 v9 q13 8 26 0 v-9 l-13 5 z" fill="#8B5CF6" />
        <line x1="522" y1="98" x2="522" y2="112" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
        <circle cx="522" cy="114" r="2.5" fill="#A78BFA" />
      </g>

      {/* hexagon & sparkles */}
      <g className="li-float-c">
        <polygon points="520,214 534,222 534,238 520,246 506,238 506,222" fill="#DDD3FE" />
        <polygon points="520,222 527,226 527,234 520,238 513,234 513,226" fill="#A78BFA" />
      </g>
      <g fill="#A78BFA">
        <path className="li-pulse" d="M196 40 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" />
        <path className="li-pulse" d="M500 180 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z" opacity="0.7" />
        <circle cx="48" cy="200" r="4" fill="#DDD3FE" />
        <circle cx="236" cy="262" r="3" fill="#C4B5FD" />
      </g>

      {/* ===== Student (graduation cap + tablet) ===== */}
      <g>
        <ellipse cx="300" cy="388" rx="30" ry="5" fill="#D5C5F5" />
        {/* legs */}
        <rect x="290" y="320" width="10" height="64" rx="5" fill="#3B2667" />
        <rect x="303" y="320" width="10" height="64" rx="5" fill="#2E1A5C" />
        <rect x="284" y="380" width="18" height="8" rx="4" fill="#1E1240" />
        <rect x="302" y="380" width="18" height="8" rx="4" fill="#1E1240" />
        {/* torso */}
        <path d="M280 276 Q301 262 322 276 L326 330 Q301 336 276 330 Z" fill="#A78BFA" />
        <path d="M294 268 L301 282 L308 268" fill="none" stroke="#EDE4FD" strokeWidth="3" strokeLinecap="round" />
        {/* neck & head */}
        <rect x="297" y="252" width="9" height="14" rx="3" fill={skin2} />
        <circle cx="301" cy="242" r="15" fill={skin} />
        <path d="M286 242 Q285 228 301 228 Q316 228 316 241 Q309 235 298 236 Q290 237 286 246 Z" fill="#2A1655" />
        <circle cx="306" cy="243" r="1.6" fill="#2A1655" />
        <path d="M304 250 q3 2 6 0" fill="none" stroke="#B9785A" strokeWidth="1.5" strokeLinecap="round" />
        {/* graduation cap */}
        <path d="M289 230 v-5 q12 -5 24 0 v5 z" fill="#2E1A5C" />
        <polygon points="301,214 326,223 301,232 276,223" fill="#3B2667" />
        <path d="M301 223 L320 227 L320 240" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <circle cx="320" cy="241" r="2.4" fill="#FBBF24" />
        {/* arms + tablet */}
        <path d="M283 280 Q278 296 290 304" fill="none" stroke="#9271F0" strokeWidth="9" strokeLinecap="round" />
        <path d="M319 280 Q326 296 314 304" fill="none" stroke="#9271F0" strokeWidth="9" strokeLinecap="round" />
        <g transform="rotate(-8 302 300)">
          <rect x="285" y="288" width="36" height="25" rx="4" fill="#4C1D95" />
          <rect x="288.5" y="291.5" width="29" height="18" rx="2" fill="#EDE4FD" />
          <rect x="292" y="301" width="4" height="6" rx="1" fill="#8B5CF6" />
          <rect x="298" y="297" width="4" height="10" rx="1" fill="#7C3AED" />
          <rect x="304" y="299" width="4" height="8" rx="1" fill="#A78BFA" />
          <rect x="310" y="295" width="4" height="12" rx="1" fill="#6D28D9" />
        </g>
        <circle cx="290" cy="304" r="4.5" fill={skin} />
        <circle cx="314" cy="304" r="4.5" fill={skin} />
      </g>

      {/* ===== Instructor (pointing at board) ===== */}
      <g>
        <ellipse cx="456" cy="388" rx="30" ry="5" fill="#D5C5F5" />
        {/* legs */}
        <rect x="446" y="322" width="10" height="62" rx="5" fill="#2E1A5C" />
        <rect x="459" y="322" width="10" height="62" rx="5" fill="#3B2667" />
        <rect x="440" y="380" width="18" height="8" rx="4" fill="#1E1240" />
        <rect x="458" y="380" width="18" height="8" rx="4" fill="#1E1240" />
        {/* blazer */}
        <path d="M436 272 Q457 258 478 272 L482 332 Q457 338 432 332 Z" fill="#6D28D9" />
        <path d="M450 264 L457 300 L464 264" fill="#FFFFFF" />
        <path d="M450 264 L455 280 L448 284 Z M464 264 L459 280 L466 284 Z" fill="#5B21B6" />
        {/* lanyard badge */}
        <rect x="462" y="292" width="10" height="13" rx="2" fill="#FFFFFF" />
        <rect x="464" y="295" width="6" height="2" rx="1" fill="#A78BFA" />
        {/* neck & head */}
        <rect x="453" y="248" width="9" height="14" rx="3" fill={skin2} />
        <circle cx="457" cy="238" r="15" fill={skin} />
        {/* hair with bun */}
        <circle cx="468" cy="222" r="8.5" fill="#3B1F5C" />
        <path d="M442 240 Q441 222 457 222 Q473 222 472 238 Q472 252 466 258 Q468 240 458 232 Q450 236 442 244 Z" fill="#3B1F5C" />
        <circle cx="451" cy="240" r="1.6" fill="#2A1655" />
        <path d="M446 247 q3 2 6 0" fill="none" stroke="#B9785A" strokeWidth="1.5" strokeLinecap="round" />
        {/* glasses */}
        <circle cx="451" cy="240" r="4.6" fill="none" stroke="#4C1D95" strokeWidth="1.3" />
        {/* pointing arm */}
        <path d="M440 276 Q428 252 424 222" fill="none" stroke="#6D28D9" strokeWidth="9" strokeLinecap="round" />
        <circle cx="423" cy="218" r="5" fill={skin} />
        <line x1="421" y1="214" x2="417" y2="205" stroke={skin} strokeWidth="3.4" strokeLinecap="round" />
        {/* other arm */}
        <path d="M476 278 Q484 300 476 318" fill="none" stroke="#5B21B6" strokeWidth="9" strokeLinecap="round" />
        <circle cx="475" cy="321" r="4.5" fill={skin} />
      </g>
    </svg>
  );
}
