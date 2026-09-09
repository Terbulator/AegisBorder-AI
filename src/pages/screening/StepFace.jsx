import { Camera } from 'lucide-react';
import { Card, Button, cx } from '../../components/ui';
import { FadeIn } from '../../components/motion';
import CameraCapture from '../../components/CameraCapture';

export default function StepFace({ result, documentImage, liveImage, setLiveImage, runScreening }) {
  const bio = result?.biometrics || {};
  const forensics = result?.forensics?.summary || {};

  if (!result) {
    return (
      <FadeIn y={10}>
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-extrabold text-white">3</div>
            <div><h2 className="text-sm font-bold text-slate-900">Face analysis</h2><p className="text-xs text-slate-500">Biometric comparison of document portrait vs passenger.</p></div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-400">Run the screening to compare faces.</div>
        </Card>
      </FadeIn>
    );
  }

  return (
    <FadeIn y={10}>
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-sm font-extrabold text-white">3</div>
          <div><h2 className="text-sm font-bold text-slate-900">Face analysis</h2><p className="text-xs text-slate-500">One-to-one biometric comparison of the document portrait against the passenger.</p></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-xs font-bold text-slate-500">Document portrait</p>
            <div className="flex min-h-[160px] items-center justify-center rounded-lg bg-slate-50">
              {forensics?.visuals?.original || documentImage ? (
                <img src={forensics?.visuals?.original || documentImage} alt="Document portrait" className="max-h-[160px] rounded object-contain" />
              ) : <p className="text-sm text-slate-400">No document image</p>}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-xs font-bold text-slate-500">Passenger</p>
            <div className="flex min-h-[160px] items-center justify-center rounded-lg bg-slate-50">
              {liveImage ? (
                <img src={liveImage} alt="Passenger face" className="max-h-[160px] rounded object-contain" />
              ) : <p className="text-sm text-slate-400">No capture provided</p>}
            </div>
          </div>
        </div>

        {bio.biometric_available === false && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Biometric verification NOT AVAILABLE.</strong> No live passenger capture was provided.
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 px-4 py-3">
            <div className="text-xs font-semibold text-slate-500">Match score</div>
            <div className={cx('text-xl font-extrabold', bio.biometric_available === false && 'text-slate-400')}>
              {bio.biometric_available !== false ? (bio.match_score != null ? `${bio.match_score}%` : 'No comparison') : 'Not available'}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 px-4 py-3">
            <div className="text-xs font-semibold text-slate-500">Liveness</div>
            <div className={cx('text-xl font-extrabold', bio.biometric_available === false && 'text-slate-400')}>
              {bio.biometric_available !== false ? (bio.liveness ? (bio.liveness.is_live ? 'Live' : 'Failed') : 'No capture') : 'Not available'}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 px-4 py-3">
            <div className="text-xs font-semibold text-slate-500">Confidence</div>
            <div className={cx('text-xl font-extrabold', bio.biometric_available === false && 'text-slate-400')}>
              {bio.biometric_available !== false ? (bio.confidence != null ? bio.confidence : '—') : 'Not available'}
            </div>
          </div>
        </div>

        {bio.biometric_available !== false && bio.liveness && (
          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 text-xs font-bold text-slate-600">Anti-spoofing & presentation attack defense</div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-xs">
                <span className="text-slate-500">Liveness score</span>
                <span className="font-bold text-slate-800">{bio.liveness.liveness_score != null ? `${bio.liveness.liveness_score}%` : '—'}</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-xs">
                <span className="text-slate-500">Screen moiré</span>
                <span className={bio.liveness.moire_artifact_detected ? 'font-bold text-red-600' : 'font-bold text-emerald-600'}>
                  {bio.liveness.moire_artifact_detected ? 'Detected' : 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-xs">
                <span className="text-slate-500">Sharpness index</span>
                <span className="font-bold text-slate-800">{bio.liveness.sharpness_index ?? '—'}</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </FadeIn>
  );
}
