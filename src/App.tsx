/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Anchor, 
  Award, 
  Briefcase, 
  Code, 
  ExternalLink, 
  GraduationCap, 
  Languages, 
  MapPin, 
  Rocket, 
  Ship, 
  User, 
  Video, 
  Waves,
  Facebook,
  Instagram,
  Mail,
  Linkedin,
  Search,
  Monitor,
  Layout,
  Layers,
  Camera,
  Upload,
  Link as LinkIcon
} from 'lucide-react';

// --- Components ---

const SectionTitle = ({ children, icon: Icon, color = "orange" }: { children: React.ReactNode, icon: any, color?: "orange" | "blue" | "slate" }) => {
  const colorMap = {
    orange: "bg-orange-100 text-orange-600 border-orange-200",
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200"
  };
  
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className={`p-3 rounded-2xl border-2 ${colorMap[color]} shadow-sm`}>
        <Icon size={24} />
      </div>
      <h2 className="text-3xl font-black text-slate-900 font-display uppercase tracking-tight">
        {children}
      </h2>
    </div>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`bg-white rounded-[3rem] shadow-sm border-2 border-orange-50/50 p-10 ${className}`}
  >
    {children}
  </motion.div>
);

// --- Data ---

const personalInfo = {
  name: "張藝穎",
  englishName: "Chang Yi-Ying",
  photoUrl: "/profile.png", // Assuming the uploaded photo is saved as profile.png or similar
  titles: ["行銷企劃", "社群經營", "拍拍幹片", "最狂打工仔"],
  birthday: "2026 / 09 / 12",
  bloodType: "RH型",
  location: "台灣 / TAIWAN",
  motto: "「財富、名氣、權力，我在這世上應有盡有，解放你們自己，奔向大海吧！」",
  bio: "目前就讀於國立高雄科技大學航海科四年級。對於航運有濃厚的興趣，對操船充滿嚮往。讀航海的第四年，目前上過兩條船，一條實習船，一條商船，我覺得到了船上後，跟學校截然不同，會發現課本上和實務上相差甚遠。",
};

const workExperience = [
  { company: "鳥巢股份有限公司 🎥", role: "執行長 / 個人創作者", description: "🎬 以日常生活為主題的個人創作頻道，記錄生活點滴、學生生活與手分享。不穩定更新，累積創作與成長。", period: "Ongoing" },
  { company: "丹丹漢堡", role: "餐點製作與場域維護", description: "🍔 依標準流程製作餐點（漢堡、炸物），補充食材與包材。定期更換油炸油與清理油槽，展現強大抗壓性，適應快節奏環境。", period: "Part-time" },
  { company: "冒煙的喬", role: "飲品調製專員", description: "☕ 製作各類飲品（咖啡、茶類、氣泡飲、果汁或店內特調），事準備當日所需原物料（煮茶、切水果、調配糖漿等）。", period: "Part-time" },
];

const education = [
  { school: "斗六國小", degree: "小學階段基礎教育" },
  { school: "東南國中", degree: "中學階段多元發展" },
  { school: "國立高雄科技大學", degree: "航海科 四年級 / 系學會會長" },
];

const certificates = [
  "醫療急救", "進階滅火", "保全意識", "保全職責", "基本安全訓練", "助理航行當值"
];

const portfolio = [
  { title: "旅行規劃全案", type: "PDF Plan", link: "https://drive.google.com/file/d/1_mORPc3mVZzFahkkn0CtzARtGtdWz5-y/view", icon: <MapPin /> },
  { title: "旅行簡報 (一)", type: "Presentation", link: "https://drive.google.com/file/d/1egsNrrJBd6dbGX9xMZf78VhKtLQxETOB/view", icon: <Layout /> },
  { title: "旅行簡報 (二)", type: "Presentation", link: "https://drive.google.com/file/d/19beYTUAXZTF4W8PLaELoKiKE2vqdC8g-/view", icon: <Layout /> },
  { title: "旅行簡報 (三)", type: "Presentation", link: "https://drive.google.com/file/d/18u9gu60LzkeukG9228ZkPnGOJoeEsD8b/view", icon: <Layout /> },
  { title: "3D 模型公仔", type: "Digital Art", link: "https://studio.tripo3d.ai/3d-model/c66e5761-263f-49c8-884e-b498828d2663?invite_code=LU4PDU", icon: <Rocket /> },
  { title: "旅遊紀錄影片 (一)", type: "Vlog", link: "https://drive.google.com/file/d/1WhYnCpkMop8osp11atoQgqlXpP6w5NIU/view", icon: <Video /> },
  { title: "旅遊紀錄影片 (二)", type: "Vlog", link: "https://drive.google.com/file/d/1q-cvQoKnbhhS0oM3v3z3XmfWkJE6zh_C/view", icon: <Video /> },
  { title: "旅遊紀錄影片 (三)", type: "Vlog", link: "https://drive.google.com/file/d/19lhy7Xte0m_7IqgHwdqer-kYStOMvVZ-/view", icon: <Video /> },
  { title: "旅遊紀錄影片 (四)", type: "Vlog", link: "https://drive.google.com/file/u/1/d/1qVGOS2lzZuTAoXoZ1NTFja1SIPrz3FGW/view?usp=drive_open", icon: <Video /> },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState<string>('home');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Sync activePage with URL path
  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'home';
    setActivePage(path);
    // Reset selected file when page changes
    setSelectedFile(null);
  }, [location.pathname]);

  const getEmbedUrl = (url: string | null) => {
    if (!url) return "";
    if (url.includes('drive.google.com')) {
      return url.replace('/view', '/preview').replace('/view?usp=drive_open', '/preview');
    }
    return url;
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const currentPhoto = profileImage || personalInfo.photoUrl;

  const menuItems = [
    { id: 'home', label: '首頁', icon: <Rocket /> },
    { id: 'bio', label: '我的故事', icon: <User /> },
    { id: 'maritime', label: '航海專才', icon: <Ship /> },
    { id: 'marketing', label: '行銷能力', icon: <Monitor /> },
    { id: 'experience', label: '工作實務', icon: <Briefcase /> },
    { id: 'leadership', label: '領導經驗', icon: <Award /> },
    { id: 'travel', label: '旅行企劃', icon: <MapPin /> },
    { id: 'works', label: '創意作品', icon: <Video /> },
    { id: 'skills', label: '專業工具', icon: <Code /> },
    { id: 'contact', label: '聯絡資訊', icon: <Mail /> },
  ];

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col lg:flex-row bg-[#FFFAF0]">
      
      {/* Sidebar Navigation */}
      <nav className="w-full lg:w-72 bg-white border-r-4 border-orange-500 lg:sticky lg:top-0 lg:h-screen z-50 p-6 flex flex-col justify-between shadow-xl">
        <div>
          <div className="mb-10 text-center lg:text-left">
            <div className="relative w-32 h-32 mx-auto lg:mx-0 mb-6 group cursor-pointer" onClick={triggerUpload}>
              <div className="absolute inset-0 bg-orange-500 rounded-[2.5rem] rotate-6 shadow-lg shadow-orange-500/20"></div>
              <div className="absolute inset-0 bg-white rounded-[2.5rem] border-2 border-orange-100 overflow-hidden z-10 transition-transform hover:rotate-0 -rotate-3">
                {currentPhoto ? (
                  <img src={currentPhoto} alt={personalInfo.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-500 text-4xl font-black font-display">穎</div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={24} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">{personalInfo.name}</h1>
            <p className="text-orange-600 text-xs font-bold tracking-[0.2em] uppercase">{personalInfo.englishName}</p>
          </div>

          <div className="space-y-1 overflow-x-auto lg:overflow-x-visible flex lg:flex-col pb-4 lg:pb-0 scrollbar-hide">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.id === 'home' ? '/' : `/${item.id}`}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all whitespace-nowrap lg:whitespace-normal group ${
                  activePage === item.id 
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                  : 'text-slate-400 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <span className={`transition-transform group-hover:scale-110 ${activePage === item.id ? 'text-white' : 'text-orange-400'}`}>
                  {React.cloneElement(item.icon as React.ReactElement, { size: 20 })}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden lg:block pt-6 border-t border-slate-100">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-relaxed">
            Seafarer <br /> Creator <br /> Marketer.
          </p>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1 p-6 lg:p-12 xl:p-20">
        <AnimatePresence mode="wait">
          
          {/* Page 1: Home */}
          {activePage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="min-h-[80vh] flex flex-col justify-center">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-white rounded-2xl border-2 border-orange-100 text-orange-600 font-black text-xs uppercase tracking-widest mb-8 shadow-sm">
                    <Waves size={16} className="animate-pulse" /> 跨越海洋的行銷冒險
                  </div>
                  <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.85] font-display uppercase italic mb-8 -ml-1">
                    YI-YING <br /> <span className="text-orange-500 text-shadow-xl">NAVI</span> <br /> GATE.
                  </h1>
                  <div className="max-w-2xl bg-orange-600 p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group mb-6">
                    <Ship size={200} className="absolute -right-20 -bottom-20 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                    <p className="text-xl lg:text-2xl italic font-display leading-snug relative z-10 mb-6">
                      {personalInfo.motto}
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      {personalInfo.titles.map(t => (
                        <span key={t} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/20 rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={triggerUpload}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                  >
                    <Upload size={18} /> 上傳大頭照
                  </button>
                </div>
                
                <div className="order-1 lg:order-2 flex justify-center">
                  <div className="relative w-64 h-64 lg:w-96 lg:h-96">
                    <div className="absolute inset-0 bg-orange-500 rounded-[4rem] lg:rounded-[5rem] rotate-6 shadow-2xl opacity-20"></div>
                    <div className="absolute inset-0 bg-white rounded-[4rem] lg:rounded-[5rem] border-8 border-white overflow-hidden shadow-2xl z-10 -rotate-3 transition-transform hover:rotate-0">
                      {currentPhoto ? (
                        <img src={currentPhoto} alt={personalInfo.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-orange-400 bg-orange-50">
                          <User size={120} strokeWidth={1} />
                        </div>
                      )}
                      <div 
                        onClick={triggerUpload}
                        className="absolute bottom-6 right-6 w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:bg-orange-400 transition-colors z-20"
                      >
                        <Camera size={32} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page 2: Bio */}
          {activePage === 'bio' && (
            <motion.div key="bio" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-5xl space-y-12">
              <SectionTitle icon={User} color="orange">關於我 ABOUT ME</SectionTitle>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5">
                   <div className="relative aspect-square rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl rotate-2 bg-white">
                      {currentPhoto ? (
                        <img src={currentPhoto} alt={personalInfo.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-orange-200">
                           <User size={100} />
                        </div>
                      )}
                   </div>
                   <div className="mt-8 p-8 bg-blue-600 rounded-[3rem] text-white shadow-xl -rotate-1 relative z-10">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-70 italic">Personal Info</h4>
                    <ul className="space-y-4 font-black text-2xl">
                      <li className="flex justify-between border-b border-white/20 pb-2"><span>生日</span><span>{personalInfo.birthday.split(' / ').slice(1).join(' / ')}</span></li>
                      <li className="flex justify-between border-b border-white/20 pb-2"><span>血型</span><span>{personalInfo.bloodType}</span></li>
                      <li className="flex justify-between border-b border-white/20 pb-2"><span>地點</span><span>{personalInfo.location.split(' / ')[0]}</span></li>
                    </ul>
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-8">
                  <Card className="bg-white border-4 border-orange-100/50">
                    <h3 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{personalInfo.name}。<br />{personalInfo.englishName}。</h3>
                    <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed">
                      <p>{personalInfo.bio}</p>
                      <p>除了航海，我更是一位社群觀察者與影像創作者，「鳥巢股份有限公司」是我記錄生活、分享成長的自媒體實驗室。</p>
                    </div>
                  </Card>
                  <Card className="bg-slate-900 text-white border-0">
                    <h4 className="text-blue-400 font-black uppercase tracking-widest text-xs mb-4">語言能力</h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm font-black mb-2"><span>台語</span><span>精通</span></div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '95%' }} className="h-full bg-blue-500 rounded-full" /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-black mb-2"><span>英文 (TOEIC 900)</span><span>高階</span></div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '90%' }} className="h-full bg-blue-500 rounded-full" /></div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page 3: Maritime */}
          {activePage === 'maritime' && (
            <motion.div key="maritime" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-5xl space-y-12">
              <SectionTitle icon={Ship} color="blue">航海專才專業 MARITIME Expertise</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert, i) => (
                  <Card key={i} className="flex flex-col items-center text-center group hover:bg-blue-600 transition-colors duration-500">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-white/20 group-hover:text-white transition-all">
                      <Award size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-white transition-colors">{cert}</h3>
                  </Card>
                ))}
                <Card className="md:col-span-2 lg:col-span-3 bg-linear-to-r from-sky-800 to-blue-900 text-white border-0 flex flex-col md:flex-row items-center gap-10">
                   <div className="shrink-0 p-6 bg-white/10 rounded-[3rem] backdrop-blur-md border border-white/20">
                     <Monitor size={80} className="text-sky-300" />
                   </div>
                   <div>
                     <h3 className="text-3xl font-black mb-4">海上實務經驗</h3>
                     <p className="text-lg opacity-80 leading-relaxed font-medium">曾在實習船與商船服務，具備助理航行當值所需之專業知識與實操能力。面對多變的海象與漫長的航行，練就了極佳的耐心與體力。</p>
                   </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Page 4: Marketing */}
          {activePage === 'marketing' && (
            <motion.div key="marketing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-5xl space-y-12">
              <SectionTitle icon={Monitor} color="orange">行銷企劃與社群 MARKETING Skills</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="relative overflow-hidden group border-4 border-orange-100">
                  <SectionTitle icon={Layers} color="orange">品牌行銷與官網管理</SectionTitle>
                  <ul className="space-y-4 text-slate-600 font-bold ml-2">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-orange-500 rounded-full" /> FB、IG、Line@ 年度策略制定</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-orange-500 rounded-full" /> 廣告投放策略、異業合作專案</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-orange-500 rounded-full" /> Google Ads, Analytics, Search Console</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-orange-500 rounded-full" /> 官網 Campaign 設計、物流與金流管理</li>
                  </ul>
                  <Layers size={140} className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform" />
                </Card>
                <Card className="bg-slate-900 text-white border-0">
                  <SectionTitle icon={User} color="slate">顧客關係管理 CRM</SectionTitle>
                   <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <h4 className="font-black text-orange-400 mb-2">會員經營策略制定</h4>
                      <p className="text-sm opacity-70">建立忠誠度計畫，透過數據分析實現精準行銷與顧客留存。</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <h4 className="font-black text-blue-400 mb-2">顧客分眾經營</h4>
                      <p className="text-sm opacity-70">針對不群體制定差異化行銷腳本，提升轉換效益。</p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Page 5: Experience */}
          {activePage === 'experience' && (
            <motion.div key="exp" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-5xl space-y-12">
              <SectionTitle icon={Briefcase} color="slate">工作實務經驗 EXPERIENCE</SectionTitle>
              <div className="space-y-8">
                {workExperience.map((work, i) => (
                  <Card key={i} className="flex flex-col lg:flex-row gap-10 items-start">
                    <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 shrink-0 border-2 border-slate-200 shadow-sm">
                      <Briefcase size={32} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="text-3xl font-black text-slate-900 font-display italic underline decoration-orange-500 decoration-8 underline-offset-[-4px]">{work.company}</h3>
                        <span className="px-5 py-2 bg-orange-100 text-orange-600 text-xs font-black rounded-full uppercase tracking-widest">{work.period}</span>
                      </div>
                      <p className="text-xl font-bold text-orange-600 mb-6">{work.role}</p>
                      <p className="text-xl text-slate-600 leading-relaxed font-medium">{work.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Page 6: Leadership */}
          {activePage === 'leadership' && (
            <motion.div key="leader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl space-y-12">
              <SectionTitle icon={Award} color="blue">領導與教育學歷 LEADERSHIP</SectionTitle>
              <Card className="bg-linear-to-br from-indigo-900 to-blue-800 text-white border-0 p-12">
                <div className="space-y-12">
                  {education.map((edu, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="shrink-0 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-orange-500 transition-colors">
                        <GraduationCap size={30} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black mb-1 font-display uppercase tracking-tight">{edu.school}</h3>
                        <p className="text-blue-300 font-bold tracking-widest mb-4">{edu.degree}</p>
                        {edu.school.includes("高雄科技大學") && (
                          <div className="p-6 bg-black/20 rounded-3xl border border-white/10 italic text-lg opacity-80 leading-relaxed">
                            「擔任系學會會長期間，我不僅學會了策劃活動，更學會了對結果負責。那是對自我責任感與團隊合作能力的一次極致洗禮。」
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Page 7: Travel Portfolio */}
          {activePage === 'travel' && (
            <motion.div key="travel" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-6xl space-y-12">
              <SectionTitle icon={MapPin} color="orange">旅行企劃集 TRAVEL Plans</SectionTitle>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-4">
                  {/* Quick URL Input */}
                  <div className="p-6 bg-slate-900 rounded-[2.5rem] shadow-xl text-white">
                    <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                       <LinkIcon size={14} className="text-orange-400" /> 直接輸入網址查看 PPT
                    </h4>
                    <div className="flex flex-col gap-3">
                      <input 
                        type="text" 
                        placeholder="在此貼上 Google Drive 連結..." 
                        className="w-full px-4 py-3 bg-white/10 rounded-xl text-sm border border-white/10 focus:border-orange-500 focus:outline-none transition-all"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.includes('drive.google.com')) {
                            setSelectedFile(val);
                          }
                        }}
                      />
                      <p className="text-[10px] opacity-50 italic">貼上連結後即可在右側即時預覽</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {portfolio.filter(p => p.type === "PDF Plan" || p.type === "Presentation").map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedFile(item.link)}
                      className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${
                        (selectedFile === item.link || (!selectedFile && i === 0))
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                        : 'bg-white border-slate-50 text-slate-900 hover:border-orange-200'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${selectedFile === item.link || (!selectedFile && i === 0) ? 'bg-white/20' : 'bg-orange-50 text-orange-500'}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedFile === item.link || (!selectedFile && i === 0) ? 'opacity-70' : 'text-slate-400'}`}>{item.type}</p>
                        <h4 className="font-black truncate">{item.title}</h4>
                      </div>
                    </button>
                  ))}
                  <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white italic text-sm mt-6 opacity-80">
                    點擊列表項目即可在右側直接預覽 PPT 或 PDF 內容，無需跳轉網頁。
                  </div>
                  </div>
                </div>

                <div className="lg:col-span-8 bg-slate-200 aspect-[16/10] rounded-[3rem] shadow-2xl relative group overflow-hidden border-8 border-white">
                  <iframe 
                    src={getEmbedUrl(selectedFile || portfolio[0].link)} 
                    className="w-full h-full"
                    allow="autoplay"
                  />
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={selectedFile || portfolio[0].link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md text-slate-900 rounded-2xl font-black text-xs shadow-xl border border-white hover:bg-orange-500 hover:text-white transition-all"
                    >
                      <ExternalLink size={14} /> 查看原始連結
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Page 8: Creative Works */}
          {activePage === 'works' && (
            <motion.div key="works" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl space-y-12">
              <SectionTitle icon={Video} color="blue">影音與數位作品 CREATIVE Portfolio</SectionTitle>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-3">
                  {portfolio.filter(p => p.type === "Vlog" || p.type === "Digital Art").map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => setSelectedFile(item.link)}
                      className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${
                        selectedFile === item.link
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                        : 'bg-white border-slate-50 text-slate-900 hover:border-blue-200'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${selectedFile === item.link ? 'bg-white/20' : 'bg-blue-50 text-blue-500'}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedFile === item.link ? 'opacity-70' : 'text-slate-400'}`}>{item.type}</p>
                        <h4 className="font-black truncate">{item.title}</h4>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-8 bg-slate-900 aspect-video rounded-[3rem] shadow-2xl relative group overflow-hidden border-8 border-white">
                  {selectedFile ? (
                    <>
                      <iframe 
                        src={getEmbedUrl(selectedFile)} 
                        className="w-full h-full"
                        allow="autoplay"
                      />
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={selectedFile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-md text-slate-900 rounded-2xl font-black text-xs shadow-xl border border-white hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <ExternalLink size={14} /> 查看原始連結
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/50 space-y-6">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                        <Video size={40} />
                      </div>
                      <p className="text-xl font-bold italic">請從左側選單選擇想觀看的影音作品</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Page 9: Skills & Tools */}
          {activePage === 'skills' && (
            <motion.div key="skills" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="max-w-5xl space-y-12">
              <SectionTitle icon={Code} color="slate">數位技能與工具 TOOLS & Skills</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Card className="border-4 border-orange-100 italic">
                  <div className="flex items-center gap-4 mb-8">
                    <Monitor size={32} className="text-orange-500" />
                    <h3 className="text-2xl font-black text-slate-900 uppercase">Office Productivity</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">MS Office 全系列</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Word', 'Excel', 'Outlook', 'PowerPoint'].map(t => (
                          <span key={t} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl font-black text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Apple iWork 全系列</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Pages', 'Numbers', 'Keynote'].map(t => (
                          <span key={t} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-slate-900 text-white border-0">
                  <div className="flex items-center gap-4 mb-8">
                    <Monitor size={32} className="text-blue-400" />
                    <h3 className="text-2xl font-black uppercase">Digital Workspace</h3>
                  </div>
                   <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Google Workspace</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Gmail', 'Calendar', 'Drive', 'Meet', 'Sites'].map(t => (
                          <span key={t} className="px-4 py-2 bg-white/10 text-white rounded-xl font-black text-xs border border-white/10 uppercase tracking-tighter">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Project Management</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Asana', 'Trello'].map(t => (
                          <span key={t} className="px-4 py-2 bg-blue-500 text-white rounded-xl font-black text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Page 10: Contact */}
          {activePage === 'contact' && (
            <motion.div key="contact" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="h-[75vh] flex flex-col justify-center max-w-2xl mx-auto text-center">
              <div className="mb-16 relative">
                 <div className="w-24 h-24 bg-orange-500 rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-5xl font-black font-display shadow-2xl shadow-orange-500/40 rotate-12 mb-10 translate-y-2 animate-bounce">
                  🚩
                </div>
                <h2 className="text-6xl font-black text-slate-900 font-display mb-6 leading-tight italic uppercase underline decoration-orange-500 decoration-[12px] underline-offset-[-4px]">Ready for <br /> Arrival?</h2>
                <p className="text-xl text-slate-500 font-medium italic">無論是航海實務、行銷策劃或社群經營，期待與您共同開啟新航程。</p>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  <a href="https://facebook.com/your-profile" target="_blank" rel="noopener noreferrer" className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-50 hover:border-blue-500 transition-all group shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <Facebook size={32} />
                    </div>
                    <p className="font-black text-xs text-slate-900 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Facebook</p>
                  </a>
                  <a href="https://instagram.com/your-profile" target="_blank" rel="noopener noreferrer" className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-50 hover:border-pink-500 transition-all group shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-pink-500 group-hover:text-white transition-all">
                      <Instagram size={32} />
                    </div>
                    <p className="font-black text-xs text-slate-900 uppercase tracking-widest group-hover:text-pink-500 transition-colors">Instagram</p>
                  </a>
                  <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-50 hover:border-blue-700 transition-all group shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-800 group-hover:text-white transition-all">
                      <Linkedin size={32} />
                    </div>
                    <p className="font-black text-xs text-slate-900 uppercase tracking-widest group-hover:text-blue-800 transition-colors">LinkedIn</p>
                  </a>
                </div>

                <div className="flex justify-center mb-16">
                  <a href="mailto:a111182113@nkust.edu.tw" className="w-full max-w-md p-8 bg-slate-900 rounded-[3rem] border-4 border-slate-800 hover:border-orange-500 transition-all group shadow-2xl text-white">
                    <Mail className="mx-auto mb-6 text-orange-500 group-hover:scale-110 transition-transform" size={48} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Direct Message</p>
                    <p className="font-black text-lg tracking-tight">a111182113@nkust.edu.tw</p>
                  </a>
                </div>

               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
                © 2026 {personalInfo.englishName} | All Rights Reserved.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
