import React from 'react';
import { Clock, Mail, FileText } from 'lucide-react';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/7bea0805-458a-46a4-83aa-a7ef43569440/images/31c2d350dad6978320d16680435185ac4d3ed1b7bc213f06a2774d3ee186a694.png";

const MitarbeiterPending = ({ applicant }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#E8F5E9] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8 text-center">
        <img src={LOGO_URL} alt="Precision Labs" className="h-14 mx-auto mb-6" />
        
        <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="text-[#00C853]" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-[#0A0A0A] mb-4">
          Bewerbung wird geprüft
        </h1>
        
        <p className="text-slate-600 mb-8">
          Vielen Dank für Ihre Bewerbung, <span className="font-semibold text-[#0A0A0A]">{applicant?.name || applicant?.full_name}</span>! 
          Unser Team prüft derzeit Ihre Unterlagen. Sie werden benachrichtigt, sobald Ihre Bewerbung 
          bearbeitet wurde.
        </p>

        <div className="bg-slate-50 rounded-xl p-6 text-left space-y-4">
          <h3 className="font-semibold text-[#0A0A0A] flex items-center gap-2">
            <FileText size={18} className="text-[#00C853]" />
            Ihre Bewerbungsdetails
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Position:</span>
              <span className="text-[#0A0A0A] font-medium">{applicant?.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">E-Mail:</span>
              <span className="text-[#0A0A0A]">{applicant?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="px-2 py-1 bg-[#F0FDF4] text-[#00C853] rounded-full text-xs font-medium">
                In Prüfung
              </span>
            </div>
          </div>
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

export default MitarbeiterPending;
