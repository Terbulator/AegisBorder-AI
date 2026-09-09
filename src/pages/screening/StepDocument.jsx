import { useRef } from 'react';
import { FileText, Camera, UploadCloud, Eye, EyeOff, User, Loader2, X } from 'lucide-react';
import { Card, Badge, Button, cx } from '../../components/ui';
import { RiskReveal, StaggerContainer, StaggerItem, FadeIn } from '../../components/motion';
import CameraCapture from '../../components/CameraCapture';
import BiometricVerification from '../../components/BiometricVerification';
import { useT } from '../../i18n';

export default function StepDocument(wiz) {
  const { t } = useT();
  const fileRef = useRef(null);
  const liveFileRef = useRef(null);

  const readDocFile = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      wiz.setDocumentImage(ev.target?.result);
      wiz.setUploadName(file.name);
      wiz.setActivePreset(null);
      wiz.setResult(null);
      wiz.setRecordId(null);
      wiz.setGuidedBio?.(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <FadeIn y={10}>
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-extrabold text-white">1</div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('step_document')}</h2>
            <p className="text-xs text-slate-500">{t('step_document_desc')}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500">{t('input_source')}:</span>
          <Button variant="secondary" onClick={() => wiz.setShowRegister(true)}><User className="h-4 w-4" /> {t('register_passenger')}</Button>
        </div>

        <p className="mb-2 text-xs font-semibold text-slate-500">{t('test_scenarios')}</p>
        {wiz.presets.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> {t('loading_scenarios')}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
            {wiz.presets.map((p) => (
              <StaggerItem key={p.id}>
                <button type="button" onClick={() => wiz.loadPreset(p.id)}
                  className={cx('group relative h-full w-full rounded-lg border p-3 text-left transition-colors',
                    wiz.activePreset?.id === p.id ? 'border-navy-800 bg-navy-50 ring-1 ring-navy-800' : 'border-slate-200 bg-slate-50 hover:border-slate-300')}>
                  {p.is_custom && (
                    <span role="button" tabIndex={0} aria-label={`Delete ${p.holder_name}`}
                      onClick={(e) => wiz.deletePassenger(p.id, p.holder_name, e)}
                      onKeyDown={(e) => e.key === 'Enter' && wiz.deletePassenger(p.id, p.holder_name, e)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 opacity-0 shadow transition-opacity hover:text-red-600 group-hover:opacity-100">
                      <X className="h-3 w-3" />
                    </span>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-bold text-slate-800">{p.holder_name}</span>
                    <Badge color={p.badge_color || 'slate'}>{p.badge}</Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">{p.document_type} · {p.nationality || '—'} · {p.doc_number}</div>
                  <p className="mt-1 line-clamp-1 text-[11px] text-slate-400">{p.description}</p>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="my-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600"><FileText className="mr-1.5 inline h-3.5 w-3.5 text-navy-700" />{t('document_scan')}</span>
              <div className="flex items-center gap-2">
                {!wiz.docCamOn && (
                  <button type="button" onClick={() => wiz.setDocCamOn(true)} className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                    <Camera className="h-3.5 w-3.5" /> {t('scan_with_webcam')}
                  </button>
                )}
                <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                  <UploadCloud className="h-3.5 w-3.5" /> {t('upload')}
                </button>
                <input type="file" ref={fileRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) readDocFile(f); }} accept="image/*" className="hidden" />
              </div>
            </div>
            <div className={cx('flex min-h-[190px] items-center justify-center rounded-lg border border-dashed',
              wiz.dragOver ? 'border-navy-600 bg-navy-50 ring-1 ring-navy-500' : 'border-slate-300 bg-slate-50')}
              onDragOver={(e) => { e.preventDefault(); wiz.setDragOver(true); }}
              onDragLeave={() => wiz.setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); wiz.setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) readDocFile(f); }}>
              {wiz.documentImage ? (
                <img src={wiz.documentImage} alt={t('document_scan')} className="max-h-[190px] rounded object-contain" />
              ) : wiz.docCamOn ? (
                <CameraCapture onCapture={(b64) => { wiz.setDocumentImage(b64); wiz.setUploadName('Webcam capture'); wiz.setActivePreset(null); wiz.setResult(null); wiz.setRecordId(null); wiz.setDocCamOn(false); }} onCancel={() => wiz.setDocCamOn(false)} className="py-4" />
              ) : wiz.dragOver ? (
                <p className="px-4 text-center text-sm font-semibold text-navy-800">Drop document to upload</p>
              ) : (
                <p className="px-4 text-center text-sm text-slate-400">{t('select_scenario_hint')}</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600"><Camera className="mr-1.5 inline h-3.5 w-3.5 text-emerald-600" />{t('live_passenger')}</span>
              {wiz.liveImage && (
                <Button variant="secondary" className="!px-2 !py-1 text-xs" onClick={() => wiz.setLiveImage(null)}>
                  <Camera className="h-3.5 w-3.5" /> {t('retake')}
                </Button>
              )}
            </div>
            <div className="flex min-h-[190px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              {wiz.liveImage ? (
                <img src={wiz.liveImage} alt={t('passenger_face')} className="max-h-[190px] rounded object-contain" />
              ) : wiz.documentImage ? (
                <div className="w-full px-4 py-3">
                  <BiometricVerification documentImageB64={wiz.documentImage} onComplete={wiz.handleGuidedVerify} compact />
                  <button onClick={() => liveFileRef.current?.click()} className="mt-2 w-full text-xs font-semibold text-navy-700 hover:underline">
                    {t('upload_photo')} / {t('scan_with_webcam')}
                  </button>
                </div>
              ) : (
                <div className="w-full px-4 py-3 text-center">
                  <CameraCapture onCapture={(b64) => { wiz.setLiveImage(b64); if (wiz.result) wiz.runScreening(b64); }} className="mx-auto mb-1" />
                  <button onClick={() => liveFileRef.current?.click()} className="text-xs font-semibold text-navy-700 hover:underline">{t('upload_photo')}</button>
                  <p className="mt-1 text-xs text-slate-400">{t('face_optional')}</p>
                </div>
              )}
            </div>
            <input type="file" ref={liveFileRef} accept="image/*" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { const r = new FileReader(); r.onload = (ev) => wiz.setLiveImage(ev.target?.result); r.readAsDataURL(f); }
            }} />
          </div>
        </div>

        <button onClick={() => wiz.setShowMrz(!wiz.showMrz)} className="mb-2 flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:underline">
          {wiz.showMrz ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {wiz.showMrz ? t('hide') : t('show')} {t('raw_mrz_string')}
        </button>
        <RiskReveal show={wiz.showMrz}>
          {wiz.showMrz && (
            <textarea rows={3} value={wiz.mrzText} onChange={(e) => wiz.setMrzText(e.target.value)}
              placeholder="MRZ Line 1&#10;MRZ Line 2" className="mb-4 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs focus:border-navy-500 focus:outline-none" />
          )}
        </RiskReveal>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
          <div className="mr-auto text-xs text-slate-400">
            {wiz.result ? 'Screening completed — advance to review.' : 'Run the AI pipeline to start the guided review.'}
          </div>
          <Button onClick={() => wiz.runScreening()} loading={wiz.loading}>
            Run AI Screening
          </Button>
        </div>
      </Card>
    </FadeIn>
  );
}
