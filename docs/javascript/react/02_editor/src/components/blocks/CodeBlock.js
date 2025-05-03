import React from 'react';

// 言語入力は BlockControls に移動したので、ここでは textarea のみ
function CodeBlock({ controlId, content, onContentChange }) {
	const handleTextChange = (event) => {
		onContentChange(event.target.value);
	};

	return (
		<React.Fragment>
			<label htmlFor={controlId}>コード</label>
			<textarea
				id={controlId}
				value={content}
				onChange={handleTextChange}
				placeholder="コードを入力..."
				rows={5}
				style={{
					width: '100%',
					minHeight: '80px',
					resize: 'vertical',
					fontFamily: 'monospace',
					backgroundColor: '#f5f5f5',
					border: '1px solid #ccc',
					padding: '10px',
					marginTop: '5px', // コントロールとの間に少しマージン
				}}
			/>
		</React.Fragment>
	);
}

export default CodeBlock;
