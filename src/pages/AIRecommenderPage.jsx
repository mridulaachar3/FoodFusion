import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/ui/Layout';
import { useCart } from '../context/CartContext';

const MOODS = [
  { emoji: '🌶️', label: 'Spicy & Bold' },
  { emoji: '😌', label: 'Light & Healthy' },
  { emoji: '🎉', label: 'Party Mode' },
  { emoji: '😴', label: 'Comfort Food' },
  { emoji: '⚡', label: 'Quick & Easy' },
  { emoji: '💰', label: 'Budget Friendly' },
];

function AIRecommenderPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleMoodClick = (mood) => {
    setSelectedMood(mood.label);
    setPrompt(mood.label);
  };

  const handleRecommend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setRecommendations(null);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, menuItems }),
      });

      const parsed = await response.json();
      if (parsed.error) throw new Error(parsed.error);

      const enriched = parsed.recommendations.map(rec => {
        const found = menuItems.find(m => m.id === rec.id || m.name.toLowerCase() === rec.name.toLowerCase());
        return { ...rec, ...found, reason: rec.reason, emoji: rec.emoji };
      }).filter(r => r.id);

      setRecommendations({ ...parsed, recommendations: enriched });
    } catch (err) {
      console.error('AI error:', err);
      setRecommendations({ error: 'Something went wrong. Please try again!' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <Layout>
      <div style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fde8d8 100%)', minHeight: '100vh' }}>
        <div className="container-custom py-12">

          {/* Header */}
          <div className="text-center mb-10">
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤖</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1c1917', marginBottom: '0.5rem' }}>
              AI Food Recommender
            </h1>
            <p style={{ color: '#78716c', fontSize: '1.1rem' }}>
              Tell us your mood and we'll find the perfect dish for you
            </p>
          </div>

          {/* Mood Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {MOODS.map(mood => (
              <button
                key={mood.label}
                onClick={() => handleMoodClick(mood)}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: '9999px',
                  border: selectedMood === mood.label ? '2px solid #f97316' : '2px solid #e5e7eb',
                  background: selectedMood === mood.label ? '#fff7ed' : 'white',
                  color: selectedMood === mood.label ? '#f97316' : '#374151',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s',
                }}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '1.5rem' }}>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Describe your mood, craving, or occasion... e.g. 'I'm exhausted after work and want something warm and comforting'"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '1rem',
                  color: '#1c1917',
                  fontFamily: 'inherit',
                  marginBottom: '1rem',
                }}
              />
              <div className="flex justify-between items-center">
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  {menuLoading ? 'Loading menu...' : `${menuItems.length} items available`}
                </span>
                <button
                  onClick={handleRecommend}
                  disabled={loading || !prompt.trim() || menuLoading}
                  style={{
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f97316, #ef4444)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 2rem',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? '🤔 Thinking...' : '✨ Get Recommendations'}
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🍕</div>
              <p style={{ color: '#78716c', fontWeight: '600' }}>
                Our AI is browsing the menu for you...
              </p>
            </div>
          )}

          {/* Error */}
          {recommendations?.error && (
            <div className="max-w-2xl mx-auto">
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', color: '#dc2626' }}>
                {recommendations.error}
              </div>
            </div>
          )}

          {/* Results */}
          {recommendations && !recommendations.error && (
            <div className="max-w-3xl mx-auto">

              {/* AI Message */}
              <div style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                borderLeft: '4px solid #f97316',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🤖</span>
                  <p style={{ color: '#1c1917', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                    {recommendations.message}
                  </p>
                </div>
              </div>

              {/* Food Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {recommendations.recommendations.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    animation: `fadeInUp 0.4s ease ${idx * 0.15}s both`,
                  }}>
                    {item.image && (
                      <div style={{ height: '160px', overflow: 'hidden' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1c1917', margin: 0 }}>
                          {item.emoji} {item.name}
                        </h3>
                        <span style={{ color: '#f97316', fontWeight: '700', fontSize: '1rem' }}>
                          ${Number(item.price).toFixed(2)}
                        </span>
                      </div>
                      <p style={{ color: '#78716c', fontSize: '0.875rem', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                        {item.reason}
                      </p>
                      {item.vendorName && (
                        <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                          By {item.vendorName}
                        </p>
                      )}
                      <button
                        onClick={() => handleAddToCart(item)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #f97316, #ef4444)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          padding: '0.6rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                        }}
                      >
                        + Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tip */}
              {recommendations.tip && (
                <div style={{
                  background: 'linear-gradient(135deg, #fff7ed, #fef3c7)',
                  borderRadius: '1rem',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>💡</span>
                  <p style={{ color: '#92400e', margin: 0, fontWeight: '500' }}>{recommendations.tip}</p>
                </div>
              )}

              {/* View Cart */}
              <div className="text-center mt-6">
                <button
                  onClick={() => navigate('/cart')}
                  style={{
                    background: 'white',
                    border: '2px solid #f97316',
                    color: '#f97316',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 2rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  🛒 View Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}

export default AIRecommenderPage;
