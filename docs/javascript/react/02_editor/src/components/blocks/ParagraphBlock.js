import React from 'react';

function ParagraphBlock({ controlId, content, onContentChange }) {
	const handleTextChange = (event) => {
		onContentChange(event.target.value);
	};

	return (
		<React.Fragment>
			<label htmlFor={controlId}>文章</label>
			<textarea
				id={controlId}
				value={content}
				onChange={handleTextChange}
				placeholder="文章を入力..."
				rows={3}
				style={{ width: '100%', minHeight: '60px', resize: 'vertical' }}
			/>
		</React.Fragment>
	);
}

export default ParagraphBlock;
