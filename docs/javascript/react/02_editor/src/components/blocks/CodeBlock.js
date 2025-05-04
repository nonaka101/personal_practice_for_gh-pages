import React from 'react';
import './CodeBlock.css';

// 言語入力は BlockControls に移動したので、ここでは textarea のみ
function CodeBlock({ controlId, content, onContentChange }) {
	const handleTextChange = (event) => {
		onContentChange(event.target.value);
	};

	return (
		<div className='code-block'>
			<label htmlFor={controlId}>コード</label>
			<textarea
				id={controlId}
				value={content}
				onChange={handleTextChange}
				placeholder="コードを入力..."
				rows={5}
			/>
		</div>
	);
}

export default CodeBlock;
