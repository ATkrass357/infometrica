import React, { useState, useRef } from 'react';
import { FileSignature, PenTool, RotateCcw, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { PrysmLogo } from '../../components/Logo';
import { ContractBody, CONTRACT_POSITIONS, CONTRACT_SUBTITLES, CONTRACT_TITLES } from './ContractTemplates';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MitarbeiterContractSign = ({ applicant, onContractSigned }) => {
  const [iban, setIban] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const signatureRef = useRef(null);

  const contractType = applicant?.contract_type || 'vollzeit';
  const positionLabel = CONTRACT_POSITIONS[contractType] || CONTRACT_POSITIONS.vollzeit;
  const contractSubtitle = CONTRACT_SUBTITLES[contractType] || CONTRACT_SUBTITLES.vollzeit;
  const contractTitle = CONTRACT_TITLES[contractType] || CONTRACT_TITLES.vollzeit;
  const signedDate = new Date().toLocaleDateString('de-DE');

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
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] via-white to-[#E0F2FE] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <PrysmLogo className="h-14 w-14 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">Arbeitsvertrag unterschreiben</h1>
          <p className="text-slate-600">
            Willkommen, {applicant?.full_name || applicant?.name}! Bitte unterschreiben Sie Ihren Arbeitsvertrag.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-sm font-bold">
              <CheckCircle size={16} />
            </div>
            <span className="text-sm text-[#0EA5E9] font-medium">Bewerbung akzeptiert</span>
          </div>
          <div className="w-8 h-px bg-[#0EA5E9]"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-sm font-bold">2</div>
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
              <div className="w-14 h-14 rounded-xl bg-[#0EA5E9] flex items-center justify-center">
                <FileSignature size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Arbeitsvertrag</h2>
                <p className="text-slate-400">Prysm Technologies · {positionLabel}</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Contract - always visible */}
            <div className="p-6 bg-slate-50 rounded-xl text-sm border border-slate-200">
              {/* Contract Header */}
              <div className="text-center mb-8 pb-4 border-b border-slate-300">
                <h3 className="text-2xl font-bold text-[#0A0A0A] mb-2">{contractTitle}</h3>
                <p className="text-slate-600">{contractSubtitle}</p>
              </div>
              
              <div className="space-y-6 text-slate-700">
                {/* Parties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 border-b border-slate-200">
                  <div>
                    <p className="font-semibold text-[#0A0A0A] mb-1">Arbeitgeber:</p>
                    <p>Prysm Technologies GmbH</p>
                    <p>Große Gallusstr. 14</p>
                    <p>60315 Frankfurt am Main</p>
                    <p className="text-slate-500 mt-1">vertreten durch Lars Kurjo</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A0A0A] mb-1">Arbeitnehmer:</p>
                    <p>{applicant?.full_name || applicant?.name}</p>
                    <p>{applicant?.address || 'Adresse wird ergänzt'}</p>
                  </div>
                </div>

                <p className="italic text-slate-600">Dieser Vertrag wird zwischen den oben genannten Parteien geschlossen und beinhaltet die nachfolgenden Vereinbarungen:</p>

                <ContractBody type={contractType} signedDate={signedDate} />

                {/* Signatures */}
                <div className="pt-6 mt-6 border-t border-slate-300">
                  <p className="text-slate-600 mb-4">Frankfurt am Main, {signedDate}</p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="border-b border-slate-400 pb-1 mb-1"></div>
                      <p className="text-xs text-slate-500">Lars Kurjo</p>
                      <p className="text-xs text-slate-500">Arbeitgeber</p>
                    </div>
                    <div>
                      <div className="border-b border-slate-400 pb-1 mb-1"></div>
                      <p className="text-xs text-slate-500">{applicant?.full_name || applicant?.name}</p>
                      <p className="text-xs text-slate-500">Arbeitnehmer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IBAN Input */}
            <div>
              <Label className="text-[#0A0A0A] font-semibold flex items-center gap-2 mb-2">
                <CreditCard size={18} className="text-[#0EA5E9]" />
                IBAN für Gehaltszahlung
              </Label>
              <Input
                type="text"
                value={iban}
                onChange={handleIBANChange}
                placeholder=""
                className="h-12 text-lg font-mono tracking-wider border-slate-200 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]"
                data-testid="contract-iban-input"
              />
              <p className="text-xs text-slate-500 mt-2">Die Vergütung wird auf dieses Konto überwiesen.</p>
            </div>

            {/* Signature */}
            <div>
              <Label className="text-[#0A0A0A] font-semibold flex items-center gap-2 mb-2">
                <PenTool size={18} className="text-[#0EA5E9]" />
                Ihre Unterschrift
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white hover:border-[#0EA5E9] transition-colors">
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
                className="mt-2 text-sm text-slate-500 hover:text-[#0EA5E9] flex items-center gap-1"
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
              className="w-full h-14 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-lg font-semibold rounded-xl"
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
          © 2026 Prysm Technologies. Alle Rechte vorbehalten.
        </p>
      </div>
    </div>
  );
};

export default MitarbeiterContractSign;
