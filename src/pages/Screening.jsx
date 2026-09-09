import { AlertTriangle, Scan } from 'lucide-react';
import { Card, ProgressSteps, cx } from '../components/ui';
import { FadeIn } from '../components/motion';
import NewPassengerModal from '../components/NewPassengerModal';
import AuditReport from '../components/AuditReport';
import { addToHistory } from '../lib/store';
import useScreeningWizard from './screening/useScreeningWizard';
import StepDocument from './screening/StepDocument';
import StepInformation from './screening/StepInformation';
import StepFace from './screening/StepFace';
import StepAnalysis from './screening/StepAnalysis';
import StepResult from './screening/StepResult';
import { useT } from '../i18n';

const STEPS = ['step_document', 'step_information', 'step_face_short', 'step_analysis_short', 'step_result'];

export default function Screening({ focus = 'document' }) {
  const { t } = useT();
  const wiz = useScreeningWizard(focus);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <ProgressSteps steps={STEPS.map((s) => t(s))} current={wiz.step} />
      </div>

      {wiz.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {wiz.error}
          <button className="ml-auto text-xs font-semibold underline" onClick={() => wiz.setError(null)}>{t('dismiss')}</button>
        </div>
      )}

      {wiz.step >= 1 && wiz.result && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-white p-2 shadow-sm">
          {[
            { id: 1, label: t('mrz_validation'), icon: Scan },
            { id: 2, label: t('biometrics'), icon: Scan },
            { id: 3, label: t('forensics'), icon: Scan },
            { id: 4, label: t('risk_decision'), icon: Scan },
          ].map(({ id, label }) => (
            <button key={id} onClick={() => { wiz.setStep(id); if (id === 3) wiz.setShowTechnical(true); }}
              className={cx('flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors',
                wiz.step === id ? 'bg-navy-800 text-white shadow-sm' : 'text-foreground/70 hover:bg-surface-muted')}>
              {label}
            </button>
          ))}
          <span className="ml-auto hidden text-[11px] font-medium text-muted-foreground/60 md:inline">{t('module_reviews')}</span>
        </div>
      )}

      {wiz.step === 0 && <StepDocument {...wiz} />}
      {wiz.step >= 1 && <StepInformation result={wiz.result} documentImage={wiz.documentImage} />}
      {wiz.step >= 2 && <StepFace result={wiz.result} documentImage={wiz.documentImage} liveImage={wiz.liveImage} setLiveImage={wiz.setLiveImage} runScreening={wiz.runScreening} />}
      {wiz.step >= 3 && <StepAnalysis result={wiz.result} showTechnical={wiz.showTechnical} setShowTechnical={wiz.setShowTechnical} setStep={wiz.setStep} />}
      {wiz.step === 4 && wiz.result && <StepResult {...wiz} />}

      <NewPassengerModal
        isOpen={wiz.showRegister}
        onClose={() => wiz.setShowRegister(false)}
        onPassengerCreated={(passenger, screeningResult) => {
          const rc = addToHistory(screeningResult, { source: 'live', scenario: `${passenger.holder_name} (registered)` });
          wiz.setResult(screeningResult);
          wiz.setRecordId(rc.id);
          wiz.setDocumentImage(screeningResult?.extracted_data?.document_image_b64 || wiz.documentImage);
          wiz.setLiveImage(screeningResult?.extracted_data?.live_passenger_b64 || wiz.liveImage);
          wiz.setActivePreset(null);
          wiz.setUploadName(passenger.holder_name);
          wiz.applyFocus();
        }}
      />

      {wiz.showReport && <AuditReport screening={wiz.result} onClose={() => wiz.setShowReport(false)} />}
    </div>
  );
}
