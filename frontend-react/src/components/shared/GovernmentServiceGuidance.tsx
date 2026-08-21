import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Clock, AlertTriangle, FileText,
  UserCheck, ShieldCheck, ChevronRight, HelpCircle,
  ArrowRight, Download, ExternalLink, Info, Check, ShieldAlert
} from 'lucide-react';
import type { Property, PropertyDocument } from '../../models/property.models';

interface GovernmentServiceGuidanceProps {
  property?: Property | null;
  documents?: PropertyDocument[];
  onOpenAiAssistant?: () => void;
}

export const GovernmentServiceGuidance: React.FC<GovernmentServiceGuidanceProps> = ({
  property,
  documents = [],
  onOpenAiAssistant
}) => {
  const [activeStep, setActiveStep] = useState<number>(3); // default showing in-progress review
  const [selectedDocChecklist, setSelectedDocChecklist] = useState<Record<string, boolean>>({
    patta: true,
    ec: true,
    tax: true,
    survey: false
  });

  const isApproved = property?.status === 'APPROVED';
  const isPending = property?.status === 'PENDING';
  const isRejected = property?.status === 'REJECTED';

  const steps = [
    {
      id: 1,
      title: 'AI Analysis Completed',
      subtitle: 'Automated OCR & Spatial Check',
      status: 'completed',
      date: 'Instant AI Run',
      details: 'OCR extracted Survey Number, extent, boundary points, and cross-referenced with public land registry tables.',
      badgeText: 'AI Completed',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
    },
    {
      id: 2,
      title: 'Verification Assessment',
      subtitle: 'Trust Score & Risk Evaluation',
      status: 'completed',
      date: 'Completed',
      details: 'AI Land Trust Score calculated at 88/100. No major overlapping polygon claims detected within 500m radius.',
      badgeText: 'Trust Score 88/100',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300'
    },
    {
      id: 3,
      title: 'Required Documents Submission',
      subtitle: 'Citizen Checklist Verification',
      status: isApproved ? 'completed' : 'current',
      date: 'Action Item',
      details: 'Verify submitted Patta passbook, 15-year Encumbrance Certificate, mutation copy, and property tax receipt.',
      badgeText: 'Mandatory',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
    },
    {
      id: 4,
      title: 'Government Officer Review',
      subtitle: 'Revenue Inspector / Tehsildar',
      status: isApproved ? 'completed' : isRejected ? 'rejected' : 'current',
      date: 'Under Officer Review',
      details: 'Assigned Revenue Officer examines AI report, spatial coordinates, and physical boundary records for official determination.',
      badgeText: 'Officer Action',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300'
    },
    {
      id: 5,
      title: 'Final Verification Status',
      subtitle: 'Government Certification Badge',
      status: isApproved ? 'completed' : isRejected ? 'rejected' : 'pending',
      date: isApproved ? 'Certified & Approved' : isRejected ? 'Rejected' : 'Pending Sign-off',
      details: isApproved
        ? 'Government Verified badge issued. Immutable audit record stored in state land registry.'
        : isRejected
        ? 'Verification declined due to documented discrepancy. Citizen may appeal with supplemental records.'
        : 'Final state certification pending officer decision.',
      badgeText: isApproved ? 'Verified' : isRejected ? 'Declined' : 'Pending',
      badgeColor: isApproved
        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
        : isRejected
        ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
    }
  ];

  const toggleDoc = (key: string) => {
    setSelectedDocChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800/40">
              Government Service Workflow
            </span>
            <span className="text-xs text-slate-400">Citizen Transparency Portal</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            What Should I Do Next? — Land Verification Roadmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Transparent end-to-end guidance from AI pre-screening to official government sign-off.
          </p>
        </div>

        {onOpenAiAssistant && (
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ask AI Citizen Assistant</span>
          </button>
        )}
      </div>

      {/* Stepper Visualization */}
      <div className="relative">
        {/* Desktop / Tablet Connecting Line */}
        <div className="hidden md:block absolute top-7 left-8 right-8 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {steps.map((step) => {
            const isSelected = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500/80 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-xs ${
                        step.status === 'completed'
                          ? 'bg-emerald-500 text-white'
                          : step.status === 'rejected'
                          ? 'bg-rose-500 text-white'
                          : step.status === 'current'
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : step.status === 'rejected' ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${step.badgeColor}`}>
                      {step.badgeText}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {step.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{step.date}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-blue-600 translate-x-0.5' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detailed View Card */}
      {steps[activeStep - 1] && (
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {activeStep}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Step {activeStep}: {steps[activeStep - 1].title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {steps[activeStep - 1].details}
              </p>
            </div>

            {activeStep === 3 ? (
              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs shrink-0 space-y-2 min-w-[240px]">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wide">
                  Citizen Document Checklist:
                </p>
                <div className="space-y-1.5">
                  {[
                    { key: 'patta', label: 'Patta / Title Passbook' },
                    { key: 'ec', label: '15-Year Encumbrance (EC)' },
                    { key: 'tax', label: 'Recent Property Tax Receipt' },
                    { key: 'survey', label: 'FMB / Survey Sketch Map' }
                  ].map(doc => (
                    <label
                      key={doc.key}
                      onClick={() => toggleDoc(doc.key)}
                      className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!selectedDocChecklist[doc.key]}
                        onChange={() => {}}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span>{doc.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  Status: <strong className="text-slate-900 dark:text-white">{steps[activeStep - 1].badgeText}</strong>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Responsible AI Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-amber-900 dark:text-amber-200 leading-normal">
          <strong>Important Citizen Information:</strong> LandLens provides AI-assisted analysis and risk flag summaries. Official legal land verification, Patta registration, and title certification are governed by the State Revenue Department and authorized Government Officers.
        </div>
      </div>
    </div>
  );
};
