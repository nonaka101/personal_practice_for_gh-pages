import React from 'react';
import './BlockquoteBlock.css';

function BlockquoteBlock({ controlId, content, onContentChange }) {
	const handleTextChange = (event) => {
		onContentChange(event.target.value);
	};

	return (
		<div className='blockquote-block'>
			<label htmlFor={controlId}>引用文</label>
			<textarea
				id={controlId}
				value={content}
				onChange={handleTextChange}
				placeholder="引用文を入力..."
				rows={3}
			/>
		</div>
	);
}

export default BlockquoteBlock;
