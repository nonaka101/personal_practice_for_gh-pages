import React from 'react';

function BlockControls({
	blockId, blockType, level, language, // language を追加
	onDelete, onMoveUp, onMoveDown,
	onLevelChange, onLanguageChange, // onLanguageChange を追加
	showLevelControls, showLanguageInput // showLanguageInput を追加
}) {

	const handleLevelSelect = (e) => {
		const newLevel = parseInt(e.target.value, 10);
		if (newLevel >= 2 && newLevel <= 5) {
			onLevelChange(newLevel);
		}
	};

	const handleLanguageInputChange = (e) => {
		onLanguageChange(e.target.value);
	}

	return (
		<div style={{ position: 'absolute', top: '5px', right: '5px', display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,0.8)', padding: '3px', borderRadius: '3px' }}>
			{/* 見出しレベル選択 */}
			{showLevelControls && (
				<select value={level} onChange={handleLevelSelect} title="見出しレベル">
					<option value={2}>H2</option>
					<option value={3}>H3</option>
					<option value={4}>H4</option>
					<option value={5}>H5</option>
				</select>
			)}
			{/* コード言語入力 */}
			{showLanguageInput && (
				<input
					type="text"
					value={language || ''}
					onChange={handleLanguageInputChange}
					placeholder="language"
					title="コード言語"
					size="10" // 少し小さめに
					style={{ marginLeft: '5px' }}
				/>
			)}
			{/* 移動・削除ボタン */}
			<button onClick={onMoveUp} title="Move Up">↑</button>
			<button onClick={onMoveDown} title="Move Down">↓</button>
			<button onClick={onDelete} title="Delete Block" style={{ color: 'red' }}>X</button>
		</div>
	);
}

export default BlockControls;
