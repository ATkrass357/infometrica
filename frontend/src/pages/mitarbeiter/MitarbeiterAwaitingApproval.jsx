import React from 'react';
import { Clock, Shield, CheckCircle, Mail } from 'lucide-react';
import { Benke IT SolutionsLogo } from '../../components/Logo';

const MitarbeiterAwaitingApproval = ({ applicant }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <Benke IT SolutionsLogo className="w-16 h-16" />
        </div>
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="text-green-500" size={40} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Verifizierung eingereicht
        </h1>
        
        <p className="text-gray-600 mb-8">
          Vielen Dank, <span className="font-semibold text-gray-900">{applicant?.name}</span>! 
          Ihre Ausweisdokumente wurden erfolgreich hochgeladen und werden von unserem Team geprüft.
        </p>

        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock size={18} className="text-orange-500" />
            Nächste Schritte
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Dokumente hochgeladen</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Prüfung durch unser Team (in der Regel innerhalb von 24 Stunden)</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-[18px] h-[18px] border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5" />
              <span className="text-gray-500">Freischaltung Ihres Mitarbeiter-Accounts</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700">
            <Shield className="inline mr-1" size={14} />
            Ihre Daten werden DSGVO-konform behandelt und nach der Prüfung gelöscht.
          </p>
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

export default MitarbeiterAwaitingApproval;
