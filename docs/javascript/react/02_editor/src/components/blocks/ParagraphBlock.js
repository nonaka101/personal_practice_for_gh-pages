import React from 'react';

function ParagraphBlock({ content, onContentChange }) {
	const handleTextChange = (event) => {
		onContentChange(event.target.value);
	};

	return (
		<textarea
			value={content}
			onChange={handleTextChange}
			placeholder="文章を入力..."
			rows={3}
			style={{ width: '100%', minHeight: '60px', resize: 'vertical' }}
		/>
	);
}

export default ParagraphBlock;
