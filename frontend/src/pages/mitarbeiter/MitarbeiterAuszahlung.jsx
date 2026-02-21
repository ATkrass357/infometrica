import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  FileText,
  Euro,
  Building,
  RefreshCw
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';

const MitarbeiterAuszahlung = () => {
  const [loading, setLoading] = useState(true);
  const [savingBank, setSavingBank] = useState(false);
  const [payoutData, setPayoutData] = useState({
    currentBalance: 1250.00,
    pendingPayout: 350.00,
    lastPayout: 900.00,
    lastPayoutDate: '2024-02-01'
  });
  
  const [bankDetails, setBankDetails] = useState({
    iban: 'DE89 3704 0044 0532 0130 00',
    bic: 'COBADEFFXXX',
    bankName: 'Commerzbank',
    accountHolder: ''
  });

  const [payoutHistory, setPayoutHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employeeData = JSON.parse(localStorage.getItem('employee_data') || '{}');
    setBankDetails(prev => ({
      ...prev,
      accountHolder: employeeData.name || 'Max Mitarbeiter'
    }));

    setPayoutHistory([
      {
        id: '1',
        date: '2024-02-01',
        amount: 900.00,
        status: 'completed',
        tasks: 12,
        reference: 'PAY-2024-0201'
      },
      {
        id: '2',
        date: '2024-01-15',
        amount: 750.00,
        status: 'completed',
        tasks: 10,
        reference: 'PAY-2024-0115'
      },
      {
        id: '3',
        date: '2024-01-01',
        amount: 620.00,
        status: 'completed',
        tasks: 8,
        reference: 'PAY-2024-0101'
      }
    ]);
    
    setLoading(false);
  };

  const handleBankSave = async () => {
    if (!bankDetails.iban || !bankDetails.accountHolder) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    setSavingBank(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Bankdaten gespeichert');
    } catch (error) {
      toast.error('Fehler beim Speichern');
    } finally {
      setSavingBank(false);
    }
  };

  const requestPayout = async () => {
    if (payoutData.currentBalance < 50) {
      toast.error('Mindestauszahlung: 50,00 €');
      return;
    }

    toast.success('Auszahlung angefordert', {
      description: `${payoutData.currentBalance.toFixed(2)} € werden innerhalb von 3-5 Werktagen überwiesen.`
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            Abgeschlossen
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            <Clock size={12} />
            In Bearbeitung
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="employee-payout-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Auszahlung</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie Ihre Vergütungen</p>
        </div>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={18} />
          Aktualisieren
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-orange-100">Aktuelles Guthaben</span>
            <Euro size={20} className="text-orange-200" />
          </div>
          <p className="text-3xl font-bold">{payoutData.currentBalance.toFixed(2)} €</p>
          <p className="text-sm text-orange-100 mt-1">Verfügbar zur Auszahlung</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Ausstehend</span>
            <Clock size={20} className="text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{payoutData.pendingPayout.toFixed(2)} €</p>
          <p className="text-sm text-gray-500 mt-1">Wird nach Prüfung gutgeschrieben</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Letzte Auszahlung</span>
            <CheckCircle size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{payoutData.lastPayout.toFixed(2)} €</p>
          <p className="text-sm text-gray-500 mt-1">{payoutData.lastPayoutDate}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Gesamteinnahmen</span>
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {(payoutHistory.reduce((sum, p) => sum + p.amount, 0) + payoutData.currentBalance).toFixed(2)} €
          </p>
          <p className="text-sm text-gray-500 mt-1">Seit Beginn</p>
        </div>
      </div>

      {/* Quick Payout */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Schnellauszahlung</h2>
            <p className="text-sm text-gray-500 mt-1">
              Fordern Sie Ihr verfügbares Guthaben zur Auszahlung an
            </p>
          </div>
          <Button 
            onClick={requestPayout}
            disabled={payoutData.currentBalance < 50}
            className="bg-orange-500 hover:bg-orange-600 px-8"
          >
            <DollarSign size={18} className="mr-2" />
            Auszahlung anfordern
          </Button>
        </div>

        {payoutData.currentBalance < 50 && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-700">
              <AlertCircle size={14} className="inline mr-1" />
              Mindestauszahlung: 50,00 €. Aktuelles Guthaben: {payoutData.currentBalance.toFixed(2)} €
            </p>
          </div>
        )}
      </div>

      {/* Bank Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="text-blue-500" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Bankverbindung</h2>
            <p className="text-sm text-gray-500">Ihre Bankdaten für Auszahlungen</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="accountHolder">Kontoinhaber *</Label>
            <Input
              id="accountHolder"
              value={bankDetails.accountHolder}
              onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank</Label>
            <Input
              id="bankName"
              value={bankDetails.bankName}
              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
              className="h-12"
              placeholder="z.B. Sparkasse"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN *</Label>
            <Input
              id="iban"
              value={bankDetails.iban}
              onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
              className="h-12 font-mono"
              placeholder="DE00 0000 0000 0000 0000 00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bic">BIC/SWIFT</Label>
            <Input
              id="bic"
              value={bankDetails.bic}
              onChange={(e) => setBankDetails({ ...bankDetails, bic: e.target.value })}
              className="h-12 font-mono"
              placeholder="ABCDEFGH"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleBankSave}
            disabled={savingBank}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <CreditCard size={18} className="mr-2" />
            {savingBank ? 'Speichern...' : 'Bankdaten speichern'}
          </Button>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Auszahlungsverlauf</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referenz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aufgaben</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Betrag</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payoutHistory.map(payout => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-900">{payout.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-600">{payout.reference}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-900">{payout.tasks} Aufgaben</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900">{payout.amount.toFixed(2)} €</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payout.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                      <FileText size={16} />
                      Beleg
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payoutHistory.length === 0 && (
          <div className="p-12 text-center">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Auszahlungen</h3>
            <p className="text-gray-500">Hier erscheinen Ihre zukünftigen Auszahlungen.</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-green-800">Auszahlungsinformationen</h3>
            <ul className="text-sm text-green-700 mt-2 space-y-1">
              <li>• Auszahlungen werden innerhalb von 3-5 Werktagen bearbeitet</li>
              <li>• Mindestauszahlung: 50,00 €</li>
              <li>• Gebühren: Keine (Infometrica übernimmt alle Bankgebühren)</li>
              <li>• Bei Fragen: finanzen@infometrica.de</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitarbeiterAuszahlung;
