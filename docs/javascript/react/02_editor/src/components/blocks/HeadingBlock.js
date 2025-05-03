import React from 'react';

function HeadingBlock({ controlId, content, level, onContentChange, onLevelChange }) {
	const handleInputChange = (event) => {
		onContentChange(event.target.value);
	};

	// レベル変更は BlockControls で行うのでここでは Input のみ
	const Tag = `h${level}`; // 表示確認用（実際は Input）

	return (
		<React.Fragment>
			<label htmlFor={controlId}>見出し（レベル：{level}）</label>
			<input
				id={controlId}
				type="text"
				value={content}
				onChange={handleInputChange}
				placeholder={`見出し ${level} テキスト`}
				style={{ fontSize: `${2.5 - (level * 0.25)}em`, fontWeight: 'bold', width: '100%' }}
			/>
		</React.Fragment>
	);
}

export default HeadingBlock;
