import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Shield, AlertTriangle,
  Phone, MessageSquare, Link2, Brain, Radio, Waves,
  CheckCircle, XCircle, Activity, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'alert' | 'info' | 'success';
}

interface MonitoringAlert {
  id: string;
  type: 'call' | 'sms' | 'app' | 'link';
  message: string;
  risk: 'low' | 'medium' | 'high';
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [is24HrMonitoring, setIs24HrMonitoring] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [monitoringAlerts, setMonitoringAlerts] = useState<MonitoringAlert[]>([]);
  const [waveAmplitude, setWaveAmplitude] = useState<number[]>([]);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate 24/7 monitoring alerts
  useEffect(() => {
    if (!is24HrMonitoring) return;

    const demoAlerts: MonitoringAlert[] = [
      { id: '1', type: 'call', message: 'Blocked suspicious call from +91-XXX-XXXX', risk: 'high', timestamp: new Date(Date.now() - 300000) },
      { id: '2', type: 'sms', message: 'Scam SMS detected and quarantined', risk: 'high', timestamp: new Date(Date.now() - 600000) },
      { id: '3', type: 'app', message: 'WhatsApp permissions verified - Safe', risk: 'low', timestamp: new Date(Date.now() - 900000) },
      { id: '4', type: 'link', message: 'Phishing link blocked in Chrome', risk: 'high', timestamp: new Date(Date.now() - 1200000) },
    ];
    setMonitoringAlerts(demoAlerts);

    // Simulate new alert every 30 seconds
    const interval = setInterval(() => {
      const newAlert: MonitoringAlert = {
        id: Date.now().toString(),
        type: ['call', 'sms', 'app', 'link'][Math.floor(Math.random() * 4)] as any,
        message: [
          'Real-time scan completed - All clear',
          'Monitoring incoming network traffic',
          'Background app check completed',
          'Voice pattern verified successfully',
        ][Math.floor(Math.random() * 4)],
        risk: 'low',
        timestamp: new Date(),
      };
      setMonitoringAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
    }, 30000);

    return () => clearInterval(interval);
  }, [is24HrMonitoring]);

  // Wave animation for listening state
  useEffect(() => {
    if (!isListening) {
      setWaveAmplitude([]);
      return;
    }

    const interval = setInterval(() => {
      setWaveAmplitude(Array.from({ length: 5 }, () => Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [isListening]);

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Browser not supported",
        description: "Please use Chrome or Edge for voice features",
        variant: "destructive",
      });
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          setTranscript(transcript);
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        handleUserMessage(finalTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        toast({
          title: "Voice Error",
          description: "Could not understand. Please try again.",
          variant: "destructive",
        });
      }
    };

    return recognition;
  }, [toast]);

  // Start listening
  const startListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Text to speech
  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  // Handle user message
  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Determine message type based on content
      let type = 'general';
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('check') || lowerText.includes('suspicious') || lowerText.includes('scam')) {
        type = 'threat_check';
      } else if (lowerText.includes('safe') || lowerText.includes('status') || lowerText.includes('security')) {
        type = 'security_status';
      } else if (lowerText.includes('help') || lowerText.includes('emergency') || lowerText.includes('urgent')) {
        type = 'emergency';
      }

      const { data, error } = await supabase.functions.invoke('voice-assistant', {
        body: { message: text, type },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        type: type === 'emergency' ? 'alert' : type === 'threat_check' ? 'info' : 'success',
      };
      setMessages(prev => [...prev, assistantMessage]);
      speak(data.response);
    } catch (error) {
      console.error('Assistant error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm here to help. Please try again or ask me about cyber safety.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  // Quick action buttons
  const quickActions = [
    { icon: Phone, label: 'Check Call', action: () => handleUserMessage('Is the last call I received safe?') },
    { icon: MessageSquare, label: 'Check SMS', action: () => handleUserMessage('Check my recent messages for scams') },
    { icon: Link2, label: 'Check Link', action: () => handleUserMessage('How do I check if a link is safe?') },
    { icon: Brain, label: 'Teach Me', action: () => handleUserMessage('Teach me a cyber safety tip') },
  ];

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high': return <XCircle size={14} className="text-destructive" />;
      case 'medium': return <AlertTriangle size={14} className="text-warning" />;
      default: return <CheckCircle size={14} className="text-success" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 24/7 Monitoring Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/30 via-primary/20 to-background border border-primary/30 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`relative w-16 h-16 rounded-2xl ${is24HrMonitoring ? 'gradient-primary glow-primary' : 'bg-muted'} flex items-center justify-center`}>
              <Shield size={28} className={is24HrMonitoring ? 'text-primary-foreground' : 'text-muted-foreground'} />
              {is24HrMonitoring && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full animate-pulse border-2 border-background" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">KAMP EYE Assistant</h2>
              <div className="flex items-center gap-2 mt-1">
                <Radio size={14} className={is24HrMonitoring ? 'text-success animate-pulse' : 'text-muted-foreground'} />
                <span className={`text-sm ${is24HrMonitoring ? 'text-success' : 'text-muted-foreground'}`}>
                  {is24HrMonitoring ? '24/7 Monitoring Active' : 'Monitoring Paused'}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant={is24HrMonitoring ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIs24HrMonitoring(!is24HrMonitoring)}
            className={is24HrMonitoring ? 'bg-success hover:bg-success/90' : ''}
          >
            {is24HrMonitoring ? 'Active' : 'Enable'}
          </Button>
        </div>

        {/* Live Activity Wave */}
        {is24HrMonitoring && (
          <div className="mt-4 flex items-center gap-2 h-8">
            <Activity size={16} className="text-primary" />
            <div className="flex-1 flex items-end gap-1 h-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/50 rounded-t transition-all duration-150"
                  style={{ height: `${20 + Math.sin(Date.now() / 200 + i) * 30 + Math.random() * 20}%` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Voice Control Center */}
      <div className="bg-card rounded-3xl border border-white/10 p-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Main Voice Button */}
          <div className="relative">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                isListening 
                  ? 'bg-destructive glow-primary scale-110' 
                  : isProcessing
                    ? 'bg-warning animate-pulse'
                    : 'gradient-primary glow-primary hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff size={40} className="text-white" />
              ) : isProcessing ? (
                <Waves size={40} className="text-white animate-spin" />
              ) : (
                <Mic size={40} className="text-white" />
              )}
            </button>

            {/* Voice Waves */}
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center">
                {waveAmplitude.map((amp, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full border-2 border-primary/50 animate-ping"
                    style={{
                      width: `${120 + i * 30}px`,
                      height: `${120 + i * 30}px`,
                      animationDelay: `${i * 0.1}s`,
                      opacity: 0.5 - i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="text-center">
            <p className="text-lg font-semibold">
              {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to Speak'}
            </p>
            {transcript && (
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">"{transcript}"</p>
            )}
            {isSpeaking && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Volume2 size={16} className="text-primary animate-pulse" />
                <span className="text-sm text-primary">Speaking...</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-3 w-full">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.action}
                  disabled={isProcessing}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <Icon size={20} className="text-primary" />
                  <span className="text-xs text-muted-foreground">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conversation History */}
      {messages.length > 0 && (
        <div className="bg-card rounded-3xl border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <MessageSquare size={16} />
            Conversation
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-primary/20 ml-8' 
                    : msg.type === 'alert'
                      ? 'bg-destructive/20 mr-8 border border-destructive/30'
                      : 'bg-muted/50 mr-8'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Monitoring Alerts */}
      {is24HrMonitoring && monitoringAlerts.length > 0 && (
        <div className="bg-card rounded-3xl border border-white/10 p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            Live Monitoring Feed
          </h3>
          <div className="space-y-2">
            {monitoringAlerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-white/5"
              >
                {getRiskIcon(alert.risk)}
                <p className="flex-1 text-sm">{alert.message}</p>
                <span className="text-xs text-muted-foreground">
                  {Math.round((Date.now() - alert.timestamp.getTime()) / 60000)}m ago
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voice Commands Guide */}
      <div className="bg-muted/30 rounded-2xl p-4 border border-white/5">
        <h4 className="text-sm font-semibold mb-2">Voice Commands</h4>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <p>"Check this number"</p>
          <p>"Am I safe?"</p>
          <p>"Check this link"</p>
          <p>"Teach me safety tips"</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
