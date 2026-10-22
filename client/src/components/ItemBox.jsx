// client/src/components/ItemBox.jsx - Item Box Component for Mario Kart-style Weapon Items
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { play as playSound } from '../utils/sounds';

export const WEAPON_EMOJIS = {
  Ink_Splat: '🦑',
  Smoke_Screen: '💨',
  Timer_Freeze: '⏸',
  Button_Shuffle: '🔀',
  Shield_Block: '🛡',
  Lightning_Strike: '⚡'
};

const ItemBox = ({ roomId, user, roomPlayers = [], onEffectChange, onLightningStrike }) => {
  const [offensiveSlot, setOffensiveSlot] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [showTargetSelect, setShowTargetSelect] = useState(false);
  const [activeEvents, setActiveEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Poll current inventory
  const fetchInventory = async () => {
    if (!roomId) return;
    try {
      const url = user ? `/api/rooms/${roomId}/inventory` : `/api/rooms/${roomId}/inventory?user_id=guest`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOffensiveSlot(data.offensive_slot || null);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  // Poll active weapon events
  const fetchActiveEvents = async () => {
    if (!roomId) return;
    try {
      const url = user ? `/api/rooms/${roomId}/weapons/active` : `/api/rooms/${roomId}/weapons/active?user_id=guest`;
      const res = await fetch(url);
      if (res.ok) {
        const events = await res.json();
        setActiveEvents(events);

        // Check if current user has Shield_Block and an active event targets them
        for (const event of events) {
          if (offensiveSlot === 'Shield_Block') {
            // Absorb event
            try {
              await fetch(`/api/rooms/${roomId}/weapons/${event.id}/expire`, {
                method: 'PATCH'
              });
              toast.success('Shield Activated!');
              setOffensiveSlot(null);
              break;
            } catch (e) {
              console.error('Error activating shield:', e);
            }
          }

          if (event.weapon_type === 'Lightning_Strike' && onLightningStrike) {
            onLightningStrike(3); // Reduce timer by 3s
            // Expire event after applying
            fetch(`/api/rooms/${roomId}/weapons/${event.id}/expire`, { method: 'PATCH' }).catch(() => {});
          }
        }

        if (onEffectChange) {
          const activeTypes = events.map(e => e.weapon_type);
          onEffectChange(activeTypes);
        }
      }
    } catch (err) {
      console.error('Error fetching active weapon events:', err);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchActiveEvents();

    const invInterval = setInterval(fetchInventory, 3000);
    const eventInterval = setInterval(fetchActiveEvents, 2000);

    return () => {
      clearInterval(invInterval);
      clearInterval(eventInterval);
    };
  }, [roomId, user, offensiveSlot]);

  const handleUseWeapon = async () => {
    if (!offensiveSlot || !roomId) return;

    if (offensiveSlot === 'Shield_Block') {
      toast('Shield equipped! It will absorb the next incoming weapon event.', { icon: '🛡' });
      return;
    }

    if (!showTargetSelect) {
      setShowTargetSelect(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/rooms/${roomId}/weapons/use`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: selectedTarget ? parseInt(selectedTarget, 10) : null,
          weaponType: offensiveSlot
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || 'Failed to use weapon');
      } else {
        playSound('weapon');
        toast.success(`Used ${offensiveSlot}!`);
        setOffensiveSlot(null);
        setShowTargetSelect(false);
        setSelectedTarget('');
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
      toast.error('Error using weapon');
    } finally {
      setLoading(false);
    }
  };

  const otherPlayers = roomPlayers.filter(p => !user || p.user_id !== user.id);

  return (
    <div className="item-box-card" style={{
      border: '2px solid #3498db',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: '#f0f8ff',
      textAlign: 'center',
      minWidth: '200px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Weapon Slot 🎁</h3>

      <div className="weapon-slot-display" style={{
        fontSize: '2rem',
        minHeight: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: '6px',
        border: '1px dashed #bdc3c7',
        margin: '0.5rem 0'
      }}>
        {offensiveSlot ? (
          <span>
            {WEAPON_EMOJIS[offensiveSlot] || '❓'} {offensiveSlot.replace('_', ' ')}
          </span>
        ) : (
          <span style={{ color: '#aaa', fontSize: '1rem' }}>Empty Slot</span>
        )}
      </div>

      {showTargetSelect && offensiveSlot && offensiveSlot !== 'Shield_Block' && (
        <div style={{ margin: '0.5rem 0' }}>
          <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
            Select Target:
          </label>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All / Random Target</option>
            {otherPlayers.map((p) => (
              <option key={p.user_id || p.id} value={p.user_id || p.id}>
                {p.username || `Player ${p.user_id || p.id}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        className="use-weapon-btn"
        onClick={handleUseWeapon}
        disabled={!offensiveSlot || loading}
        style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: offensiveSlot ? '#e67e22' : '#bdc3c7',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: offensiveSlot ? 'pointer' : 'not-allowed',
          width: '100%'
        }}
      >
        {loading ? 'Using...' : showTargetSelect ? 'Confirm Fire 🔥' : 'Use Weapon'}
      </button>

      {activeEvents.length > 0 && (
        <div className="active-effects-indicator" style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#c0392b' }}>
          ⚠️ Active Debuffs:
          {activeEvents.map(e => (
            <div key={e.id}>
              {WEAPON_EMOJIS[e.weapon_type]} {e.weapon_type.replace('_', ' ')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemBox;
