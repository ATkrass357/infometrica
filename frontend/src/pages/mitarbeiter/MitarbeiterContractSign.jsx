import React, { useState, useRef } from 'react';
import { FileSignature, PenTool, RotateCcw, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/7bea0805-458a-46a4-83aa-a7ef43569440/images/31c2d350dad6978320d16680435185ac4d3ed1b7bc213f06a2774d3ee186a694.png";

const MitarbeiterContractSign = ({ applicant, onContractSigned }) => {
  const [iban, setIban] = useState('');
  const [showContract, setShowContract] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const signatureRef = useRef(null);

  const formatIBAN = (value) => {
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    return formatted.slice(0, 27);
  };

  const handleIBANChange = (e) => {
    setIban(formatIBAN(e.target.value));
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const handleSign = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      toast.error('Bitte unterschreiben Sie den Vertrag');
      return;
    }

    const ibanClean = iban.replace(/\s/g, '');
    if (!ibanClean || ibanClean.length < 15) {
      toast.error('Bitte geben Sie eine gültige IBAN ein');
      return;
    }

    setIsSigning(true);

    try {
      const token = localStorage.getItem('employee_token');
      const signatureData = signatureRef.current.toDataURL('image/png');

      await axios.post(
        `${BACKEND_URL}/api/applications/sign-contract`,
        {
          signature_data: signatureData,
          iban: ibanClean,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Vertrag erfolgreich unterschrieben!');
      onContractSigned();
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error(error.response?.data?.detail || 'Fehler beim Unterschreiben des Vertrags');
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDF4] via-white to-[#E8F5E9] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="Precision Labs" className="h-16 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Arbeitsvertrag unterschreiben</h1>
          <p className="text-slate-600">
            Willkommen, {applicant?.full_name || applicant?.name}! Bitte unterschreiben Sie Ihren Arbeitsvertrag.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00C853] text-white flex items-center justify-center text-sm font-bold">
              <CheckCircle size={16} />
            </div>
            <span className="text-sm text-[#00C853] font-medium">Bewerbung akzeptiert</span>
          </div>
          <div className="w-8 h-px bg-[#00C853]"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00C853] text-white flex items-center justify-center text-sm font-bold">2</div>
            <span className="text-sm text-[#0A0A0A] font-medium">Vertrag unterschreiben</span>
          </div>
          <div className="w-8 h-px bg-slate-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold">3</div>
            <span className="text-sm text-slate-500">ID-Verifizierung</span>
          </div>
        </div>

        {/* Contract Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Contract Header */}
          <div className="bg-[#0A0A0A] text-white p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#00C853] flex items-center justify-center">
                <FileSignature size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Minijob Arbeitsvertrag</h2>
                <p className="text-slate-400">Precision Labs · Assistent für Evaluierungen</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Contract Preview */}
            <div>
              <button
                onClick={() => setShowContract(!showContract)}
                className="text-[#00C853] font-semibold hover:underline flex items-center gap-2"
              >
                {showContract ? 'Vertrag ausblenden' : 'Vertrag anzeigen'}
              </button>
              
              {showContract && (
                <div className="mt-4 p-6 bg-slate-50 rounded-xl text-sm max-h-96 overflow-y-auto">
                  <div className="text-center mb-6 pb-4 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-[#0A0A0A]">ARBEITSVERTRAG</h3>
                    <p className="text-slate-600">(Minijob – geringfügige Beschäftigung)</p>
                  </div>
                  
                  <div className="space-y-4 text-slate-700">
                    <p><strong>zwischen</strong></p>
                    <p>Precision Labs<br />Placeholder Straße, Placeholder Stadt<br /><em>– nachfolgend „Arbeitgeber" genannt –</em></p>
                    
                    <p><strong>und</strong></p>
                    <p>{applicant?.full_name || applicant?.name}<br /><em>– nachfolgend „Arbeitnehmer" genannt –</em></p>
                    
                    <p className="font-semibold mt-4">§2 Tätigkeit</p>
                    <p>Der Arbeitnehmer wird als Assistent für Evaluierungen im Homeoffice eingestellt.</p>
                    
                    <p className="font-semibold mt-4">§3 Arbeitszeit</p>
                    <p>Die regelmäßige Arbeitszeit beträgt etwa 10 Wochenstunden, verteilt auf 2 bis 4 Tage pro Woche.</p>
                    
                    <p className="font-semibold mt-4">§4 Vergütung</p>
                    <p>Der Arbeitnehmer erhält eine Vergütung in Höhe von maximal 603,00 EUR monatlich.</p>
                    
                    <p className="font-semibold mt-4">§5 Urlaub</p>
                    <p>Der Arbeitnehmer hat Anspruch auf 28 Arbeitstage Urlaub pro Kalenderjahr.</p>
                    
                    <p className="font-semibold mt-4">§8 Sonderzahlungen</p>
                    <p>Der Arbeitnehmer erhält in den Monaten Juni und Dezember jeweils eine Sonderzahlung in Höhe von 603,00 EUR.</p>
                  </div>
                </div>
              )}
            </div>

            {/* IBAN Input */}
            <div>
              <Label className="text-[#0A0A0A] font-semibold flex items-center gap-2 mb-2">
                <CreditCard size={18} className="text-[#00C853]" />
                IBAN für Gehaltszahlung
              </Label>
              <Input
                type="text"
                value={iban}
                onChange={handleIBANChange}
                placeholder=""
                className="h-12 text-lg font-mono tracking-wider border-slate-200 focus:border-[#00C853] focus:ring-[#00C853]"
                data-testid="contract-iban-input"
              />
              <p className="text-xs text-slate-500 mt-2">Die Vergütung wird auf dieses Konto überwiesen.</p>
            </div>

            {/* Signature */}
            <div>
              <Label className="text-[#0A0A0A] font-semibold flex items-center gap-2 mb-2">
                <PenTool size={18} className="text-[#00C853]" />
                Ihre Unterschrift
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white hover:border-[#00C853] transition-colors">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-40 cursor-crosshair',
                  }}
                  backgroundColor="white"
                />
              </div>
              <button
                onClick={clearSignature}
                className="mt-2 text-sm text-slate-500 hover:text-[#00C853] flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Unterschrift löschen
              </button>
            </div>

            {/* Legal Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Rechtlicher Hinweis</p>
                <p>Mit Ihrer Unterschrift bestätigen Sie, dass Sie den Arbeitsvertrag gelesen und verstanden haben und diesem zustimmen.</p>
              </div>
            </div>

            {/* Sign Button */}
            <Button
              onClick={handleSign}
              disabled={isSigning}
              className="w-full h-14 bg-[#00C853] hover:bg-[#009624] text-white text-lg font-semibold rounded-xl"
              data-testid="sign-contract-btn"
            >
              {isSigning ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Wird unterschrieben...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FileSignature size={20} />
                  Vertrag verbindlich unterschreiben
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          © 2026 Precision Labs. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  );
};

export default MitarbeiterContractSign;
