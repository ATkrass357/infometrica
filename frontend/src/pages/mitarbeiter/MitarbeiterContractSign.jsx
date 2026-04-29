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
                <h2 className="text-xl font-bold">Arbeitsvertrag</h2>
                <p className="text-slate-400">Precision Labs · Mitarbeiter in der Verifikations Testung</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Contract - always visible */}
            <div className="p-6 bg-slate-50 rounded-xl text-sm border border-slate-200">
              {/* Contract Header */}
              <div className="text-center mb-8 pb-4 border-b border-slate-300">
                <h3 className="text-2xl font-bold text-[#0A0A0A] mb-2">ARBEITSVERTRAG</h3>
                <p className="text-slate-600">für Angestellte und Mitarbeiter</p>
              </div>
              
              <div className="space-y-6 text-slate-700">
                {/* Parties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 border-b border-slate-200">
                  <div>
                    <p className="font-semibold text-[#0A0A0A] mb-1">Arbeitgeber:</p>
                    <p>Precision Labs</p>
                    <p>Römerstraße 90</p>
                    <p>79618 Rheinfelden (Baden)</p>
                    <p className="text-slate-500 mt-1">vertreten durch Daniel Bärtschi</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A0A0A] mb-1">Arbeitnehmer:</p>
                    <p>{applicant?.full_name || applicant?.name}</p>
                    <p>{applicant?.address || 'Adresse wird ergänzt'}</p>
                  </div>
                </div>

                <p className="italic text-slate-600">Dieser Vertrag wird zwischen den oben genannten Parteien geschlossen und beinhaltet die nachfolgenden Vereinbarungen:</p>
                
                {/* §1 */}
                <div>
                  <p className="font-bold text-[#0A0A0A]">§1 Beginn des Arbeitsverhältnisses</p>
                  <p>Dieses Arbeitsverhältnis beginnt nach der Unterschrift beider Seiten.</p>
                </div>

                {/* §2 */}
                <div>
                  <p className="font-bold text-[#0A0A0A]">§2 Tätigkeit</p>
                  <p>Der Arbeitnehmer wird bei Precision Labs als <strong>Mitarbeiter in der Verifikations Testung</strong> im Homeoffice eingestellt und vor allem mit folgenden Aufgaben beschäftigt:</p>
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                    <li>Durchführung von Video-Identifikationsverfahren zur Evaluierung und Testung</li>
                    <li>Überprüfung von Apps und Softwares auf Benutzerfreundlichkeit und Mängel</li>
                    <li>Erstellung und Einreichung der dazugehörigen Abschlussberichte innerhalb des vorgegebenen Zeitrahmens</li>
                  </ul>
                </div>

                {/* §3 */}
                <div>
                  <p className="font-bold text-[#0A0A0A]">§3 Arbeitszeit</p>
                  <p>(1) Während des Testmonats (erster Monat) beträgt die regelmäßige Arbeitszeit ca. 15 Wochenstunden.</p>
                  <p className="mt-2">(2) Nach Abschluss des Testmonats beträgt die regelmäßige Arbeitszeit ca. 40 Wochenstunden an 5 Tagen der Woche. Die genauen Arbeitszeiten sind in Absprache des Arbeitnehmers und des Arbeitgebers unter Berücksichtigung der betrieblichen Erfordernisse zu treffen.</p>
                </div>

                {/* §4 */}
                <div>
                  <p className="font-bold text-[#0A0A0A]">§4 Vergütung</p>
                  <p>(1) <strong>Testmonat (erster Monat):</strong> Der Arbeitnehmer erhält eine monatliche Vergütung in Höhe von 1.200,00 € brutto. Der erste Monat dient als Testmonat zur gegenseitigen Eignungsprüfung.</p>
                  <p className="mt-2">(2) <strong>Ab dem zweiten Monat:</strong> Nach erfolgreichem Abschluss des Testmonats erhält der Arbeitnehmer eine monatliche Vergütung in Höhe von 2.900,00 € brutto.</p>
                  <p className="mt-2">(3) Die Vergütung ist jeweils am Monatsende fällig und wird per Überweisung an das vom Arbeitnehmer benannte Konto überwiesen.</p>
                </div>

                {/* §5 */}
                <div>
                  <p className="font-bold text-[#0A0A0A]">§5 Testmonat</p>
                  <p>(1) Der erste Monat des Arbeitsverhältnisses gilt als Testmonat. In diesem Zeitraum arbeitet der Arbeitnehmer ca. 15 Stunden pro Woche.</p>
                  <p className="mt-2">(2) Nach erfolgreichem Abschluss des Testmonats beginnt das reguläre Arbeitsverhältnis mit der in §4 Abs. 2 genannten Vergütung.</p>
                  <p className="mt-2">(3) Während des Testmonats kann das Arbeitsverhältnis von beiden Seiten mit einer Frist von einer Woche gekündigt werden.</p>
                </div>

                {/* §6 */}
                <div>
                  <p className="font-bold text-[#0A0A0A]">§6 Urlaubsanspruch</p>
                  <p>(1) Der Arbeitnehmer hat einen Anspruch auf einen jährlichen Erholungsurlaub von 28 Arbeitstagen.</p>
                  <p className="mt-2">(2) Im Übrigen gelten ergänzend die Bestimmungen des Bundesurlaubsgesetzes.</p>
                </div>

                {/* §7 */}
                <div>
                  <p className="font-bold text-[#0A0A0A]">§7 Arbeitsverhinderung</p>
                  <p>(1) Der Arbeitnehmer verpflichtet sich, jede Arbeitsverhinderung unverzüglich dem Arbeitgeber mitzuteilen.</p>
                  <p className="mt-2">(2) Im Krankheitsfall hat der Arbeitnehmer spätestens nach Ablauf des dritten Kalendertages eine ärztliche Arbeitsunfähigkeitsbescheinigung vorzulegen.</p>
                </div>

                {/* §8 */}
                <div>
                  <p className="font-bold text-[#0A0A0A]">§8 Kündigungsfristen</p>
                  <p>(1) Nach Ablauf des Testmonats gelten die gesetzlichen Kündigungsfristen.</p>
                  <p className="mt-2">(2) Jede Kündigung hat schriftlich zu erfolgen.</p>
                  <p className="mt-2">(3) Das Recht zur fristlosen Kündigung aus wichtigem Grund bleibt hiervon unberührt.</p>
                </div>

                {/* Signatures */}
                <div className="pt-6 mt-6 border-t border-slate-300">
                  <p className="text-slate-600 mb-4">Rheinfelden (Baden), {new Date().toLocaleDateString('de-DE')}</p>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="border-b border-slate-400 pb-1 mb-1"></div>
                      <p className="text-xs text-slate-500">Daniel Bärtschi</p>
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
