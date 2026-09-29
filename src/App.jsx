import React, { useState, useEffect } from 'react';
import { Printer, Plus, Settings2, X } from 'lucide-react';
import { generateAmountInWords } from './utils';
import './index.css';

function App() {
  const [formData, setFormData] = useState({
    companyName1: '',
    companyName2: '',
    companyName3: '',
    vd: '',
    no: '',
    date: new Date().toLocaleDateString('tr-TR'),
    rows: [{ desc: '', doc: '', amount: '', currency: 'TL' }],
    advance: { amount: '', currency: 'TL' },
    debt: { amount: '', currency: 'TL' },
    account: { amount: '', currency: 'TL' },
  });

  const [offsets, setOffsets] = useState({
    comp1T: 20.0, comp1L: 1.6,
    comp2T: 23.3, comp2L: 1.6,
    comp3T: 26.6, comp3L: 1.6,
    vdT: 29.6, vdL: 5.0,
    noT: 29.6, noL: 30.8,
    dateT: 30.2, dateL: 66.6,
    tableT: 45.1, rowSpace: 2.76,
    descL: 7.4, docL: 48.4, amountR: 14.6,
    onlyT: 77.6, onlyL: 10.0,
    grandT: 77.2, grandR: 15.0,
    advT: 80.6, advR: 15.0,
    debtT: 83.8, debtR: 15.0,
    accT: 87.2, accR: 15.0,
  });

  const [calculatedTotals, setCalculatedTotals] = useState({});
  const [grandTotalText, setGrandTotalText] = useState('');
  const [grandTotalFormatted, setGrandTotalFormatted] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const totals = { TL: 0, EUR: 0, USD: 0 };
    let hasValues = false;

    formData.rows.forEach(row => {
      if (row.amount && !isNaN(parseFloat(row.amount))) {
        totals[row.currency] += parseFloat(row.amount);
        hasValues = true;
      }
    });

    setCalculatedTotals(totals);

    if (hasValues) {
      setGrandTotalText(generateAmountInWords(totals));
      const formatted = Object.entries(totals)
        .filter(([_, val]) => val > 0)
        .map(([curr, val]) => `${val.toLocaleString('tr-TR')} ${curr}`)
        .join(' + ');
      setGrandTotalFormatted(formatted);
    } else {
      setGrandTotalText('');
      setGrandTotalFormatted('');
    }
  }, [formData.rows]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOffsetChange = (e) => {
    const { name, value } = e.target;
    setOffsets(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...formData.rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setFormData(prev => ({ ...prev, rows: newRows }));
  };

  const handleBottomAmount = (field, subfield, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [subfield]: value }
    }));
  };

  const addRow = () => {
    if (formData.rows.length < 12) {
      setFormData(prev => ({
        ...prev,
        rows: [...prev.rows, { desc: '', doc: '', amount: '', currency: 'TL' }]
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const SettingRow = ({ title, fields }) => (
    <div style={{background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #E5E7EB'}}>
      <strong style={{display: 'block', marginBottom: '10px', color: '#374151', fontSize: '1.1rem'}}>{title}</strong>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
        {fields.map((f, i) => (
          <label key={i} style={{display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.95rem'}}>
            {f.label}
            <input 
              type="number" 
              step="0.2" 
              name={f.name} 
              value={offsets[f.name]} 
              onChange={handleOffsetChange} 
              style={{padding:'8px', fontSize: '1rem', background: '#F9FAFB'}}
            />
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Sol Panel - Form Alanı */}
      <div className="sidebar" style={{ position: 'relative' }}>
        <div className="header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1>Fatura / Dekont Yazdırıcı</h1>
            <p>Bilgileri doldurun ve yazdırın.</p>
          </div>
          <button className="btn-secondary" onClick={() => setShowSettings(!showSettings)} style={{display: 'flex', alignItems: 'center', gap: '5px', background: showSettings ? '#DC2626' : '#4F46E5', color: 'white', fontWeight: 'bold'}}>
            {showSettings ? <X size={20} /> : <Settings2 size={20} />}
            {showSettings ? 'Ayarları Kapat' : 'Hizalama Ayarları'}
          </button>
        </div>

        {showSettings ? (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
            <div style={{background: '#FEF2F2', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid #FCA5A5'}}>
              <h3 style={{fontSize: '1.2rem', marginBottom: '0.5rem', color: '#B91C1C'}}>Manuel İnce Ayar (Yüzdelik %)</h3>
              <p style={{fontSize: '0.95rem', color: '#7F1D1D', marginBottom: '1.5rem'}}>
                Ayarları rahat görebilmen için formu gizledim. Kutu içindeki sayılara tıklayıp klavyendeki yukarı-aşağı ok tuşlarıyla sayıları hızlıca değiştirerek sağdaki önizlemede yazıları tam yerlerine oturt!
              </p>
              
              <SettingRow 
                title="Firma Adı (3 Satır)" 
                fields={[
                  {label: '1. Satır (Yukarıdan %)', name: 'comp1T'}, {label: '1. Satır (Soldan %)', name: 'comp1L'},
                  {label: '2. Satır (Yukarıdan %)', name: 'comp2T'}, {label: '2. Satır (Soldan %)', name: 'comp2L'},
                  {label: '3. Satır (Yukarıdan %)', name: 'comp3T'}, {label: '3. Satır (Soldan %)', name: 'comp3L'},
                ]}
              />

              <SettingRow 
                title="V.D. / No / Tarih" 
                fields={[
                  {label: 'V.D. (Yukarıdan %)', name: 'vdT'}, {label: 'V.D. (Soldan %)', name: 'vdL'},
                  {label: 'No (Yukarıdan %)', name: 'noT'}, {label: 'No (Soldan %)', name: 'noL'},
                  {label: 'Tarih (Yukarıdan %)', name: 'dateT'}, {label: 'Tarih (Soldan %)', name: 'dateL'},
                ]}
              />

              <SettingRow 
                title="İşlem Kalemleri (Tablo)" 
                fields={[
                  {label: 'İlk Satır Başlangıcı (Yukarı %)', name: 'tableT'}, {label: 'Satır Aralığı Boşluğu', name: 'rowSpace'},
                  {label: 'Açıklama Başlangıcı (Sol %)', name: 'descL'}, {label: 'Belge No Başlangıcı (Sol %)', name: 'docL'},
                  {label: 'Tutar Bitişi (Sağdan % Yaslı)', name: 'amountR'}
                ]}
              />

              <SettingRow 
                title="Yalnız (Yazıyla)" 
                fields={[
                  {label: 'Yalnız Metni (Yukarıdan %)', name: 'onlyT'}, {label: 'Yalnız Metni (Soldan %)', name: 'onlyL'},
                ]}
              />

              <SettingRow 
                title="Alt Toplamlar (Sağa Yaslı)" 
                fields={[
                  {label: 'Genel Toplam (Yukarı %)', name: 'grandT'}, {label: 'Genel Toplam (Sağdan %)', name: 'grandR'},
                  {label: 'Alınan Avans (Yukarı %)', name: 'advT'}, {label: 'Alınan Avans (Sağdan %)', name: 'advR'},
                  {label: 'Bakiye Borç (Yukarı %)', name: 'debtT'}, {label: 'Bakiye Borç (Sağdan %)', name: 'debtR'},
                  {label: 'Alacak (Yukarı %)', name: 'accT'}, {label: 'Alacak (Sağdan %)', name: 'accR'},
                ]}
              />

            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '10px' }}>
            <div className="form-group">
              <label>Firma / Kişi Adı ve Adresi</label>
              <input type="text" name="companyName1" placeholder="1. Satır" value={formData.companyName1} onChange={handleChange} style={{marginBottom: '5px'}}/>
              <input type="text" name="companyName2" placeholder="2. Satır" value={formData.companyName2} onChange={handleChange} style={{marginBottom: '5px'}}/>
              <input type="text" name="companyName3" placeholder="3. Satır" value={formData.companyName3} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group" style={{flex: 1}}>
                <label>V.D. (Vergi Dairesi)</label>
                <input type="text" name="vd" value={formData.vd} onChange={handleChange} />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Vergi / TC No</label>
                <input type="text" name="no" value={formData.no} onChange={handleChange} />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Tarih</label>
                <input type="text" name="date" value={formData.date} onChange={handleChange} />
              </div>
            </div>

            <div className="table-inputs">
              <label>İşlem Kalemleri</label>
              {formData.rows.map((row, index) => (
                <div key={index} className="row-input">
                  <input 
                    type="text" 
                    placeholder={`${index + 1}. Açıklama`} 
                    value={row.desc} 
                    onChange={(e) => handleRowChange(index, 'desc', e.target.value)} 
                  />
                  <input 
                    type="text" 
                    placeholder="Belge Tarihi/No" 
                    value={row.doc} 
                    onChange={(e) => handleRowChange(index, 'doc', e.target.value)} 
                  />
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="Tutar" 
                    value={row.amount} 
                    onChange={(e) => handleRowChange(index, 'amount', e.target.value)} 
                  />
                  <select 
                    value={row.currency} 
                    onChange={(e) => handleRowChange(index, 'currency', e.target.value)}
                  >
                    <option value="TL">TL</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              ))}
              {formData.rows.length < 12 && (
                <button className="btn-secondary" onClick={addRow}>
                  <Plus size={16} style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}} />
                  Yeni Satır Ekle
                </button>
              )}
            </div>

            <div className="form-row">
              <div className="form-group" style={{flex: 1}}>
                <label>Genel Toplam</label>
                <div style={{padding: '0.75rem 1rem', background: '#F3F4F6', borderRadius: '0.5rem', minHeight: '44px'}}>{grandTotalFormatted || '-'}</div>
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Alınan Avans</label>
                <div className="bottom-amount-row">
                  <input type="number" step="0.01" placeholder="Tutar" value={formData.advance.amount} onChange={(e) => handleBottomAmount('advance', 'amount', e.target.value)} />
                  <select style={{width: '80px'}} value={formData.advance.currency} onChange={(e) => handleBottomAmount('advance', 'currency', e.target.value)}><option value="TL">TL</option><option value="EUR">EUR</option><option value="USD">USD</option></select>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group" style={{flex: 1}}>
                <label>Kalan Bakiye Borç</label>
                <div className="bottom-amount-row">
                  <input type="number" step="0.01" placeholder="Tutar" value={formData.debt.amount} onChange={(e) => handleBottomAmount('debt', 'amount', e.target.value)} />
                  <select style={{width: '80px'}} value={formData.debt.currency} onChange={(e) => handleBottomAmount('debt', 'currency', e.target.value)}><option value="TL">TL</option><option value="EUR">EUR</option><option value="USD">USD</option></select>
                </div>
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Alacak</label>
                <div className="bottom-amount-row">
                  <input type="number" step="0.01" placeholder="Tutar" value={formData.account.amount} onChange={(e) => handleBottomAmount('account', 'amount', e.target.value)} />
                  <select style={{width: '80px'}} value={formData.account.currency} onChange={(e) => handleBottomAmount('account', 'currency', e.target.value)}><option value="TL">TL</option><option value="EUR">EUR</option><option value="USD">USD</option></select>
                </div>
              </div>
            </div>

            <button className="btn-primary" onClick={handlePrint} style={{marginBottom: '2rem'}}>
              <Printer size={20} />
              Şablon Üzerine Yazdır
            </button>
          </div>
        )}
      </div>

      {/* Sağ Panel - Önizleme Alanı */}
      <div className="preview-area">
        <div className="paper-container">
          <div className="paper-bg"></div>
          
          <div className="paper-content">
            {/* Firma Adı */}
            <div className="pos-company-1" style={{top: `${offsets.comp1T}%`, left: `${offsets.comp1L}%`}}>{formData.companyName1}</div>
            <div className="pos-company-2" style={{top: `${offsets.comp2T}%`, left: `${offsets.comp2L}%`}}>{formData.companyName2}</div>
            <div className="pos-company-3" style={{top: `${offsets.comp3T}%`, left: `${offsets.comp3L}%`}}>{formData.companyName3}</div>
            
            {/* VD, No, Tarih */}
            <div className="pos-vd" style={{top: `${offsets.vdT}%`, left: `${offsets.vdL}%`}}>{formData.vd}</div>
            <div className="pos-no" style={{top: `${offsets.noT}%`, left: `${offsets.noL}%`}}>{formData.no}</div>
            <div className="pos-date" style={{top: `${offsets.dateT}%`, left: `${offsets.dateL}%`}}>{formData.date}</div>

            {/* Tablo Satırları */}
            {formData.rows.map((row, index) => (
              <div key={index} className="pos-row" style={{ top: `${offsets.tableT + (index * offsets.rowSpace)}%` }}>
                <div className="pos-desc" style={{left: `${offsets.descL}%`}}>{row.desc}</div>
                <div className="pos-doc" style={{left: `${offsets.docL}%`}}>{row.doc}</div>
                <div className="pos-amount" style={{right: `${offsets.amountR}%`}}>
                  {row.amount ? `${parseFloat(row.amount).toLocaleString('tr-TR')} ${row.currency}` : ''}
                </div>
              </div>
            ))}

            {/* Alt Toplamlar */}
            <div className="pos-only" style={{top: `${offsets.onlyT}%`, left: `${offsets.onlyL}%`}}>{grandTotalText}</div>

            <div className="pos-grand" style={{top: `${offsets.grandT}%`, right: `${offsets.grandR}%`}}>{grandTotalFormatted}</div>
            <div className="pos-adv" style={{top: `${offsets.advT}%`, right: `${offsets.advR}%`}}>
              {formData.advance.amount ? `${parseFloat(formData.advance.amount).toLocaleString('tr-TR')} ${formData.advance.currency}` : ''}
            </div>
            <div className="pos-debt" style={{top: `${offsets.debtT}%`, right: `${offsets.debtR}%`}}>
              {formData.debt.amount ? `${parseFloat(formData.debt.amount).toLocaleString('tr-TR')} ${formData.debt.currency}` : ''}
            </div>
            <div className="pos-acc" style={{top: `${offsets.accT}%`, right: `${offsets.accR}%`}}>
              {formData.account.amount ? `${parseFloat(formData.account.amount).toLocaleString('tr-TR')} ${formData.account.currency}` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
