import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Save,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Flame,
  Droplets,
  Zap,
  Brain,
  Heart,
  Image as ImageIcon,
  Cloud,
} from 'lucide-react';
import {
  QualityTrustCard,
  QualityTrustConfig,
  BenefitCard,
} from '../types';
import { DEFAULT_QUALITY_TRUST, DEFAULT_PRODUCT_BENEFITS } from '../context/StoreContentContext';

interface AdminQualityTrustSectionProps {
  qualityTrust: QualityTrustConfig;
  productBenefits: BenefitCard[];
  updateQualityTrust: (config: Partial<QualityTrustConfig>) => void;
  updateQualityTrustCard: (id: string, card: Partial<QualityTrustCard>) => void;
  addQualityTrustCard: (card: Omit<QualityTrustCard, 'id'>) => void;
  deleteQualityTrustCard: (id: string) => void;
  resetQualityTrustToDefault: () => void;
  updateProductBenefits: (cards: BenefitCard[]) => void;
  updateProductBenefitCard: (id: string, card: Partial<BenefitCard>) => void;
  resetProductBenefitsToDefault: () => void;
  saveAllToFirebase: () => Promise<void>;
  showToast: (msg: string) => void;
}

export const AdminQualityTrustSection: React.FC<AdminQualityTrustSectionProps> = ({
  qualityTrust,
  productBenefits,
  updateQualityTrust,
  updateQualityTrustCard,
  addQualityTrustCard,
  deleteQualityTrustCard,
  resetQualityTrustToDefault,
  updateProductBenefits,
  updateProductBenefitCard,
  resetProductBenefitsToDefault,
  saveAllToFirebase,
  showToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'quality_trust' | 'benefits'>('quality_trust');
  const [isSavingCloud, setIsSavingCloud] = useState(false);

  // Quality Trust Header form
  const [headerKicker, setHeaderKicker] = useState(qualityTrust?.kicker || DEFAULT_QUALITY_TRUST.kicker);
  const [headerTitle, setHeaderTitle] = useState(qualityTrust?.title || DEFAULT_QUALITY_TRUST.title);
  const [headerDescription, setHeaderDescription] = useState(
    qualityTrust?.description || DEFAULT_QUALITY_TRUST.description
  );

  // Editing card state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingCardForm, setEditingCardForm] = useState<Partial<QualityTrustCard>>({});

  // Adding new card state
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardForm, setNewCardForm] = useState<Omit<QualityTrustCard, 'id'>>({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85',
    badge: 'TITAN CERTIFIED',
    tag: '100% PURE',
  });

  // Editing benefit state
  const [editingBenefitId, setEditingBenefitId] = useState<string | null>(null);
  const [editingBenefitForm, setEditingBenefitForm] = useState<Partial<BenefitCard>>({});

  const cards = qualityTrust?.cards && qualityTrust.cards.length > 0
    ? qualityTrust.cards
    : DEFAULT_QUALITY_TRUST.cards;

  const benefits = productBenefits && productBenefits.length > 0
    ? productBenefits
    : DEFAULT_PRODUCT_BENEFITS;

  const handleSaveHeader = () => {
    updateQualityTrust({
      kicker: headerKicker,
      title: headerTitle,
      description: headerDescription,
    });
    showToast('Quality & Trust section header saved!');
  };

  const handleStartEditCard = (card: QualityTrustCard) => {
    setEditingCardId(card.id);
    setEditingCardForm({ ...card });
  };

  const handleSaveEditCard = (id: string) => {
    updateQualityTrustCard(id, editingCardForm);
    setEditingCardId(null);
    setEditingCardForm({});
    showToast('Quality & Trust card updated!');
  };

  const handleCreateNewCard = () => {
    if (!newCardForm.title.trim()) {
      showToast('Please enter a card title.');
      return;
    }
    addQualityTrustCard(newCardForm);
    setIsAddingCard(false);
    setNewCardForm({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85',
      badge: 'TITAN CERTIFIED',
      tag: '100% PURE',
    });
    showToast('New Quality & Trust card added!');
  };

  const handleStartEditBenefit = (benefit: BenefitCard) => {
    setEditingBenefitId(benefit.id);
    setEditingBenefitForm({ ...benefit });
  };

  const handleSaveEditBenefit = (id: string) => {
    updateProductBenefitCard(id, editingBenefitForm);
    setEditingBenefitId(null);
    setEditingBenefitForm({});
    showToast('Benefit card updated!');
  };

  const handleCloudSync = async () => {
    setIsSavingCloud(true);
    try {
      await saveAllToFirebase();
      showToast('All Quality, Trust & Benefits changes synced to Firestore!');
    } catch (e) {
      showToast('Error syncing to Firestore. Check console.');
    } finally {
      setIsSavingCloud(false);
    }
  };

  return (
    <div id="admin-quality-trust-section" className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner with Action Controls */}
      <div className="bg-[#10110F] text-[#F7F3E8] p-6 rounded-xs border border-[#B88A32]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#183D27] text-[#D4B66A] text-[10px] font-bold tracking-widest uppercase border border-[#B88A32]/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4B66A]" />
              <span>CONTENT & PURITY PROTOCOL</span>
            </span>
            <span className="text-xs text-white/50">• Firestore Live Persist</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F3E8]">
            Quality &amp; Trust &amp; Product Benefits
          </h2>
          <p className="text-xs text-[#EEE8D7]/80 font-sans mt-1 max-w-2xl">
            Control the live homepage Quality & Trust showcase, traditional Himalayan commitment copy, 4 Purity cards, and the 4 interactive Product Benefits.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleCloudSync}
            disabled={isSavingCloud}
            className="px-4 py-2.5 rounded-xs bg-[#B88A32] hover:bg-[#D4B66A] text-[#10110F] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            <Cloud className="w-4 h-4" />
            <span>{isSavingCloud ? 'Saving to Firestore...' : 'Sync Firestore Now'}</span>
          </button>
          <a
            href="/#quality-trust-section"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2.5 rounded-xs bg-white/10 hover:bg-white/20 text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <span>Live Section</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Sub-Tabs: Quality & Trust vs Product Benefits */}
      <div className="flex border-b border-[#10110F]/15 pb-2 gap-3">
        <button
          onClick={() => setActiveSubTab('quality_trust')}
          className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeSubTab === 'quality_trust'
              ? 'bg-[#183D27] text-[#F7F3E8] shadow-sm border-b-2 border-[#B88A32]'
              : 'bg-white text-[#10110F] hover:bg-black/5 border border-[#10110F]/10'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#D4B66A]" />
          <span>Quality & Trust Section ({cards.length} Cards)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('benefits')}
          className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeSubTab === 'benefits'
              ? 'bg-[#183D27] text-[#F7F3E8] shadow-sm border-b-2 border-[#B88A32]'
              : 'bg-white text-[#10110F] hover:bg-black/5 border border-[#10110F]/10'
          }`}
        >
          <Zap className="w-4 h-4 text-[#D4B66A]" />
          <span>Product Benefits Showcase ({benefits.length} Pillars)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: QUALITY & TRUST CONFIG & CARDS */}
      {/* ========================================================================= */}
      {activeSubTab === 'quality_trust' && (
        <div className="space-y-8">
          {/* Header & Copy Form */}
          <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10110F]/10 gap-2">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#183D27] uppercase">
                  HOMEPAGE SECTION HEADER
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#10110F]">
                  Quality &amp; Trust Header Copy
                </h3>
              </div>
              <button
                onClick={() => {
                  resetQualityTrustToDefault();
                  setHeaderKicker(DEFAULT_QUALITY_TRUST.kicker);
                  setHeaderTitle(DEFAULT_QUALITY_TRUST.title);
                  setHeaderDescription(DEFAULT_QUALITY_TRUST.description);
                  showToast('Reset Quality & Trust section to official Titan defaults.');
                }}
                className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1.5 self-start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Brand Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Section Kicker / Eyebrow
                  </label>
                  <input
                    type="text"
                    value={headerKicker}
                    onChange={(e) => setHeaderKicker(e.target.value)}
                    placeholder="QUALITY & TRUST"
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                    Main Section Title
                  </label>
                  <input
                    type="text"
                    value={headerTitle}
                    onChange={(e) => setHeaderTitle(e.target.value)}
                    placeholder="Quality You Can See. Trust You Can Feel."
                    className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#10110F] mb-1">
                  Philosophy &amp; Commitment Description
                </label>
                <textarea
                  rows={4}
                  value={headerDescription}
                  onChange={(e) => setHeaderDescription(e.target.value)}
                  placeholder="At Titan Shilajit, we believe that true wellness begins with purity, transparency, and responsible quality practices..."
                  className="w-full px-3.5 py-2.5 rounded-xs border border-[#10110F]/20 text-xs sm:text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#10110F]/10 flex justify-end">
              <button
                onClick={handleSaveHeader}
                className="px-6 py-2.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#10110F] transition-colors shadow-sm"
              >
                <Save className="w-4 h-4 text-[#D4B66A]" />
                <span>Save Section Header</span>
              </button>
            </div>
          </div>

          {/* Cards Manager */}
          <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10110F]/10 gap-3">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#183D27] uppercase">
                  DYNAMIC CARDS SHOWCASE
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#10110F]">
                  Purity &amp; Trust Cards ({cards.length})
                </h3>
                <p className="text-xs text-[#66704B]">
                  Each card displays an authentic image, title, badge, and verified purity standard.
                </p>
              </div>

              <button
                onClick={() => setIsAddingCard(true)}
                className="px-4 py-2 rounded-xs bg-[#183D27] hover:bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all self-start"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4B66A]" />
                <span>Add Purity Card</span>
              </button>
            </div>

            {/* Modal / Form to Add Card */}
            {isAddingCard && (
              <div className="p-5 rounded-xs bg-[#F7F3E8] border border-[#B88A32]/40 space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-2 border-b border-[#10110F]/10">
                  <h4 className="font-serif font-bold text-sm text-[#10110F]">
                    Create New Purity &amp; Trust Card
                  </h4>
                  <button
                    onClick={() => setIsAddingCard(false)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                      Card Title *
                    </label>
                    <input
                      type="text"
                      value={newCardForm.title}
                      onChange={(e) => setNewCardForm({ ...newCardForm, title: e.target.value })}
                      placeholder="e.g. 16,000+ FT HIGH SOURCED"
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={newCardForm.subtitle}
                      onChange={(e) => setNewCardForm({ ...newCardForm, subtitle: e.target.value })}
                      placeholder="e.g. HIMALAYAN GRANITE CREVICES"
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                      Top Badge Label
                    </label>
                    <input
                      type="text"
                      value={newCardForm.badge}
                      onChange={(e) => setNewCardForm({ ...newCardForm, badge: e.target.value })}
                      placeholder="e.g. GEOGRAPHIC ORIGIN"
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                      Bottom Tag
                    </label>
                    <input
                      type="text"
                      value={newCardForm.tag}
                      onChange={(e) => setNewCardForm({ ...newCardForm, tag: e.target.value })}
                      placeholder="e.g. PURE SHILAJIT"
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={newCardForm.imageUrl}
                      onChange={(e) => setNewCardForm({ ...newCardForm, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold uppercase text-[#10110F] mb-1">
                      Description / Standard Guarantee
                    </label>
                    <textarea
                      rows={2}
                      value={newCardForm.description}
                      onChange={(e) => setNewCardForm({ ...newCardForm, description: e.target.value })}
                      placeholder="Explain how this verified standard guarantees authentic quality..."
                      className="w-full px-3 py-2 rounded-xs border border-[#10110F]/20 text-xs leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleCreateNewCard}
                    className="px-5 py-2 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#10110F]"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4B66A]" />
                    <span>Confirm &amp; Add Card</span>
                  </button>
                </div>
              </div>
            )}

            {/* List of Existing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card, idx) => {
                const isEditing = editingCardId === card.id;

                return (
                  <div
                    key={card.id || idx}
                    className="p-5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 flex flex-col justify-between space-y-4"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-[#10110F]/10">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88A32]">
                            Editing Card 0{idx + 1}
                          </span>
                          <button
                            onClick={() => setEditingCardId(null)}
                            className="text-xs text-stone-500 hover:text-stone-800"
                          >
                            Cancel
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                            Title
                          </label>
                          <input
                            type="text"
                            value={editingCardForm.title || ''}
                            onChange={(e) =>
                              setEditingCardForm({ ...editingCardForm, title: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={editingCardForm.subtitle || ''}
                              onChange={(e) =>
                                setEditingCardForm({ ...editingCardForm, subtitle: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                              Badge
                            </label>
                            <input
                              type="text"
                              value={editingCardForm.badge || ''}
                              onChange={(e) =>
                                setEditingCardForm({ ...editingCardForm, badge: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={editingCardForm.imageUrl || ''}
                            onChange={(e) =>
                              setEditingCardForm({ ...editingCardForm, imageUrl: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs"
                          />
                          {editingCardForm.imageUrl && (
                            <div className="mt-1.5 h-16 w-28 rounded-xs overflow-hidden border border-[#10110F]/20">
                              <img
                                src={editingCardForm.imageUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={editingCardForm.description || ''}
                            onChange={(e) =>
                              setEditingCardForm({ ...editingCardForm, description: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => handleSaveEditCard(card.id)}
                            className="px-4 py-1.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#10110F]"
                          >
                            <Save className="w-3.5 h-3.5 text-[#D4B66A]" />
                            <span>Save Card</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 rounded-xs overflow-hidden border border-[#10110F]/15 shrink-0 bg-black/10">
                            <img
                              src={card.imageUrl}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold text-[#183D27]">
                                CARD 0{idx + 1}
                              </span>
                              {card.badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-[#B88A32]/20 text-[#8F6A1E] font-bold uppercase">
                                  {card.badge}
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-sm text-[#10110F] line-clamp-1">
                              {card.title}
                            </h4>
                            {card.subtitle && (
                              <p className="text-[10px] font-mono text-[#66704B] uppercase tracking-wider mb-1">
                                {card.subtitle}
                              </p>
                            )}
                            <p className="text-xs text-[#10110F]/80 line-clamp-2 leading-relaxed">
                              {card.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#10110F]/10 flex items-center justify-between">
                          <span className="text-[10px] text-[#66704B] font-mono">
                            ID: {card.id}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditCard(card)}
                              className="px-3 py-1 rounded-xs bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#183D27] transition-colors"
                            >
                              <Edit3 className="w-3 h-3 text-[#D4B66A]" />
                              <span>Edit</span>
                            </button>
                            {cards.length > 1 && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete card "${card.title}"?`)) {
                                    deleteQualityTrustCard(card.id);
                                    showToast('Card deleted.');
                                  }
                                }}
                                className="p-1 rounded-xs text-red-600 hover:bg-red-50"
                                title="Delete card"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PRODUCT BENEFITS SHOWCASE */}
      {/* ========================================================================= */}
      {activeSubTab === 'benefits' && (
        <div className="space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-xs border border-[#10110F]/10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#10110F]/10 gap-2">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#183D27] uppercase">
                  HOMEPAGE BENEFITS SECTION
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#10110F]">
                  Core Ayurvedic &amp; Modern Vitality Pillars ({benefits.length})
                </h3>
                <p className="text-xs text-[#66704B]">
                  Manage the 4 primary benefits showcased with interactive science pills, potency metrics, and imagery.
                </p>
              </div>

              <button
                onClick={() => {
                  resetProductBenefitsToDefault();
                  showToast('Product benefits restored to brand defaults.');
                }}
                className="text-xs text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1.5 self-start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Brand Defaults</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => {
                const isEditing = editingBenefitId === benefit.id;

                return (
                  <div
                    key={benefit.id || idx}
                    className="p-5 rounded-xs bg-[#F7F3E8] border border-[#10110F]/15 flex flex-col justify-between space-y-4"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-[#10110F]/10">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88A32]">
                            Editing Benefit 0{idx + 1}
                          </span>
                          <button
                            onClick={() => setEditingBenefitId(null)}
                            className="text-xs text-stone-500 hover:text-stone-800"
                          >
                            Cancel
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                            Benefit Title
                          </label>
                          <input
                            type="text"
                            value={editingBenefitForm.title || ''}
                            onChange={(e) =>
                              setEditingBenefitForm({ ...editingBenefitForm, title: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={editingBenefitForm.subtitle || ''}
                              onChange={(e) =>
                                setEditingBenefitForm({ ...editingBenefitForm, subtitle: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                              Metric Tag
                            </label>
                            <input
                              type="text"
                              value={editingBenefitForm.metric || ''}
                              onChange={(e) =>
                                setEditingBenefitForm({ ...editingBenefitForm, metric: e.target.value })
                              }
                              className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={editingBenefitForm.imageUrl || ''}
                            onChange={(e) =>
                              setEditingBenefitForm({ ...editingBenefitForm, imageUrl: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#10110F] mb-0.5">
                            Description
                          </label>
                          <textarea
                            rows={3}
                            value={editingBenefitForm.description || ''}
                            onChange={(e) =>
                              setEditingBenefitForm({ ...editingBenefitForm, description: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded-xs border border-[#10110F]/20 text-xs"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => handleSaveEditBenefit(benefit.id)}
                            className="px-4 py-1.5 rounded-xs bg-[#183D27] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#10110F]"
                          >
                            <Save className="w-3.5 h-3.5 text-[#D4B66A]" />
                            <span>Save Benefit</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-24 rounded-xs overflow-hidden border border-[#10110F]/15 shrink-0 bg-black/10">
                            <img
                              src={benefit.imageUrl}
                              alt={benefit.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold text-[#183D27]">
                                PILLAR 0{idx + 1}
                              </span>
                              {benefit.metric && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-[#183D27] text-[#D4B66A] font-bold uppercase">
                                  {benefit.metric}
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-sm text-[#10110F] line-clamp-1">
                              {benefit.title}
                            </h4>
                            <p className="text-[10px] font-mono text-[#66704B] uppercase tracking-wider mb-1">
                              {benefit.subtitle}
                            </p>
                            <p className="text-xs text-[#10110F]/80 line-clamp-2 leading-relaxed">
                              {benefit.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#10110F]/10 flex items-center justify-between">
                          <span className="text-[10px] text-[#66704B] font-mono">
                            {benefit.points?.length || 0} Key Bullet Points
                          </span>
                          <button
                            onClick={() => handleStartEditBenefit(benefit)}
                            className="px-3 py-1 rounded-xs bg-[#10110F] text-[#F7F3E8] text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-[#183D27] transition-colors"
                          >
                            <Edit3 className="w-3 h-3 text-[#D4B66A]" />
                            <span>Edit Benefit</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
