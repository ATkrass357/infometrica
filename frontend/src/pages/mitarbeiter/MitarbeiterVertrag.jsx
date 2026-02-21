import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { 
  FileText, 
  PenTool, 
  Download, 
  CheckCircle, 
  Clock, 
  RotateCcw,
  AlertTriangle,
  FileSignature,
  Calendar,
  Euro,
  Briefcase,
  X,
  CreditCard,
  ScrollText,
  ChevronDown
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Contract text component
const ContractDocument = ({ contract }) => {
  const today = new Date().toLocaleDateString('de-DE');
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm leading-relaxed">
      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">ARBEITSVERTRAG</h2>
        <p className="text-gray-600">Infometrica GmbH - App Testing Agency</p>
      </div>

      {/* Parties */}
      <div className="mb-6">
        <p className="font-semibold text-gray-900 mb-2">Zwischen</p>
        <p className="text-gray-700 mb-1">Infometrica GmbH</p>
        <p className="text-gray-700 mb-1">Teststraße 123, 10115 Berlin</p>
        <p className="text-gray-600 italic mb-4">- nachfolgend "Arbeitgeber" genannt -</p>
        
        <p className="font-semibold text-gray-900 mb-2">und</p>
        <p className="text-gray-700 mb-1">{contract.employee_name}</p>
        <p className="text-gray-700 mb-1">E-Mail: {contract.employee_email}</p>
        <p className="text-gray-600 italic mb-4">- nachfolgend "Arbeitnehmer" genannt -</p>
        
        <p className="text-gray-700">wird folgender Arbeitsvertrag geschlossen:</p>
      </div>

      {/* Contract Terms */}
      <div className="space-y-6">
        <section>
          <h3 className="font-bold text-gray-900 mb-2">§1 Beginn und Tätigkeit</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Das Arbeitsverhältnis beginnt am <strong>{contract.start_date}</strong>.</li>
            <li>Der Arbeitnehmer wird als <strong>{contract.position}</strong> eingestellt.</li>
            <li>Der Arbeitsort ist Berlin mit Möglichkeit zum Home-Office.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§2 Arbeitszeit</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Die regelmäßige wöchentliche Arbeitszeit beträgt <strong>{contract.working_hours} Stunden</strong>.</li>
            <li>Die Verteilung der Arbeitszeit erfolgt nach betrieblichen Erfordernissen.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§3 Vergütung</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Der Arbeitnehmer erhält ein monatliches Bruttogehalt von <strong>{contract.salary} EUR</strong>.</li>
            <li>Die Zahlung erfolgt jeweils zum Monatsende.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§4 Bankverbindung</h3>
          <p className="text-gray-700">
            Die Vergütung wird auf das vom Arbeitnehmer angegebene Bankkonto überwiesen. 
            Die IBAN wird bei der Vertragsunterzeichnung angegeben.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§5 Urlaub</h3>
          <p className="text-gray-700">
            Der Arbeitnehmer hat Anspruch auf <strong>30 Arbeitstage</strong> bezahlten Urlaub pro Jahr.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§6 Kündigung</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Die Kündigungsfrist beträgt während der Probezeit 2 Wochen.</li>
            <li>Nach der Probezeit gelten die gesetzlichen Kündigungsfristen.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§7 Probezeit</h3>
          <p className="text-gray-700">
            Die ersten <strong>6 Monate</strong> gelten als Probezeit.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§8 Verschwiegenheitspflicht</h3>
          <p className="text-gray-700">
            Der Arbeitnehmer verpflichtet sich, über alle betrieblichen Angelegenheiten, 
            insbesondere Geschäfts- und Betriebsgeheimnisse, Stillschweigen zu bewahren. 
            Diese Verpflichtung besteht auch nach Beendigung des Arbeitsverhältnisses fort.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§9 Nebentätigkeit</h3>
          <p className="text-gray-700">
            Jede Nebentätigkeit bedarf der vorherigen schriftlichen Zustimmung des Arbeitgebers. 
            Die Zustimmung ist zu erteilen, wenn die Nebentätigkeit die Arbeitsleistung nicht beeinträchtigt.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-900 mb-2">§10 Schlussbestimmungen</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Änderungen und Ergänzungen dieses Vertrages bedürfen der Schriftform.</li>
            <li>Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein, so wird dadurch die Wirksamkeit der übrigen Bestimmungen nicht berührt.</li>
            <li>Es gilt das Recht der Bundesrepublik Deutschland.</li>
          </ul>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-center">
          Berlin, den {today}
        </p>
      </div>
    </div>
  );
};

const MitarbeiterVertrag = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);
  const [signing, setSigning] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [iban, setIban] = useState('');
  const sigCanvas = useRef(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const token = localStorage.getItem('employee_token');
      const response = await axios.get(`${BACKEND_URL}/api/contracts/my-contracts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContracts(response.data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
      // If no contracts endpoint, show empty state
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
      toast.error('Bitte unterschreiben Sie im Zeichenfeld');
      return;
    }

    // Validate IBAN
    const cleanIban = iban.replace(/\s/g, '');
    if (!cleanIban || cleanIban.length < 15 || cleanIban.length > 34) {
      toast.error('Bitte geben Sie eine gültige IBAN ein');
      return;
    }

    setSigning(true);

    try {
      const token = localStorage.getItem('employee_token');
      const signatureData = sigCanvas.current.toDataURL('image/png');

      await axios.post(
        `${BACKEND_URL}/api/contracts/${selectedContract.id}/sign`,
        { 
          signature_data: signatureData,
          iban: cleanIban
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Vertrag erfolgreich unterschrieben!');
      setShowSignModal(false);
      setSelectedContract(null);
      setIban('');
      fetchContracts();
    } catch (error) {
      console.error('Error signing contract:', error);
      toast.error(error.response?.data?.detail || 'Fehler beim Unterschreiben des Vertrags');
    } finally {
      setSigning(false);
    }
  };

  const handleDownload = async (contract) => {
    try {
      const token = localStorage.getItem('employee_token');
      const response = await axios.get(
        `${BACKEND_URL}/api/contracts/${contract.id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Arbeitsvertrag_${contract.employee_name.replace(' ', '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF heruntergeladen');
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Fehler beim Herunterladen');
    }
  };

  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'signed') {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle size={14} />
          Unterschrieben
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
        <Clock size={14} />
        Ausstehend
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="employee-contract-page">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Arbeitsvertrag</h1>
        <p className="text-gray-600 mt-1">Ihre Verträge und Dokumente zum Unterschreiben</p>
      </div>

      {/* Contracts List */}
      {contracts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileSignature size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Verträge</h3>
          <p className="text-gray-500">
            Sobald Ihr Arbeitsvertrag erstellt wurde, erscheint er hier zur Unterschrift.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              data-testid={`contract-card-${contract.id}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="text-orange-500" size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">Arbeitsvertrag</h3>
                      {getStatusBadge(contract.status)}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase size={16} className="text-gray-400" />
                        <span>{contract.position}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span>Start: {contract.start_date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Euro size={16} className="text-gray-400" />
                        <span>{contract.salary} €/Monat</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={16} className="text-gray-400" />
                        <span>{contract.working_hours}h/Woche</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {contract.status === 'pending' ? (
                    <Button
                      onClick={() => {
                        setSelectedContract(contract);
                        setShowSignModal(true);
                      }}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <PenTool size={18} className="mr-2" />
                      Jetzt unterschreiben
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleDownload(contract)}
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                    >
                      <Download size={18} className="mr-2" />
                      PDF herunterladen
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-blue-800">Wichtige Hinweise</h3>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• Lesen Sie den Vertrag sorgfältig durch bevor Sie unterschreiben</li>
              <li>• Ihre digitale Unterschrift ist rechtlich bindend</li>
              <li>• Nach der Unterschrift können Sie den Vertrag als PDF herunterladen</li>
              <li>• Bei Fragen wenden Sie sich an hr@infometrica.de</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignModal && selectedContract && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSignModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Vertrag unterschreiben</h2>
                <p className="text-sm text-gray-500 mt-1">Arbeitsvertrag als {selectedContract.position}</p>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Contract Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Vertragsdetails</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Position:</span>
                    <span className="ml-2 text-gray-900 font-medium">{selectedContract.position}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Startdatum:</span>
                    <span className="ml-2 text-gray-900 font-medium">{selectedContract.start_date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Gehalt:</span>
                    <span className="ml-2 text-gray-900 font-medium">{selectedContract.salary} € brutto/Monat</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Arbeitszeit:</span>
                    <span className="ml-2 text-gray-900 font-medium">{selectedContract.working_hours} Stunden/Woche</span>
                  </div>
                </div>
              </div>

              {/* IBAN Input */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard size={18} className="text-gray-500" />
                  <Label htmlFor="iban" className="font-semibold text-gray-900">
                    Bankverbindung für Gehaltszahlung *
                  </Label>
                </div>
                <Input
                  id="iban"
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value.toUpperCase())}
                  placeholder="DE00 0000 0000 0000 0000 00"
                  className="h-12 font-mono text-lg"
                  data-testid="iban-input"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Ihre IBAN wird im Arbeitsvertrag gespeichert und für die Gehaltszahlung verwendet.
                </p>
              </div>

              {/* Signature Area */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-semibold text-gray-900">
                    Ihre Unterschrift
                  </label>
                  <button
                    onClick={clearSignature}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <RotateCcw size={14} />
                    Löschen
                  </button>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white">
                  <SignatureCanvas
                    ref={sigCanvas}
                    canvasProps={{
                      className: 'w-full h-48 rounded-xl',
                      style: { width: '100%', height: '200px' }
                    }}
                    backgroundColor="white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Zeichnen Sie Ihre Unterschrift mit der Maus oder dem Finger
                </p>
              </div>

              {/* Legal Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800">
                  <strong>Rechtlicher Hinweis:</strong> Mit dem Klick auf "Vertrag unterschreiben" 
                  bestätigen Sie, dass Sie den Vertrag gelesen haben und mit allen Bedingungen einverstanden sind. 
                  Diese digitale Unterschrift ist rechtlich bindend.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSignModal(false)}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSign}
                disabled={signing}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {signing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Wird unterschrieben...
                  </>
                ) : (
                  <>
                    <PenTool size={18} className="mr-2" />
                    Vertrag unterschreiben
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MitarbeiterVertrag;
