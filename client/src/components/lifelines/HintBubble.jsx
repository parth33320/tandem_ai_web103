// client/src/components/lifelines/HintBubble.jsx - Database Hint Provider Button
import React, { useState } from 'react';

const HintBubble = ({ roomId, wordData, direction = 'cn_to_jp', onActivate, disabled, used }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || used || loading || !wordData) return;

    setLoading(true);
    try {
      if (roomId) {
        const res = await fetch(`/api/rooms/${roomId}/lifelines/use`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lifelineType: 'Hint_Provider' })
        });
        if (!res.ok) {
          console.error('Failed to use Hint_Provider lifeline');
          setLoading(false);
          return;
        }
      }

      // Determine direction note
      const isCnToJp = direction === 'cn_jp' || direction === 'cn_to_jp' || direction.startsWith('cn');
      const rawHint = isCnToJp ? wordData.jp_meaning_note : wordData.zh_meaning_note;
      const hintText = (rawHint && rawHint.trim()) ? rawHint.trim() : 'No hint available for this word.';

      onActivate(hintText);
    } catch (err) {
      console.error('Error executing Hint_Provider lifeline:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="lifeline-btn hint-btn"
      onClick={handleClick}
      disabled={disabled || used || loading}
      style={{
        padding: '0.5rem 0.75rem',
        backgroundColor: disabled || used ? '#bdc3c7' : '#3498db',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: disabled || used ? 'not-allowed' : 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s'
      }}
    >
      {loading ? '...' : 'Hint 💡'}
    </button>
  );
};

export default HintBubble;
