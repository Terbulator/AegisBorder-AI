import { Shield } from 'lucide-react';
import CyberSuite from '../cyber/App';

export default function ThreatDefense() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
        <Shield className="h-4 w-4 text-blue-700" />
        <span>
          <strong>Add-on:</strong> RaKshak Threat Defense suite — integrated and fully functional, with its own navigation and bilingual interface.
        </span>
      </div>
      <CyberSuite />
    </div>
  );
}