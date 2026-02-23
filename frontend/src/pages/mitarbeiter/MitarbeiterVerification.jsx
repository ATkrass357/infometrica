import React, { useState } from 'react';
import { Upload, Shield, AlertTriangle, CheckCircle, FileImage, Loader2 } from 'lucide-react';
import { BenkeLogo } from '../../components/Logo';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MitarbeiterVerification = ({ applicant, onVerificationComplete }) => {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Nur JPEG, PNG oder WebP Bilder erlaubt');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Datei zu groß (max. 5 MB)');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (side === 'front') {
        setFrontImage(file);
        setFrontPreview(reader.result);
      } else {
        setBackImage(file);
        setBackPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      toast.error('Bitte laden Sie beide Seiten des Ausweises hoch');
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem('employee_token');
      const formData = new FormData();
      formData.append('front', frontImage);
      formData.append('back', backImage);

      await axios.post(`${BACKEND_URL}/api/applications/verification/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Dokumente erfolgreich hochgeladen');
      if (onVerificationComplete) {
        onVerificationComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Fehler beim Hochladen der Dokumente');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <BenkeLogo className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Identitätsverifizierung erforderlich
          </h1>
          <p className="text-gray-600">
            Willkommen, <span className="font-semibold">{applicant?.name}</span>! 
            Bevor Sie auf das Mitarbeiter-Portal zugreifen können, ist eine Verifizierung erforderlich.
          </p>
        </div>

        {/* Legal Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">
                Hinweis gemäß Geldwäschegesetz (GwG)
              </h3>
              <p className="text-sm text-amber-700">
                Wegen des Geldwäschegesetzes müssen sich alle Mitarbeiter online ausweisen. 
                Bitte laden Sie folgende Dokumente hoch:
              </p>
              <ul className="text-sm text-amber-700 mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} /> Ausweisbild Vorderseite
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} /> Ausweisbild Rückseite
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* GDPR Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <Shield className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                Datenschutz (DSGVO)
              </h3>
              <p className="text-sm text-blue-700">
                Ihre Daten werden DSGVO-konform behandelt. Die Ausweisbilder werden ausschließlich 
                zur Identitätsprüfung verwendet und nach erfolgreicher Verifizierung gelöscht.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FileImage className="text-orange-500" size={20} />
            Ausweisdokumente hochladen
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Front Side */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vorderseite *
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  frontPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-orange-400'
                }`}
              >
                {frontPreview ? (
                  <div className="relative">
                    <img 
                      src={frontPreview} 
                      alt="Vorderseite" 
                      className="max-h-40 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => { setFrontImage(null); setFrontPreview(null); }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <span className="text-sm text-gray-600">Bild hochladen</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileChange(e, 'front')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Back Side */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rückseite *
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  backPreview ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-orange-400'
                }`}
              >
                {backPreview ? (
                  <div className="relative">
                    <img 
                      src={backPreview} 
                      alt="Rückseite" 
                      className="max-h-40 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => { setBackImage(null); setBackPreview(null); }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <span className="text-sm text-gray-600">Bild hochladen</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileChange(e, 'back')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!frontImage || !backImage || isUploading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Wird hochgeladen...
              </>
            ) : (
              <>
                <Upload className="mr-2" size={20} />
                Dokumente einreichen
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Erlaubte Formate: JPEG, PNG, WebP (max. 5 MB pro Bild)
          </p>
        </div>
      </div>
    </div>
  );
};

export default MitarbeiterVerification;
