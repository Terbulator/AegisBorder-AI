import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { apiPresets, apiPresetDetail, apiScreenDocument, apiDeletePassenger } from '../../lib/api';
import { addToHistory, updateRecordStatus } from '../../lib/store';
import { toast } from '../../components/Toast';
import { speakAlert } from '../../lib/voiceAlert';

const STORAGE_KEY = 'aegisborder_screening_state';

function loadPersistedState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function persistState(state) {
  try {
    const toSave = { step: state.step, documentImage: state.documentImage, liveImage: state.liveImage, mrzText: state.mrzText, uploadName: state.uploadName, activePresetId: state.activePreset?.id || null };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {}
}

export default function useScreeningWizard(focus = 'document') {
  const persisted = loadPersistedState();
  const [step, setStep] = useState(persisted?.step ?? 0);
  const [presets, setPresets] = useState([]);
  const [activePreset, setActivePreset] = useState(null);
  const [documentImage, setDocumentImage] = useState(persisted?.documentImage ?? null);
  const [liveImage, setLiveImage] = useState(persisted?.liveImage ?? null);
  const [mrzText, setMrzText] = useState(persisted?.mrzText ?? '');
  const [uploadName, setUploadName] = useState(persisted?.uploadName ?? null);
  const [result, setResult] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [officerStatus, setOfficerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTechnical, setShowTechnical] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMrz, setShowMrz] = useState(false);
  const [docCamOn, setDocCamOn] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [guidedBio, setGuidedBio] = useState(null);
  const confettiFiredRef = useRef(false);
  const spokeRef = useRef(null);

  useEffect(() => {
    if (!result || spokeRef.current === result) return;
    const tier = result.risk_assessment?.risk_tier;
    const flagged = !!result.watchlist_screening?.flagged;
    if (!flagged && tier !== 'HIGH' && tier !== 'CRITICAL') return;
    spokeRef.current = result;
    speakAlert(tier === 'CRITICAL' || flagged ? 'critical_risk_alert' : 'high_risk_alert');
  }, [result]);

  useEffect(() => {
    let active = true;
    apiPresets().then((data) => active && setPresets(data.presets || [])).catch(() => active && setPresets([]));
    return () => { active = false; };
  }, []);

  useEffect(() => { persistState({ step, documentImage, liveImage, mrzText, uploadName, activePreset }); }, [step, documentImage, liveImage, mrzText, uploadName, activePreset]);

  const refreshPresets = useCallback(() => {
    apiPresets().then((data) => setPresets(data.presets || [])).catch(() => {});
  }, []);

  const applyFocus = useCallback(() => {
    switch (focus) {
      case 'biometrics': setStep(2); break;
      case 'forensics': setStep(3); setShowTechnical(true); break;
      case 'watchlist': setStep(4); break;
      case 'audit': setStep(4); setShowReport(true); break;
      default: setStep(1);
    }
  }, [focus]);

  const deletePassenger = useCallback(async (id, holderName, e) => {
    e.stopPropagation();
    try {
      await apiDeletePassenger(id);
      if (activePreset?.id === id) {
        setActivePreset(null); setDocumentImage(null); setLiveImage(null);
        setMrzText(''); setGuidedBio(null);
      }
      refreshPresets();
      toast(`${holderName} removed from passengers`, { type: 'info', title: 'Passenger deleted' });
    } catch (err) {
      toast(err.message || 'Could not remove passenger', { type: 'error', title: 'Delete failed' });
    }
  }, [activePreset, refreshPresets]);

  const loadPreset = useCallback(async (id) => {
    setLoading(true); setError(null);
    try {
      const p = await apiPresetDetail(id);
      const full = presets.find((x) => x.id === id) || {};
      setActivePreset({ ...full, ...p });
      setDocumentImage(p.image_b64 || null);
      setLiveImage(p.live_passenger_b64 || null);
      setMrzText(p.mrz_raw || '');
      setUploadName(null); setResult(null); setRecordId(null); setGuidedBio(null);
      setStep(0);
    } catch (e) { setError(e.message || 'Failed to load scenario'); }
    finally { setLoading(false); }
  }, [presets]);

  const runScreening = useCallback(async (liveOverride) => {
    const doc = documentImage;
    const face = liveOverride ?? liveImage;
    if (!doc && !mrzText.trim()) { setError('Need a document or MRZ to screen.'); return; }
    setError(null); setLoading(true);
    try {
      const payload = { document_image_b64: doc, live_passenger_b64: face, mrz_text_raw: mrzText };
      const data = await apiScreenDocument(payload);
      const merged = guidedBio ? { ...data, biometrics: { ...data.biometrics, ...guidedBio } } : data;
      const rc = addToHistory(merged, { source: activePreset ? 'scenario' : 'live', scenario: activePreset?.title || uploadName || null });
      setResult(merged); setRecordId(rc.id); applyFocus();
      const tier = merged.risk_assessment?.risk_tier || 'LOW';
      toast(tier === 'LOW' ? 'Screen cleared' : `Review required — ${merged.risk_assessment?.overall_risk_score}% ${tier}`, { type: tier === 'LOW' ? 'success' : tier === 'CRITICAL' ? 'error' : 'warning', title: 'Screening complete' });
    } catch (e) { setError(e.message || 'Screening failed'); toast('Screening failed', { type: 'error', title: 'Screening error' }); }
    finally { setLoading(false); }
  }, [documentImage, liveImage, mrzText, activePreset, uploadName, applyFocus, guidedBio]);

  const handleGuidedVerify = useCallback((bio, frameB64) => {
    setGuidedBio(bio); setLiveImage(frameB64);
    setResult((prev) => prev ? { ...prev, biometrics: { ...prev.biometrics, ...bio } } : prev);
  }, []);

  const readDocFile = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDocumentImage(ev.target?.result); setUploadName(file.name);
      setActivePreset(null); setResult(null); setRecordId(null); setGuidedBio(null);
    };
    reader.readAsDataURL(file);
  };

  const takeAction = (status) => {
    if (recordId) updateRecordStatus(recordId, status);
    setOfficerStatus(status);
    if (status === 'approved') {
      confetti({ particleCount: 100, spread: 75, origin: { y: 0.6 } });
      toast('Entry granted for this individual.', { type: 'success', title: 'Entry Granted' });
    } else if (status === 'review') {
      toast('Redirected to secondary inspection.', { type: 'warning', title: 'Secondary Inspection' });
    } else {
      toast('Individual has been detained for further processing.', { type: 'error', title: 'Detained' });
    }
  };

  const resetWizard = () => {
    setResult(null); setRecordId(null); setOfficerStatus(null); setStep(0);
    setActivePreset(null); setDocumentImage(null); setLiveImage(null); setMrzText('');
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const granted = result?.risk_assessment?.recommended_decision?.toUpperCase().includes('GRANT');
  useEffect(() => {
    if (step === 4 && granted && !confettiFiredRef.current) { confettiFiredRef.current = true; confetti({ particleCount: 120, spread: 75, origin: { y: 0.25 } }); }
    if (!granted) confettiFiredRef.current = false;
  }, [step, granted]);

  return {
    step, setStep, presets, activePreset, setActivePreset, documentImage, setDocumentImage,
    liveImage, setLiveImage, mrzText, setMrzText, uploadName, setUploadName,
    result, setResult, recordId, officerStatus, loading, error, setError,
    showTechnical, setShowTechnical, showReport, setShowReport, showRegister, setShowRegister,
    showMrz, setShowMrz, docCamOn, setDocCamOn, dragOver, setDragOver,
    refreshPresets, applyFocus, deletePassenger, loadPreset, runScreening,
    handleGuidedVerify, readDocFile, takeAction, resetWizard, granted,
  };
}
