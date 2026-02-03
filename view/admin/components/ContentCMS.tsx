
import React, { useState } from 'react';
import { Layout, Trash2, Edit } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { FAQItem } from '../../../types';

export const ContentCMS: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([
    { id: '1', question: 'Bagaimana cara menjadi donatur?', answer: 'Daftar akun dan pilih role Provider...', category: 'Umum' },
    { id: '2', question: 'Apakah ada biaya?', answer: 'Tidak ada biaya sama sekali.', category: 'Umum' }
  ]);
  const [faqForm, setFaqForm] = useState({ id: '', question: '', answer: '', category: 'Umum' });
  const [isEditingFaq, setIsEditingFaq] = useState(false);

  const handleSaveFaq = () => {
      if (!faqForm.question || !faqForm.answer) return alert('Mohon isi pertanyaan dan jawaban');
      if (isEditingFaq) {
          setFaqs(faqs.map(f => f.id === faqForm.id ? faqForm : f));
          alert('FAQ diperbarui!');
      } else {
          setFaqs([...faqs, { id: Date.now().toString(), ...faqForm }]);
          alert('FAQ tersimpan!');
      }
      setFaqForm({ id: '', question: '', answer: '', category: 'Umum' });
      setIsEditingFaq(false);
  };

  const handleDeleteFaq = (id: string) => {
      if (confirm('Hapus FAQ ini?')) {
          setFaqs(faqs.filter(f => f.id !== id));
      }
  };

  return (
      <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Layout className="w-6 h-6 text-orange-500" /> Manajemen Konten (FAQ)
              </h2>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
              <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center bg-stone-50 dark:bg-stone-950">
                  <h4 className="font-bold text-stone-900 dark:text-white">Daftar Pertanyaan (FAQ)</h4>
                  <Button className="h-8 w-auto text-xs" onClick={() => { setIsEditingFaq(false); setFaqForm({id:'', question:'', answer:'', category:'Umum'}) }}>+ Tambah FAQ</Button>
              </div>
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {(isEditingFaq || faqForm.question) && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-900/10 space-y-3">
                          <Input label="Pertanyaan" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} />
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-stone-500">Jawaban</label>
                              <textarea className="w-full p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-200" rows={3} value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})}></textarea>
                          </div>
                          <div className="flex gap-2 justify-end">
                              <Button variant="ghost" className="w-auto h-8" onClick={() => { setIsEditingFaq(false); setFaqForm({id:'', question:'', answer:'', category:'Umum'}) }}>Batal</Button>
                              <Button className="w-auto h-8" onClick={handleSaveFaq}>Simpan</Button>
                          </div>
                      </div>
                  )}
                  
                  {faqs.map(faq => (
                      <div key={faq.id} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group">
                          <div className="flex justify-between items-start mb-1">
                              <h5 className="font-bold text-sm text-stone-900 dark:text-white">{faq.question}</h5>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setFaqForm({ ...faq, id: faq.id || '', category: faq.category || 'Umum' }); setIsEditingFaq(true); }} className="text-blue-500"><Edit className="w-3 h-3" /></button>
                                  <button onClick={() => handleDeleteFaq(faq.id || '')} className="text-red-500"><Trash2 className="w-3 h-3" /></button>
                              </div>
                          </div>
                          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{faq.answer}</p>
                          <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-500 mt-2 inline-block">{faq.category}</span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );
};
