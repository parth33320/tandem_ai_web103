// client/src/components/LifelinePanel.jsx - Lifeline Panel Component
import React, { useState, useEffect } from 'react';
import FiftyFiftyBtn from './lifelines/FiftyFiftyBtn';
import HintBubble from './lifelines/HintBubble';
import ExpertChart from './lifelines/ExpertChart';

const LIFELINE_EMOJIS = {
  Fifty_Fifty: '✂️ 50:50',
  Hint_Provider: '💡 Hint',
  Expert_Advice: '📊 Expert'
};

const LifelinePanel = ({
  roomId,
  user,
  wordData,
  direction = 'cn_to_jp',
  onFiftyFifty,
  onHint,
  onExpert,
  usedLifelines = {},
  singlePlayerLifelines = { Fifty_Fifty: true, Hint_Provider: true, Expert_Advice: true }
}) => {
  const [passiveSlot, setPassiveSlot] = useState(null);

  // Poll current inventory if in room mode
  const fetchInventory = async () => {
    if (!roomId) return;
    try {
      const url = user ? `/api/rooms/${roomId}/inventory` : `/api/rooms/${roomId}/inventory?user_id=guest`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPassiveSlot(data.passive_slot || null);
      }
    } catch (err) {
      console.error('Error fetching lifeline inventory:', err);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchInventory();
      const interval = setInterval(fetchInventory, 3000);
      return () => clearInterval(interval);
    }
  }, [roomId, user]);

  const handleFiftyFiftyActivate = (hiddenIndexes) => {
    if (roomId) setPassiveSlot(null);
    if (onFiftyFifty) onFiftyFifty(hiddenIndexes);
  };

  const handleHintActivate = (hintText) => {
    if (roomId) setPassiveSlot(null);
    if (onHint) onHint(hintText);
  };

  const handleExpertActivate = (expertWeights) => {
    if (roomId) setPassiveSlot(null);
    if (onExpert) onExpert(expertWeights);
  };

  // Determine if each lifeline button should be enabled
  const isFiftyFiftyEnabled = roomId
    ? passiveSlot === 'Fifty_Fifty' && !usedLifelines.Fifty_Fifty
    : singlePlayerLifelines.Fifty_Fifty && !usedLifelines.Fifty_Fifty;

  const isHintEnabled = roomId
    ? passiveSlot === 'Hint_Provider' && !usedLifelines.Hint_Provider
    : singlePlayerLifelines.Hint_Provider && !usedLifelines.Hint_Provider;

  const isExpertEnabled = roomId
    ? passiveSlot === 'Expert_Advice' && !usedLifelines.Expert_Advice
    : singlePlayerLifelines.Expert_Advice && !usedLifelines.Expert_Advice;

  return (
    <div className="lifeline-panel-card" style={{
      border: '2px solid #9b59b6',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: '#fbf7ff',
      textAlign: 'center',
      minWidth: '200px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#8e44ad' }}>
        Passive Lifelines 🧠
      </h3>

      {roomId && (
        <div className="passive-slot-display" style={{
          fontSize: '0.9rem',
          minHeight: '35px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px dashed #bdc3c7',
          marginBottom: '0.75rem',
          fontWeight: 'bold',
          color: passiveSlot ? '#2c3e50' : '#888'
        }}>
          {passiveSlot ? (
            <span>Held: {LIFELINE_EMOJIS[passiveSlot] || passiveSlot}</span>
          ) : (
            <span>Empty Slot</span>
          )}
        </div>
      )}

      <div className="lifeline-buttons-row" style={{
        display: 'flex',
        justify: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
      }}>
        <FiftyFiftyBtn
          roomId={roomId}
          wordData={wordData}
          onActivate={handleFiftyFiftyActivate}
          disabled={!isFiftyFiftyEnabled}
          used={usedLifelines.Fifty_Fifty}
        />

        <HintBubble
          roomId={roomId}
          wordData={wordData}
          direction={direction}
          onActivate={handleHintActivate}
          disabled={!isHintEnabled}
          used={usedLifelines.Hint_Provider}
        />

        <ExpertChart
          roomId={roomId}
          wordData={wordData}
          onActivate={handleExpertActivate}
          disabled={!isExpertEnabled}
          used={usedLifelines.Expert_Advice}
        />
      </div>
    </div>
  );
};

export default LifelinePanel;
