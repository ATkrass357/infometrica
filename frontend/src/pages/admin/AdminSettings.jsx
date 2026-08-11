import React, { useState } from 'react';
import { Settings, FileText } from 'lucide-react';
import {
  ContractBody,
  CONTRACT_TITLES,
  CONTRACT_SUBTITLES,
  CONTRACT_POSITIONS,
} from '../mitarbeiter/ContractTemplates';

const CONTRACT_TYPES = [
  { id: 'vollzeit', label: 'Vollzeit (DE)' },
  { id: 'teilzeit', label: 'Teilzeit (DE)' },
  { id: 'minijob', label: 'Minijob (DE)' },
  { id: 'vollzeit_at', label: 'Vollzeit (AT)' },
  { id: 'teilzeit_at', label: 'Teilzeit (AT)' },
  { id: 'minijob_at', label: 'Werkvertrag (AT)' },
  { id: 'freiberufler_at', label: 'Freiberufler (AT)' },
];

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [selectedContract, setSelectedContract] = useState('vollzeit');

  return (
    <div className="space-y-6" data-testid="admin-settings-page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#7aa2f7]/15 flex items-center justify-center">
          <Settings className="text-[#7aa2f7]" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#c0caf5]">Einstellungen</h1>
          <p className="text-[#9aa5ce] text-sm">Interner Bereich – nur für Administratoren</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#292e42]" data-testid="settings-tabs">
        <button
          onClick={() => setActiveTab('contracts')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'contracts'
              ? 'border-[#7aa2f7] text-[#c0caf5]'
              : 'border-transparent text-[#9aa5ce] hover:text-[#c0caf5]'
          }`}
          data-testid="tab-contracts"
        >
          <FileText size={16} />
          Arbeitsverträge
        </button>
      </div>

      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" data-testid="contracts-reader">
          {/* Contract type list */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs uppercase tracking-wide text-[#565f89] mb-2 px-1">Vertragstyp wählen</p>
            {CONTRACT_TYPES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedContract(c.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  selectedContract === c.id
                    ? 'bg-[#7aa2f7]/15 border-[#7aa2f7] text-[#c0caf5]'
                    : 'bg-[#1a1b26] border-[#292e42] text-[#9aa5ce] hover:border-[#565f89]'
                }`}
                data-testid={`contract-type-${c.id}`}
              >
                <span className="font-medium block">{c.label}</span>
                <span className="text-xs text-[#565f89]">{CONTRACT_SUBTITLES[c.id]}</span>
              </button>
            ))}
          </div>

          {/* Contract reader (paper) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 text-[#0A0A0A] max-h-[75vh] overflow-y-auto" data-testid="contract-document">
              <div className="text-center border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold tracking-wide">{CONTRACT_TITLES[selectedContract]}</h2>
                <p className="text-gray-600 mt-1">{CONTRACT_SUBTITLES[selectedContract]}</p>
                <p className="text-sm text-gray-500 mt-2">Position: {CONTRACT_POSITIONS[selectedContract]}</p>
              </div>

              <div className="mb-6 text-sm leading-relaxed">
                <p><strong>zwischen</strong></p>
                <p>MO Handel &amp; Service, Inh. Mariusz Jerzy Otok (nachfolgend „Arbeitgeber")</p>
                <p className="mt-2"><strong>und</strong></p>
                <p>[Name des Arbeitnehmers] (nachfolgend „Arbeitnehmer")</p>
              </div>

              <div className="space-y-4 text-sm leading-relaxed">
                <ContractBody type={selectedContract} signedDate="[Datum der Unterzeichnung]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
