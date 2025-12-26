import React, { useState } from 'react';
import { 
  GraduationCap, Trophy, Target, MessageCircle, 
  ChevronRight, Star, Lock, CheckCircle, Zap, Award
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Module {
  id: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  icon: React.ReactNode;
  progress: number;
  lessons: number;
  completed: number;
  locked: boolean;
}

const modules: Module[] = [
  {
    id: '1',
    title: 'Phishing Basics',
    titleTa: 'ஃபிஷிங் அடிப்படைகள்',
    description: 'Learn to identify fake emails and websites',
    descriptionTa: 'போலி மின்னஞ்சல்கள் மற்றும் வலைத்தளங்களை அடையாளம் காண கற்றுக்கொள்ளுங்கள்',
    icon: <Target className="text-primary" size={24} />,
    progress: 80,
    lessons: 5,
    completed: 4,
    locked: false,
  },
  {
    id: '2',
    title: 'Scam Calls Detection',
    titleTa: 'மோசடி அழைப்புகளை கண்டறிதல்',
    description: 'Recognize and handle suspicious phone calls',
    descriptionTa: 'சந்தேகத்திற்குரிய தொலைபேசி அழைப்புகளை அடையாளம் காணுங்கள்',
    icon: <MessageCircle className="text-warning" size={24} />,
    progress: 60,
    lessons: 4,
    completed: 2,
    locked: false,
  },
  {
    id: '3',
    title: 'Safe Online Banking',
    titleTa: 'பாதுகாப்பான ஆன்லைன் வங்கி',
    description: 'Protect your financial transactions',
    descriptionTa: 'உங்கள் நிதி பரிவர்த்தனைகளைப் பாதுகாக்கவும்',
    icon: <Lock className="text-success" size={24} />,
    progress: 0,
    lessons: 6,
    completed: 0,
    locked: false,
  },
  {
    id: '4',
    title: 'Social Media Safety',
    titleTa: 'சமூக ஊடக பாதுகாப்பு',
    description: 'Stay safe on social platforms',
    descriptionTa: 'சமூக தளங்களில் பாதுகாப்பாக இருங்கள்',
    icon: <Star className="text-accent" size={24} />,
    progress: 0,
    lessons: 5,
    completed: 0,
    locked: true,
  },
];

interface Quiz {
  question: string;
  questionTa: string;
  options: { text: string; textTa: string; correct: boolean }[];
}

const dailyQuiz: Quiz = {
  question: 'A bank calls asking for your OTP. What should you do?',
  questionTa: 'ஒரு வங்கி உங்கள் OTP-ஐ கேட்டு அழைக்கிறது. நீங்கள் என்ன செய்ய வேண்டும்?',
  options: [
    { text: 'Share the OTP immediately', textTa: 'உடனடியாக OTP பகிரவும்', correct: false },
    { text: 'Hang up and call bank directly', textTa: 'தொலைபேசியை வைத்துவிட்டு நேரடியாக வங்கியை அழைக்கவும்', correct: true },
    { text: 'Ask for their employee ID first', textTa: 'முதலில் அவர்களின் ஊழியர் அடையாளத்தைக் கேளுங்கள்', correct: false },
    { text: 'Share only half the OTP', textTa: 'OTP-யின் பாதியை மட்டும் பகிரவும்', correct: false },
  ],
};

const LearningHub: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="gradient-primary rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Trophy size={32} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-primary-foreground/80 text-sm font-medium">{t('progress')}</p>
            <p className="text-3xl font-bold text-primary-foreground">Level 3</p>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={65} className="h-2 flex-1 bg-white/20" />
              <span className="text-xs text-primary-foreground/80">650/1000 XP</span>
            </div>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex gap-3 mt-4">
          {['🛡️', '🎯', '⭐'].map((badge, idx) => (
            <div key={idx} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              {badge}
            </div>
          ))}
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-dashed border-white/30 flex items-center justify-center">
            <Award size={18} className="text-primary-foreground/50" />
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="bg-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-warning/20 to-warning/5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
              <Zap size={20} className="text-warning" />
            </div>
            <div>
              <p className="font-semibold">{t('dailyChallenge')}</p>
              <p className="text-xs text-muted-foreground">+50 XP</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <p className="font-medium">
            {language === 'en' ? dailyQuiz.question : dailyQuiz.questionTa}
          </p>
          
          <div className="space-y-2">
            {dailyQuiz.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !showResult && handleAnswer(idx)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 border ${
                  showResult
                    ? option.correct
                      ? 'bg-success/20 border-success text-success'
                      : selectedAnswer === idx
                        ? 'bg-destructive/20 border-destructive text-destructive'
                        : 'bg-muted/30 border-transparent text-muted-foreground'
                    : 'bg-muted/30 border-transparent hover:bg-muted/50 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-background flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 text-sm">
                    {language === 'en' ? option.text : option.textTa}
                  </span>
                  {showResult && option.correct && <CheckCircle size={18} className="text-success" />}
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`p-4 rounded-xl ${dailyQuiz.options[selectedAnswer!].correct ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'} border animate-fade-in`}>
              <p className="text-sm font-medium">
                {dailyQuiz.options[selectedAnswer!].correct 
                  ? '🎉 Correct! Banks never ask for OTP over phone calls.'
                  : '❌ Incorrect. Never share OTP with anyone, even if they claim to be from a bank.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Learning Modules */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Learning Modules
        </h3>
        
        {modules.map((module) => (
          <button
            key={module.id}
            disabled={module.locked}
            className={`w-full p-4 rounded-2xl border bg-card/50 backdrop-blur text-left transition-all duration-300 ${
              module.locked 
                ? 'opacity-50 border-white/5' 
                : 'border-white/10 hover:border-primary/30 active:scale-[0.98]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center">
                {module.locked ? <Lock size={24} className="text-muted-foreground" /> : module.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {language === 'en' ? module.title : module.titleTa}
                </p>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {language === 'en' ? module.description : module.descriptionTa}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={module.progress} className="h-1.5 flex-1" />
                  <span className="text-[10px] text-muted-foreground">
                    {module.completed}/{module.lessons}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LearningHub;
