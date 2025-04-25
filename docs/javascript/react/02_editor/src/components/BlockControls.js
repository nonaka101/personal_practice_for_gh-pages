import React from 'react';

function BlockControls({ blockId, blockType, level, onDelete, onMoveUp, onMoveDown, onLevelChange, showLevelControls }) {

  const handleLevelSelect = (e) => {
    const newLevel = parseInt(e.target.value, 10);
    if (newLevel >= 2 && newLevel <= 5) {
      onLevelChange(newLevel);
    }
  };

  return (
    <div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.8)', padding: '3px', borderRadius: '3px' }}>
      {showLevelControls && (
        <select value={level} onChange={handleLevelSelect}>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
          <option value={5}>H5</option>
        </select>
      )}
      <button onClick={onMoveUp} title="Move Up">↑</button>
      <button onClick={onMoveDown} title="Move Down">↓</button>
      <button onClick={onDelete} title="Delete Block" style={{ color: 'red' }}>X</button>
    </div>
  );
}

export default BlockControls;
