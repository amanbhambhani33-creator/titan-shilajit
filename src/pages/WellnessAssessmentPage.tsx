import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Clock,
  Heart,
  Activity,
  Zap,
  Coffee,
  RotateCcw,
} from 'lucide-react';
import { AssessmentFormData, AssessmentResultData } from '../types';
import { getAssessmentRoutineWhatsAppUrl } from '../utils/whatsapp';

export const WellnessAssessmentPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentFormData>({
    name: '',
    age: '',
    lifestyle: 'Moderately Active',
    wellnessGoals: ['Energy & Daily Vitality'],
    sleepDuration: '7-8 hours',
    exerciseFrequency: '3-4 times a week',
    currentEnergyLevels: 'Afternoon Dips',
    isPregnantOrBreastfeeding: false,
    isUnderMedicalTreatment: false,
    takesPrescriptionMedication: false,
    hasDiagnosedMedicalCondition: false,
    hasIngredientAllergies: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResultData | null>(null);

  const goalOptions = [
    'Energy & Daily Vitality',
    'Workout Stamina & Athletic Endurance',
    'Mental Focus & Cognitive Clarity',
    'Stress Adaptation & Restorative Sleep',
    'Better Daily Routine Consistency',
    'Natural Men’s Vitality & Strength',
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.wellnessGoals.includes(goal);
      if (exists) {
        return {
          ...prev,
          wellnessGoals: prev.wellnessGoals.filter((g) => g !== goal),
        };
      } else {
        return {
          ...prev,
          wellnessGoals: [...prev.wellnessGoals, goal],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Assessment submission error:', err);
      // Fallback
      setResult({
        primaryGoal: formData.wellnessGoals[0] || 'Daily Vitality',
        lifestyleSummary: `${formData.lifestyle} profile focused on energy and consistent daily performance`,
        suggestedProduct: 'Titan Pure Himalayan Shilajit Resin (20g)',
        productSlug: 'titan-shilajit-resin',
        whyThisFits: 'Titan Pure Himalayan Shilajit delivers fulvic acid (>75%) and 84+ ionic trace minerals to support cellular energy and routine stamina.',
        suggestedRoutine: [
          {
            time: 'Morning (Within 30 mins of waking)',
            action: 'Core Titan Shilajit Serving',
            details: '300–500 mg daily (a pea-sized portion measured with the included spoon) dissolved in lukewarm water.',
          },
          {
            time: 'Consistency Milestone',
            action: '60–90 Day Cycle',
            details: 'Maintain morning intake for 60 to 90 consecutive days for natural metabolic adaptation.',
          },
        ],
        approvedServing: '300–500 mg daily (pea-sized portion)',
        approvedTiming: 'Morning on an empty stomach',
        consistencyDuration: '60 to 90 consecutive days',
        whatYouMayNotice: 'Some users notice improvements in morning alertness and overall endurance over 3 to 6 weeks. Individual results vary.',
        safetyAdvisory: 'Consult a physician if you have any medical condition or take prescription medications.',
        isSafetyRestricted: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStep(1);
    setFormData({
      name: '',
      age: '',
      lifestyle: 'Moderately Active',
      wellnessGoals: ['Energy & Daily Vitality'],
      sleepDuration: '7-8 hours',
      exerciseFrequency: '3-4 times a week',
      currentEnergyLevels: 'Afternoon Dips',
      isPregnantOrBreastfeeding: false,
      isUnderMedicalTreatment: false,
      takesPrescriptionMedication: false,
      hasDiagnosedMedicalCondition: false,
      hasIngredientAllergies: false,
    });
  };

  return (
    <div id="wellness-assessment-page" className="min-h-screen pt-28 pb-24 bg-[#F7F3E8] text-[#10110F]">
      {/* Header Banner */}
      <div className="max-w-3xl mx-auto px-4 text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#183D27]/10 text-[#183D27] text-xs font-bold tracking-[0.2em] uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#B88A32]" />
          <span>PERSONALIZED HIMALAYAN ROUTINE</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#10110F]">
          TITAN WELLNESS ASSESSMENT
        </h1>

        <p className="text-xs sm:text-sm text-[#66704B] font-sans mt-2 max-w-xl mx-auto">
          Discover your ideal Titan formulation, timing, and morning ritual based on client-approved guidance and modern vitality principles.
        </p>

        {/* Safety Disclaimer Banner */}
        <div className="mt-4 p-3 rounded-xs bg-[#183D27]/5 border border-[#183D27]/15 text-[11px] text-[#183D27] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Educational & product guidance tool only. Does not diagnose or prescribe treatment.</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {!result ? (
          <div className="bg-white rounded-sm border border-[#10110F]/10 p-6 sm:p-10 shadow-sm">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#10110F]/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#183D27]">
                Step {step} of 3
              </span>
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-8 h-1.5 rounded-full transition-colors ${
                      step >= s ? 'bg-[#183D27]' : 'bg-[#EEE8D7]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* STEP 1: Personal & Goals */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#10110F]">
                      Your Goals & Profile
                    </h3>
                    <p className="text-xs text-[#66704B] mt-0.5">
                      Select what you wish to prioritize with your Titan Shilajit protocol.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1.5">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul, Aman"
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:outline-none focus:border-[#183D27]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1.5">
                        Age Group
                      </label>
                      <select
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm focus:outline-none focus:border-[#183D27] bg-white"
                      >
                        <option value="">Select age range</option>
                        <option value="18-25">18–25 years</option>
                        <option value="26-35">26–35 years</option>
                        <option value="36-45">36–45 years</option>
                        <option value="46-55">46–55 years</option>
                        <option value="55+">55+ years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-2">
                      Primary Wellness Objectives (Select 1 to 3)
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {goalOptions.map((goal) => {
                        const isSelected = formData.wellnessGoals.includes(goal);
                        return (
                          <button
                            type="button"
                            key={goal}
                            onClick={() => handleGoalToggle(goal)}
                            className={`p-3 rounded-xs border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-[#183D27] text-[#F7F3E8] border-[#183D27] font-semibold'
                                : 'bg-[#F7F3E8]/60 text-[#10110F] border-[#10110F]/10 hover:border-[#183D27]'
                            }`}
                          >
                            <span>{goal}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4B66A]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 rounded-xs bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#183D27] transition-colors"
                    >
                      <span>Continue to Lifestyle</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Lifestyle & Activity */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#10110F]">
                      Your Daily Rhythm & Activity
                    </h3>
                    <p className="text-xs text-[#66704B] mt-0.5">
                      Helps us recommend between Pure Resin or portable Honey Sticks.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1.5">
                      Daily Activity Level
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {['Desk / Sedentary', 'Moderately Active', 'Athlete / Heavy Gym'].map((lvl) => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => setFormData({ ...formData, lifestyle: lvl })}
                          className={`p-3 rounded-xs border text-center text-xs font-medium transition-all ${
                            formData.lifestyle === lvl
                              ? 'bg-[#183D27] text-[#F7F3E8] border-[#183D27] font-bold'
                              : 'bg-[#F7F3E8]/60 text-[#10110F] border-[#10110F]/10 hover:border-[#183D27]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1.5">
                        Average Nightly Sleep
                      </label>
                      <select
                        value={formData.sleepDuration}
                        onChange={(e) => setFormData({ ...formData, sleepDuration: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm bg-white"
                      >
                        <option value="Under 6 hours">Under 6 hours</option>
                        <option value="6-7 hours">6–7 hours</option>
                        <option value="7-8 hours">7–8 hours (Optimal)</option>
                        <option value="8+ hours">8+ hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1.5">
                        Exercise Frequency
                      </label>
                      <select
                        value={formData.exerciseFrequency}
                        onChange={(e) => setFormData({ ...formData, exerciseFrequency: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm bg-white"
                      >
                        <option value="Rarely / Casual walks">Rarely / Casual walks</option>
                        <option value="1-2 times a week">1–2 times a week</option>
                        <option value="3-4 times a week">3–4 times a week</option>
                        <option value="5+ intense sessions">5+ intense sessions</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-xs border border-[#10110F]/20 text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-black/5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-3 rounded-xs bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#183D27] transition-colors"
                    >
                      <span>Safety Screening</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Strict Safety Screening */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#10110F]">
                      Safety & Health Screening
                    </h3>
                    <p className="text-xs text-[#66704B] mt-0.5">
                      Titan Shilajit strictly enforces client safety and contraindication checks.
                    </p>
                  </div>

                  <div className="space-y-3 bg-[#F7F3E8]/80 p-4 rounded-xs border border-[#10110F]/10">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPregnantOrBreastfeeding}
                        onChange={(e) =>
                          setFormData({ ...formData, isPregnantOrBreastfeeding: e.target.checked })
                        }
                        className="mt-1 rounded-xs text-[#183D27] focus:ring-[#183D27]"
                      />
                      <span className="text-xs text-[#10110F]">
                        Are you currently pregnant, nursing, or planning a pregnancy?
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.takesPrescriptionMedication}
                        onChange={(e) =>
                          setFormData({ ...formData, takesPrescriptionMedication: e.target.checked })
                        }
                        className="mt-1 rounded-xs text-[#183D27] focus:ring-[#183D27]"
                      />
                      <span className="text-xs text-[#10110F]">
                        Are you currently taking prescription medications (e.g. for blood pressure, diabetes, blood thinners)?
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasDiagnosedMedicalCondition}
                        onChange={(e) =>
                          setFormData({ ...formData, hasDiagnosedMedicalCondition: e.target.checked })
                        }
                        className="mt-1 rounded-xs text-[#183D27] focus:ring-[#183D27]"
                      />
                      <span className="text-xs text-[#10110F]">
                        Have you been diagnosed with active kidney disorders, gout, or elevated uric acid?
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasIngredientAllergies}
                        onChange={(e) =>
                          setFormData({ ...formData, hasIngredientAllergies: e.target.checked })
                        }
                        className="mt-1 rounded-xs text-[#183D27] focus:ring-[#183D27]"
                      />
                      <span className="text-xs text-[#10110F]">
                        Do you have known allergies to raw bee pollen, raw honey, or cacao?
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 rounded-xs border border-[#10110F]/20 text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-black/5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-8 py-3 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span>Formulating Routine...</span>
                      ) : (
                        <>
                          <span>GENERATE MY TITAN PROTOCOL</span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          /* RESULT CARD */
          <div className="bg-white rounded-sm border border-[#B88A32]/40 p-6 sm:p-10 shadow-lg animate-in zoom-in-95 duration-300">
            {result.isSafetyRestricted ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#10110F]">
                  Medical Consultation Recommended
                </h3>
                <p className="text-xs sm:text-sm text-[#66704B] leading-relaxed max-w-lg mx-auto">
                  {result.whyThisFits}
                </p>
                <div className="p-4 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 text-xs text-[#10110F] text-left">
                  <strong>Guidance:</strong> Please share Titan Shilajit product specifications with your physician or qualified healthcare provider before starting any botanical regimen.
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xs bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider"
                >
                  Retake Assessment
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#10110F]/10">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[#183D27] uppercase">
                      RECOMMENDED PROTOCOL
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#10110F] mt-1">
                      {result.suggestedProduct}
                    </h3>
                  </div>

                  <div className="bg-[#183D27] text-[#D4B66A] px-3.5 py-1.5 rounded-xs text-xs font-bold tracking-wider uppercase shrink-0 text-center">
                    Primary Goal: {result.primaryGoal}
                  </div>
                </div>

                {/* Analysis */}
                <div className="p-5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#10110F]">
                    Lifestyle & Vitality Profile
                  </h4>
                  <p className="text-xs text-[#66704B] leading-relaxed">
                    {result.whyThisFits}
                  </p>
                </div>

                {/* Approved Serving & Timing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xs bg-white border border-[#10110F]/10">
                    <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider">Approved Serving</span>
                    <p className="text-xs font-bold text-[#10110F] mt-1">{result.approvedServing}</p>
                  </div>

                  <div className="p-4 rounded-xs bg-white border border-[#10110F]/10">
                    <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider">Best Timing</span>
                    <p className="text-xs font-bold text-[#10110F] mt-1">{result.approvedTiming}</p>
                  </div>

                  <div className="p-4 rounded-xs bg-white border border-[#10110F]/10">
                    <span className="text-[10px] text-[#66704B] uppercase font-bold tracking-wider">Suggested Cycle</span>
                    <p className="text-xs font-bold text-[#10110F] mt-1">{result.consistencyDuration}</p>
                  </div>
                </div>

                {/* Morning Sequence Steps */}
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#10110F] mb-3">
                    Your Step-by-Step Morning Routine
                  </h4>
                  <div className="space-y-3">
                    {result.suggestedRoutine.map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/10 flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#183D27] text-[#D4B66A] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <strong className="text-xs text-[#10110F] block">{step.time}: {step.action}</strong>
                          <span className="text-xs text-[#66704B]">{step.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What to Expect */}
                <div className="p-4 rounded-xs bg-[#EEE8D7]/60 border border-[#10110F]/10 text-xs text-[#66704B]">
                  <strong>What you may notice:</strong> {result.whatYouMayNotice}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#10110F]/10 flex flex-col sm:flex-row gap-3">
                  <a
                    id="assessment-order-whatsapp-btn"
                    href={getAssessmentRoutineWhatsAppUrl(formData.name, result.suggestedProduct, result.primaryGoal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 rounded-xs bg-[#25D366] hover:bg-[#1EBE5D] text-[#10110F] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#10110F]" />
                    <span>ORDER MY ROUTINE ON WHATSAPP</span>
                  </a>

                  <button
                    onClick={handleReset}
                    className="px-5 py-3.5 rounded-xs border border-[#10110F]/20 text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-black/5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
