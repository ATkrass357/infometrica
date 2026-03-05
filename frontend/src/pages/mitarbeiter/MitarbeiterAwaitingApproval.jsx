import React from 'react';
import { Clock, Shield, CheckCircle, Mail } from 'lucide-react';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/7bea0805-458a-46a4-83aa-a7ef43569440/images/31c2d350dad6978320d16680435185ac4d3ed1b7bc213f06a2774d3ee186a694.png";

const MitarbeiterAwaitingApproval = ({ applicant }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#E8F5E9] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <img src={LOGO_URL} alt="Precision Labs" className="h-14 mx-auto mb-6" />
        
        <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="text-[#00C853]" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-4">
          Verifizierung eingereicht
        </h1>
        
        <p className="text-slate-600 mb-8">
          Vielen Dank, <span className="font-semibold text-[#0A0A0A]">{applicant?.name || applicant?.full_name}</span>! 
          Ihre Ausweisdokumente wurden erfolgreich hochgeladen und werden von unserem Team geprüft.
        </p>

        <div className="bg-slate-50 rounded-xl p-6 text-left space-y-4">
          <h3 className="font-semibold text-[#0A0A0A] flex items-center gap-2">
            <Clock size={18} className="text-[#00C853]" />
            Nächste Schritte
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="text-[#00C853] flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">Vertrag unterschrieben</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="text-[#00C853] flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">Dokumente hochgeladen</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">Prüfung durch unser Team (in der Regel innerhalb von 24 Stunden)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-[18px] h-[18px] border-2 border-slate-300 rounded-full flex-shrink-0 mt-0.5" />
              <span className="text-slate-500">Freischaltung Ihres Mitarbeiter-Accounts</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700">
            <Shield className="inline mr-1" size={14} />
            Ihre Daten werden DSGVO-konform behandelt und nach der Prüfung gelöscht.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            <Mail className="inline mr-1" size={14} />
            Bei Fragen wenden Sie sich an <a href="mailto:hr@precision-labs.de" className="text-[#00C853] hover:underline">hr@precision-labs.de</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MitarbeiterAwaitingApproval;
