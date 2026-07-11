import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, QrCode, Loader2 } from 'lucide-react';
import api from '../../utils/api';

export default function AdminAssetForm() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    code: `AST-${Math.floor(Math.random() * 10000)}`,
    category: 'Electrical',
    location: '',
    condition: 'Good',
    lastServiceDate: '',
    nextServiceDate: '',
    notes: ''
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    try {
      const payload: any = { ...formData };
      if (!payload.lastServiceDate) delete payload.lastServiceDate;
      if (!payload.nextServiceDate) delete payload.nextServiceDate;

      await api.post('/assets', payload);
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to create asset', err);
      alert('Failed to save asset. Check console.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isSaved) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <QrCode className="w-12 h-12 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Asset Registered!</h2>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">The asset has been saved and a unique permanent QR code has been generated.</p>
        
        <div className="bg-white border border-slate-200 rounded-xl p-8 mb-8 inline-block text-left shadow-sm">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Label Preview</div>
          <div className="flex gap-6 items-center">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MAINTAINIQ-${formData.code}`} alt="QR Code" className="w-32 h-32 rounded-lg" />
            <div>
              <div className="font-bold text-lg text-slate-900">{formData.name}</div>
              <div className="font-mono text-slate-600 mb-2">{formData.code}</div>
              <div className="text-sm text-slate-500">Scan to report an issue</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button className="btn-secondary" onClick={() => navigate('/admin/assets')}>Back to Assets</button>
          <button className="btn-primary flex items-center gap-2">Download Label</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/assets" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Register New Asset</h2>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="input-field" placeholder="e.g., Conference Room AC" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Asset Code</label>
                <input 
                  required
                  name="code"
                  type="text" 
                  className="input-field font-mono" 
                  value={formData.code}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  <option>Electrical</option>
                  <option>HVAC</option>
                  <option>IT Equipment</option>
                  <option>Furniture</option>
                  <option>Plumbing</option>
                  <option>Hardware</option>
                  <option>Safety</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input required name="location" value={formData.location} onChange={handleChange} type="text" className="input-field" placeholder="Building / Floor / Room" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="input-field">
                  <option>New</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Poor</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Service</label>
                  <input name="lastServiceDate" value={formData.lastServiceDate} onChange={handleChange} type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Next Service</label>
                  <input name="nextServiceDate" value={formData.nextServiceDate} onChange={handleChange} type="date" className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Photo (Optional)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors">
                  <Camera className="w-6 h-6 mb-2" />
                  <span className="text-sm">Upload Photo</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Internal Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="input-field" rows={3} placeholder="Private notes not visible to public..." />
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
          <Link to="/admin/assets" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Save & Generate QR
          </button>
        </div>
      </div>
    </form>
  );
}
