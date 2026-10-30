import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Check,
  Save,
  Sparkles,
  Bot,
  Search,
  X,
  AlertCircle,
} from 'lucide-react';
import { useStoreContent, FaqItem } from '../context/StoreContentContext';

const CATEGORY_OPTIONS = [
  { id: 'purity', label: 'Purity & Sourcing' },
  { id: 'dosage', label: 'Dosage & Ritual' },
  { id: 'safety', label: 'Safety & Storage' },
  { id: 'shipping', label: 'Shipping & Delivery' },
  { id: 'aeo', label: 'Google AI & AEO Direct Answers' },
];

interface AdminFaqSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const AdminFaqSection: React.FC<AdminFaqSectionProps> = ({ onSuccessToast }) => {
  const { faqs, updateFaqItem, addFaqItem, deleteFaqItem, resetFaqsToDefault } = useStoreContent();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [adminSearch, setAdminSearch] = useState<string>('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FaqItem>>({});

  // Adding new FAQ state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState<Omit<FaqItem, 'id'>>({
    question: '',
    answer: '',
    category: 'purity',
    isAeoPriority: true,
  });

  const handleStartEdit = (faq: FaqItem) => {
    setEditingId(faq.id);
    setEditForm({ ...faq });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.question?.trim() || !editForm.answer?.trim()) return;
    await updateFaqItem(editingId, {
      question: editForm.question.trim(),
      answer: editForm.answer.trim(),
      category: editForm.category || 'purity',
      isAeoPriority: editForm.isAeoPriority ?? false,
    });
    setEditingId(null);
    setEditForm({});
    if (onSuccessToast) onSuccessToast('FAQ updated and synchronized with cloud database!');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleCreateNewFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqForm.question.trim() || !newFaqForm.answer.trim()) return;
    await addFaqItem({
      question: newFaqForm.question.trim(),
      answer: newFaqForm.answer.trim(),
      category: newFaqForm.category,
      isAeoPriority: newFaqForm.isAeoPriority,
    });
    setNewFaqForm({
      question: '',
      answer: '',
      category: 'purity',
      isAeoPriority: true,
    });
    setIsAddingNew(false);
    if (onSuccessToast) onSuccessToast('New FAQ added and published live!');
  };

  const handleDelete = async (id: string, q: string) => {
    if (window.confirm(`Are you sure you want to delete this FAQ?\n\n"${q}"`)) {
      await deleteFaqItem(id);
      if (onSuccessToast) onSuccessToast('FAQ deleted.');
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all FAQs to the master 15 Titan AEO and Purity defaults? Custom FAQs will be replaced.')) {
      await resetFaqsToDefault();
      if (onSuccessToast) onSuccessToast('Reset FAQs to master verified set.');
    }
  };

  const filteredFaqs = (faqs || []).filter((f) => {
    const matchesCat = filterCategory === 'all' || f.category === filterCategory;
    const q = adminSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white rounded-sm border border-[#10110F]/10 shadow-xs overflow-hidden mb-8">
      {/* Top Header */}
      <div className="p-5 sm:p-6 bg-[#183D27] text-[#F7F3E8] border-b border-[#B88A32]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B88A32]/20 border border-[#B88A32]/40 text-[#D4B66A] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            <HelpCircle className="w-3 h-3 text-[#D4B66A]" />
            <span>FAQ &amp; ANSWER ENGINE OPTIMIZATION (AEO) DESK</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F7F3E8]">
            Manage FAQs &amp; AI Knowledge Base ({faqs?.length || 0})
          </h2>
          <p className="text-xs text-[#EEE8D7]/80 font-sans mt-1">
            Edit existing questions, add new apothecary answers, or toggle AI priority for Google AI Overviews and conversational search engines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-[#EEE8D7] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#D4B66A]" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-4 py-2 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {/* Adding New FAQ Drawer / Form */}
      {isAddingNew && (
        <form onSubmit={handleCreateNewFaq} className="p-5 sm:p-6 bg-[#10110F] text-[#F7F3E8] border-b border-[#B88A32]/30 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-[#D4B66A] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#D4B66A]" />
              <span>Add New FAQ to Knowledge Base</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]">
                Question (Search query / Natural query) *
              </label>
              <input
                type="text"
                required
                value={newFaqForm.question}
                onChange={(e) => setNewFaqForm({ ...newFaqForm, question: e.target.value })}
                placeholder="e.g. Can Shilajit be taken with warm water or milk?"
                className="w-full px-3 py-2.5 rounded-xs bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4B66A]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]">
                Category *
              </label>
              <select
                value={newFaqForm.category}
                onChange={(e) => setNewFaqForm({ ...newFaqForm, category: e.target.value as any })}
                className="w-full px-3 py-2.5 rounded-xs bg-[#183D27] border border-white/20 text-sm text-white focus:outline-none focus:border-[#D4B66A]"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#EEE8D7]">
              Answer (Direct factual answer; 40-70 words recommended for Google AI Overviews) *
            </label>
            <textarea
              required
              rows={3}
              value={newFaqForm.answer}
              onChange={(e) => setNewFaqForm({ ...newFaqForm, answer: e.target.value })}
              placeholder="Provide a precise, scientific, and Ayurvedic answer..."
              className="w-full px-3 py-2 rounded-xs bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4B66A]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EEE8D7]">
              <input
                type="checkbox"
                checked={newFaqForm.isAeoPriority}
                onChange={(e) => setNewFaqForm({ ...newFaqForm, isAeoPriority: e.target.checked })}
                className="rounded-xs text-[#B88A32] focus:ring-0"
              />
              <span className="font-semibold text-[#D4B66A] flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                <span>Tag as AEO / Google AI Priority Answer</span>
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-xs bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Publish FAQ</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter and Search Bar inside Admin */}
      <div className="p-4 sm:p-5 bg-[#F7F3E8] border-b border-[#10110F]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-[11px] font-bold uppercase text-[#66704B] mr-1">Filter:</span>
          {[{ id: 'all', label: 'All' }, ...CATEGORY_OPTIONS].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              className={`px-3 py-1 rounded-xs text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                filterCategory === c.id
                  ? 'bg-[#183D27] text-white'
                  : 'bg-white hover:bg-white/90 text-[#10110F] border border-[#10110F]/10'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#10110F]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            placeholder="Search FAQs in admin..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xs bg-white border border-[#10110F]/20 text-xs text-[#10110F] focus:outline-none focus:border-[#183D27]"
          />
        </div>
      </div>

      {/* FAQs List */}
      <div className="divide-y divide-[#10110F]/10">
        {filteredFaqs.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#66704B]">
            No FAQs match your search or filter.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isEditing = editingId === faq.id;
            return (
              <div key={faq.id} className="p-4 sm:p-5 hover:bg-[#F7F3E8]/30 transition-colors">
                {isEditing ? (
                  /* Edit Form */
                  <div className="space-y-3 bg-[#F7F3E8] p-4 rounded-xs border border-[#183D27]/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#183D27] flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editing FAQ</span>
                      </span>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                        className="px-2.5 py-1 rounded-xs bg-white border border-[#10110F]/20 text-xs font-semibold"
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      value={editForm.question || ''}
                      onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                      className="w-full px-3 py-2 rounded-xs bg-white border border-[#10110F]/20 text-sm font-bold text-[#10110F]"
                    />

                    <textarea
                      rows={4}
                      value={editForm.answer || ''}
                      onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                      className="w-full px-3 py-2 rounded-xs bg-white border border-[#10110F]/20 text-xs text-[#10110F] leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={editForm.isAeoPriority ?? false}
                          onChange={(e) => setEditForm({ ...editForm, isAeoPriority: e.target.checked })}
                          className="rounded-xs text-[#183D27]"
                        />
                        <span className="text-xs font-bold text-[#183D27]">Google AI / AEO Priority</span>
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 rounded-xs bg-gray-200 hover:bg-gray-300 text-xs font-bold uppercase"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="px-4 py-1.5 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-white text-xs font-bold uppercase flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5 text-[#D4B66A]" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Normal View */
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#183D27]/10 text-[#183D27] text-[9px] font-black uppercase tracking-wider">
                          {faq.category || 'Purity'}
                        </span>
                        {faq.isAeoPriority && (
                          <span className="px-2 py-0.5 rounded-full bg-[#B88A32]/20 text-[#B88A32] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 border border-[#B88A32]/40">
                            <Bot className="w-2.5 h-2.5" />
                            <span>AI Overview Priority</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-sm sm:text-base text-[#10110F] leading-snug">
                        {faq.question}
                      </h4>

                      <p className="text-xs text-[#66704B] font-sans leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(faq)}
                        className="px-3 py-1.5 rounded-xs bg-white hover:bg-[#183D27] text-[#10110F] hover:text-[#F7F3E8] border border-[#10110F]/15 text-xs font-bold uppercase flex items-center gap-1 transition-all cursor-pointer"
                        title="Edit question & answer"
                      >
                        <Edit3 className="w-3 h-3 text-[#B88A32]" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(faq.id, faq.question)}
                        className="p-1.5 rounded-xs bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs transition-all cursor-pointer"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default AdminFaqSection;
