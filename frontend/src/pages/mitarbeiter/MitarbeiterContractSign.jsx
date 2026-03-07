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
                {showContract ? 'Vertrag ausblenden' : 'Vollständigen Vertrag anzeigen'}
              </button>
              
              {showContract && (
                <div className="mt-4 p-6 bg-slate-50 rounded-xl text-sm max-h-[500px] overflow-y-auto border border-slate-200">
                  {/* Contract Header */}
                  <div className="text-center mb-8 pb-4 border-b border-slate-300">
                    <h3 className="text-2xl font-bold text-[#0A0A0A] mb-2">ARBEITSVERTRAG</h3>
                    <p className="text-slate-600">für Angestellte und Mitarbeiter</p>
                  </div>
                  
                  <div className="space-y-6 text-slate-700">
                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-6 pb-4 border-b border-slate-200">
                      <div>
                        <p className="font-semibold text-[#0A0A0A] mb-1">Arbeitgeber:</p>
                        <p>Precision Labs</p>
                        <p>Große Fischerstr. 22</p>
                        <p>60311 Frankfurt am Main</p>
                        <p className="text-slate-500 mt-1">vertreten durch Tom Reiser</p>
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
                      <p>Der Arbeitnehmer wird bei Precision Labs im Homeoffice eingestellt und vor allem mit folgenden Aufgaben beschäftigt:</p>
                      <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                        <li>Überprüfung von Apps und Softwares auf Benutzerfreundlichkeit und Mängel</li>
                        <li>Video-Identifikationen zur Durchführung von Evaluierungen</li>
                        <li>Erstellung und Einreichung der dazugehörigen Abschlussberichte innerhalb des vorgegebenen Zeitrahmens</li>
                      </ul>
                    </div>

                    {/* §3 */}
                    <div>
                      <p className="font-bold text-[#0A0A0A]">§3 Arbeitszeit</p>
                      <p>Die regelmäßige Arbeitszeit beträgt ungefähr 10 Wochenstunden an 2 - 4 Tagen der Woche. Die genauen Arbeitszeiten sind in Absprache des Arbeitnehmers und des Arbeitgebers unter Berücksichtigung der betrieblichen Erfordernisse und der terminlichen Planung des Arbeitnehmers zu treffen.</p>
                    </div>

                    {/* §4 */}
                    <div>
                      <p className="font-bold text-[#0A0A0A]">§4 Vergütung</p>
                      <p>(1) Der Arbeitnehmer erhält eine Vergütung in Höhe von 25 - 70 € pro abgeschlossenem Auftrag, insgesamt maximal 603 EUR monatlich.</p>
                      <p className="mt-2">(2) Die Vergütung ist jeweils am Monatsende des Folgemonats fällig und wird per Überweisung an das vom Arbeitnehmer benannte Konto überwiesen.</p>
                      <p className="mt-2">(3) Der Arbeitnehmer ist darauf hingewiesen worden, dass er auf Antrag von der Rentenversicherungspflicht befreit werden kann. Der schriftliche Befreiungsantrag ist dem Arbeitgeber zu übergeben (§ 6 Abs. 1b Sozialgesetzbuch Sechstes Buch - SGB).</p>
                      <p className="mt-2">(4) Dem Arbeitnehmer ist bekannt, dass ein entsprechender Verzicht nur mit Wirkung für die Zukunft und bei Ausübung von mehreren geringfügigen Beschäftigungsverhältnissen nur einheitlich erklärt werden kann und diese Erklärung den Arbeitnehmer für die Dauer der Beschäftigungen bindet.</p>
                    </div>

                    {/* §5 */}
                    <div>
                      <p className="font-bold text-[#0A0A0A]">§5 Sonderzuwendungen</p>
                      <p>(1) Der Arbeitgeber zahlt Sonderzuwendungen (Urlaubsgeld, Weihnachtsgeld) in den Monaten Juni und Dezember in Höhe von jeweils 603€.</p>
                    </div>

                    {/* §6 */}
                    <div>
                      <p className="font-bold text-[#0A0A0A]">§6 Urlaubsanspruch</p>
                      <p>(1) Der Arbeitnehmer hat grundsätzlich einen Anspruch auf einen jährlichen Erholungsurlaub von 28 Arbeitstagen. Zeitpunkt und Dauer des Urlaubs richten sich nach den betrieblichen Notwendigkeiten und Möglichkeiten unter Berücksichtigung der Wünsche des Arbeitnehmers.</p>
                      <p className="mt-2">(2) Im Übrigen gelten ergänzend die Bestimmungen des Bundesurlaubsgesetzes in der jeweils geltenden Fassung.</p>
                    </div>

                    {/* §7 */}
                    <div>
                      <p className="font-bold text-[#0A0A0A]">§7 Arbeitsverhinderung</p>
                      <p>(1) Der Arbeitnehmer verpflichtet sich, jede Arbeitsverhinderung unverzüglich - noch vor Dienstbeginn - dem Arbeitgeber unter Benennung der voraussichtlichen Verhinderungsdauer schriftlich mitzuteilen.</p>
                      <p className="mt-2">(2) Im Krankheitsfall hat der Arbeitnehmer unverzüglich, spätestens jedoch nach Ablauf des dritten Kalendertages, dem Arbeitgeber eine ärztlich erstellte Arbeitsunfähigkeitsbescheinigung vorzulegen, aus der sich die voraussichtliche Dauer der Krankheit ergibt. Dauert die Krankheit länger an als in der ärztlich erstellten Bescheinigung angegeben, so ist der Arbeitnehmer gleichfalls zur unverzüglichen Mitteilung und Vorlage einer weiteren Bescheinigung verpflichtet.</p>
                      <p className="mt-2">(3) Der Arbeitgeber zahlt im Falle einer unverschuldeten Arbeitsunfähigkeit infolge Krankheit für sechs Wochen das regelmäßige Arbeitsentgelt weiter (Entgeltfortzahlung im Krankheitsfall).</p>
                      <p className="mt-2">(4) Im Übrigen gelten für den Krankheitsfall die jeweils maßgeblichen gesetzlichen Bestimmungen.</p>
                    </div>

                    {/* §8 */}
                    <div>
                      <p className="font-bold text-[#0A0A0A]">§8 Einstellungsfragebogen</p>
                      <p>Der als Anlage beigefügte Einstellungsfragebogen ist Bestandteil dieses Vertrages. Der Arbeitnehmer versichert die Vollständigkeit und Richtigkeit der gemachten Angaben.</p>
                    </div>

                    {/* §9 */}
                    <div>
                      <p className="font-bold text-[#0A0A0A]">§9 Weitere Beschäftigungen</p>
                      <p>Der Arbeitnehmer verpflichtet sich, jede Aufnahme einer weiteren Beschäftigung dem Arbeitgeber unverzüglich schriftlich mitzuteilen. Dies gilt für sämtliche Beschäftigungen, unabhängig von der Höhe des Verdienstes oder deren zeitlichem Umfang.</p>
                    </div>

                    {/* §10 */}
                    <div>
                      <p className="font-bold text-[#0A0A0A]">§10 Kündigungsfristen</p>
                      <p>(1) Das Arbeitsverhältnis wird auf unbestimmte Zeit eingegangen. Die ersten 6 Wochen gelten als Probezeit. Während dieser Zeit kann das Arbeitsverhältnis von beiden Seiten mit einer Frist von zwei Wochen (§ 622 Abs. 3 BGB) gekündigt werden.</p>
                      <p className="mt-2">(2) Nach Ablauf der Probezeit gelten die gesetzlichen Kündigungsfristen. Verlängert sich die Kündigungsfrist für die Firma aus tariflichen oder gesetzlichen Gründen, gilt diese Verlängerung auch für den Arbeitnehmer.</p>
                      <p className="mt-2">(3) Das Recht zur fristlosen Kündigung aus wichtigem Grund bleibt hiervon unberührt.</p>
                      <p className="mt-2">(4) Jede Kündigung hat schriftlich zu erfolgen.</p>
                      <p className="mt-2">(5) Der Arbeitgeber ist berechtigt, den Arbeitnehmer nach Ausspruch einer Kündigung unter Fortzahlung der Vergütung und Anrechnung auf Resturlaubsansprüche von der Arbeitsleistung freizustellen.</p>
                    </div>

                    {/* Signatures */}
                    <div className="pt-6 mt-6 border-t border-slate-300">
                      <p className="text-slate-600 mb-4">Frankfurt am Main, {new Date().toLocaleDateString('de-DE')}</p>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <div className="border-b border-slate-400 pb-1 mb-1"></div>
                          <p className="text-xs text-slate-500">Tom Reiser</p>
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
