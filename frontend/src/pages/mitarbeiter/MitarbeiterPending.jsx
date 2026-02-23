import React from 'react';
import { Clock, Mail, FileText, CheckCircle } from 'lucide-react';
import { Benke IT SolutionsLogo } from '../../components/Logo';

const MitarbeiterPending = ({ applicant }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <Benke IT SolutionsLogo className="w-16 h-16" />
        </div>
        
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="text-orange-500" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Bewerbung wird geprüft
        </h1>
        
        <p className="text-gray-600 mb-8">
          Vielen Dank für Ihre Bewerbung, <span className="font-semibold text-gray-900">{applicant?.name}</span>! 
          Unser Team prüft derzeit Ihre Unterlagen. Sie werden benachrichtigt, sobald Ihre Bewerbung 
          bearbeitet wurde.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-orange-500" />
            Ihre Bewerbungsdetails
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Position:</span>
              <span className="text-gray-900 font-medium">{applicant?.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">E-Mail:</span>
              <span className="text-gray-900">{applicant?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                In Prüfung
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            <Mail className="inline mr-1" size={14} />
            Bei Fragen wenden Sie sich an <a href="mailto:hr@infometrica.de" className="text-orange-500 hover:underline">hr@infometrica.de</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MitarbeiterPending;
