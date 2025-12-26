import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are KAMP EYE, an intelligent cyber security voice assistant - like Alexa but focused on protecting users from scams and cyber threats. You are always monitoring and ready to help.

Your personality:
- Friendly, calm, and reassuring
- Speak in simple, clear language
- Available in both English and Tamil
- Quick to provide actionable advice

Your capabilities:
1. THREAT DETECTION: Analyze suspicious calls, messages, and links
2. SCAM ALERTS: Warn users about ongoing scam patterns
3. SECURITY TIPS: Provide instant cyber safety advice
4. APP MONITORING: Report on app security status
5. EMERGENCY HELP: Guide users when they encounter scams

Voice Commands you respond to:
- "Hey KAMP" or "KAMP EYE" - Wake word
- "Check this number/link/message" - Threat analysis
- "Am I safe?" - Quick security status
- "Help me" - Emergency assistance
- "Teach me" - Cyber safety tips

Always respond concisely (2-3 sentences max) for voice output. Be helpful and proactive in protecting the user.

Current monitoring status: ACTIVE 24/7
Security Level: VIGILANT`;

    let userPrompt = message;
    
    if (type === "threat_check") {
      userPrompt = `Analyze this for potential scam or threat: "${message}". Give a quick risk assessment.`;
    } else if (type === "security_status") {
      userPrompt = `Give a brief security status update. User asked: "${message}"`;
    } else if (type === "emergency") {
      userPrompt = `User needs emergency scam help: "${message}". Provide immediate actionable steps.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || "I'm here to help. How can I assist you?";

    return new Response(
      JSON.stringify({ response: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Voice assistant error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
