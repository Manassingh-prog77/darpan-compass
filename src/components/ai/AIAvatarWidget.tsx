import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { MessageCircle, X, Globe, Volume2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sampleResponses: Record<string, Record<string, string>> = {
  "Explain the new water policy in simple Hindi": {
    en: "The new water policy mandates equitable distribution of potable water to all urban and rural areas. Key provisions include: 1) Minimum 55 liters per capita per day, 2) Mandatory rainwater harvesting for new constructions, 3) Pollution penalties increased by 200%.",
    hi: "नई जल नीति सभी शहरी और ग्रामीण क्षेत्रों में पेयजल के समान वितरण को अनिवार्य करती है। प्रमुख प्रावधान: 1) प्रति व्यक्ति प्रतिदिन न्यूनतम 55 लीटर, 2) नए निर्माण के लिए वर्षा जल संचयन अनिवार्य, 3) प्रदूषण दंड में 200% की वृद्धि।",
    te: "కొత్త నీటి విధానం అన్ని పట్టణ మరియు గ్రామీణ ప్రాంతాలకు తాగునీటిని సమానంగా పంపిణీ చేయడాన్ని తప్పనిసరి చేస్తుంది.",
  },
  "What are the RTI rules?": {
    en: "Under the Right to Information Act, 2005, any citizen can request information from public authorities. Response must be provided within 30 days. Fee: ₹10 for application. Appeals can be filed with the First Appellate Authority.",
    hi: "सूचना का अधिकार अधिनियम, 2005 के तहत, कोई भी नागरिक सार्वजनिक प्राधिकरणों से जानकारी का अनुरोध कर सकता है। 30 दिनों के भीतर उत्तर देना अनिवार्य है।",
    te: "సమాచార హక్కు చట్టం, 2005 ప్రకారం, ఏ పౌరుడైనా ప్రభుత్వ అధికారుల నుండి సమాచారాన్ని అభ్యర్థించవచ్చు.",
  },
  "Explain budget allocation process": {
    en: "Budget allocation follows a three-tier process: 1) Central Finance Commission recommends state shares, 2) State governments allocate to constituencies based on population, development index, and special needs, 3) Local representatives submit utilization certificates quarterly.",
    hi: "बजट आवंटन तीन-स्तरीय प्रक्रिया का पालन करता है: 1) केंद्रीय वित्त आयोग राज्य के हिस्से की सिफारिश करता है, 2) राज्य सरकारें जनसंख्या के आधार पर निर्वाचन क्षेत्रों को आवंटित करती हैं।",
    te: "బడ్జెట్ కేటాయింపు మూడు-స్థాయి ప్రక్రియను అనుసరిస్తుంది.",
  },
};

const prompts = Object.keys(sampleResponses);

const AIAvatarWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const { lang } = useApp();

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50"
        aria-label="Open AI Law Explainer"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-primary-foreground px-5 py-4">
              <h3 className="font-semibold text-base">AI Law Explainer</h3>
              <p className="text-xs opacity-80">Ask about laws, policies, and government procedures</p>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {!selectedPrompt ? (
                <>
                  <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                  {prompts.map(p => (
                    <button
                      key={p}
                      onClick={() => setSelectedPrompt(p)}
                      className="w-full text-left px-4 py-3 bg-secondary rounded-xl text-sm hover:bg-muted transition-colors text-foreground"
                    >
                      {p}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm max-w-[80%]">
                      {selectedPrompt}
                    </div>
                  </div>
                  {/* AI response */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-secondary px-4 py-3 rounded-2xl rounded-tl-sm text-sm max-w-[90%] text-foreground"
                  >
                    {sampleResponses[selectedPrompt]?.[lang] || sampleResponses[selectedPrompt]?.en}
                  </motion.div>
                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <Volume2 className="w-3 h-3" /> Read Aloud
                    </button>
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <FileText className="w-3 h-3" /> Cite Sources
                    </button>
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <Globe className="w-3 h-3" /> {lang.toUpperCase()}
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedPrompt(null)}
                    className="text-xs text-verified underline"
                  >
                    Ask another question
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAvatarWidget;
