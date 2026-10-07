import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginIllustration from '../components/common/LoginIllustration';
import {
  GraduationCap,
  Eye,
  EyeOff,
  LogIn,
  User,
  Lock,
  CircleAlert,
  ClipboardList,
  TrendingUp,
  Presentation,
} from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'instructor' | 'student'>('instructor');
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    { role: 'admin' as const, username: 'admin', password: 'admin123', label: 'Administrator', icon: '👨‍💼' },
    { role: 'instructor' as const, username: 'instructor', password: 'inst123', label: 'Instructor', icon: '👨‍🏫' },
    { role: 'student' as const, username: 'student', password: 'stud123', label: 'Student', icon: '👨‍🎓' },
  ];

  const features = [
    { icon: ClipboardList, text: 'ติดตามความคืบหน้าโครงงานรายสัปดาห์' },
    { icon: TrendingUp, text: 'วิเคราะห์ความเสี่ยงและผลการเรียนรู้' },
    { icon: Presentation, text: 'บริหารการนำเสนอและการประเมินผล' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      const user = { admin: '/admin', instructor: '/instructor', student: '/student' };
      navigate(user[selectedRole] || '/instructor');
    } else {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setUsername(account.username);
    setPassword(account.password);
    setSelectedRole(account.role);
    const success = login(account.username, account.password);
    if (success) {
      navigate(`/${account.role}`);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8F6FC]">
      {/* Illustration Panel (desktop) */}
      <aside className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col overflow-hidden border-r border-[#ECE5F7] bg-gradient-to-br from-white via-[#FBF8FF] to-[#F2EAFE] px-12 py-10 xl:px-16">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#E9DDFC] blur-3xl opacity-70" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#EDE3FC] blur-3xl opacity-80" />

        {/* Top: logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C4DDB] to-[#4A2391] shadow-[0_8px_20px_-8px_rgba(74,35,145,0.6)]">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[#2A1655]">ภาควิชาวิศวกรรมคอมพิวเตอร์</p>
            <p className="text-xs text-[#8A7CA8]">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</p>
          </div>
        </div>

        {/* Illustration */}
        <div className="relative flex flex-1 items-center justify-center py-6">
          <LoginIllustration className="h-auto w-full max-w-[620px]" />
        </div>

        {/* Caption */}
        <div className="relative max-w-xl">
          <h1 className="bg-gradient-to-r from-[#2A1655] via-[#4A2391] to-[#7C4DDB] bg-clip-text pb-1 text-[36px] xl:text-[46px] 2xl:text-[56px] font-extrabold leading-[1.25] tracking-tight text-transparent">
            ระบบจัดการโครงงานนักศึกษา
          </h1>
          <p className="mt-2 text-base xl:text-lg font-medium text-[#6E5E91]">
            Student Project Management & Learning Analytics
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {features.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 rounded-full border border-[#E4D9F7] bg-white/80 px-3.5 py-2 text-xs font-medium text-[#4A3772] shadow-sm"
              >
                <Icon className="h-4 w-4 text-[#6B3FC7]" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Form Panel */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#EDE4FB_0%,transparent_55%),radial-gradient(ellipse_at_bottom_left,#F1EAFC_0%,transparent_50%)]" />

        <div className="relative w-full max-w-[440px]">
          {/* Logo & Title (mobile / tablet) */}
          <div className="mb-8 text-center lg:hidden">
            <LoginIllustration className="mx-auto mb-4 h-auto w-full max-w-[340px]" />
            <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C4DDB] to-[#4A2391] shadow-[0_12px_30px_-8px_rgba(74,35,145,0.55)]">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-[#2A1655] via-[#4A2391] to-[#7C4DDB] bg-clip-text pb-1 text-[32px] sm:text-[40px] font-extrabold leading-[1.25] tracking-tight text-transparent">
              ระบบจัดการโครงงานนักศึกษา
            </h1>
            <p className="mt-1.5 text-sm text-[#6E5E91]">
              Student Project Management & Learning Analytics
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-[#ECE5F7] bg-white/90 p-7 shadow-[0_30px_70px_-25px_rgba(74,35,145,0.30)] backdrop-blur-sm sm:p-9">
            <div className="mb-7">
              <h2 className="text-[28px] font-bold tracking-tight text-[#2A1655]">เข้าสู่ระบบ</h2>
              <p className="mt-1 text-sm text-[#8A7CA8]">กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                <CircleAlert className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#3B2667]">
                  ชื่อผู้ใช้
                </label>
                <div className="group relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#A699C2] transition-colors group-focus-within:text-[#6B3FC7]" />
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="กรอกชื่อผู้ใช้"
                    className="h-12 w-full rounded-xl border border-[#DED3F1] bg-[#FCFBFF] pl-11 pr-4 text-sm text-[#2A1655] outline-none transition-all placeholder:text-[#B2A7C8] hover:border-[#C7B3EC] focus:border-[#6B3FC7] focus:bg-white focus:ring-4 focus:ring-[#6B3FC7]/15"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#3B2667]">
                  รหัสผ่าน
                </label>
                <div className="group relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#A699C2] transition-colors group-focus-within:text-[#6B3FC7]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่าน"
                    className="h-12 w-full rounded-xl border border-[#DED3F1] bg-[#FCFBFF] pl-11 pr-12 text-sm text-[#2A1655] outline-none transition-all placeholder:text-[#B2A7C8] hover:border-[#C7B3EC] focus:border-[#6B3FC7] focus:bg-white focus:ring-4 focus:ring-[#6B3FC7]/15"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#A699C2] transition-colors hover:bg-[#F4EEFC] hover:text-[#6B3FC7]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="!mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6B3FC7] to-[#4A2391] font-semibold tracking-wide text-white shadow-[0_12px_24px_-10px_rgba(74,35,145,0.75)] transition-all hover:-translate-y-px hover:from-[#5C33B3] hover:to-[#3D1C7A] hover:shadow-[0_16px_30px_-10px_rgba(74,35,145,0.85)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6B3FC7]/30 active:translate-y-0"
              >
                <LogIn size={18} />
                เข้าสู่ระบบ
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EEE8F8]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-[#A699C2]">หรือ</span>
              </div>
            </div>

            {/* Demo Quick Login */}
            <div>
              <p className="mb-3 text-center text-xs font-medium text-[#8F82AD]">เข้าสู่ระบบด่วน (Demo)</p>
              <div className="grid grid-cols-3 gap-2.5">
                {demoAccounts.map((account) => {
                  const active = selectedRole === account.role;
                  return (
                    <button
                      type="button"
                      key={account.role}
                      onClick={() => handleDemoLogin(account)}
                      aria-pressed={active}
                      className={`group flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-10px_rgba(91,52,166,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6B3FC7]/20 ${
                        active
                          ? 'border-[#6B3FC7] bg-gradient-to-b from-[#F6F1FE] to-[#EDE3FC] ring-1 ring-[#6B3FC7]'
                          : 'border-[#E7DFF4] bg-white hover:border-[#C7B3EC]'
                      }`}
                    >
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-2xl transition-colors ${
                          active ? 'bg-white shadow-sm' : 'bg-[#F6F2FC] group-hover:bg-[#EFE7FB]'
                        }`}
                      >
                        {account.icon}
                      </span>
                      <span className={`text-xs font-semibold ${active ? 'text-[#4A2391]' : 'text-[#3B2667]'}`}>
                        {account.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-[11px] leading-relaxed text-[#9B8FB6] lg:hidden">
            ภาควิชาวิศวกรรมคอมพิวเตอร์ • มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ
          </p>
        </div>
      </main>
    </div>
  );
}
