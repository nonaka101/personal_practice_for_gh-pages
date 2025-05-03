import React from 'react';
import './AddBlockButton.css';

// 各 Block コンポーネント内で呼び出されるボタン
function AddBlockButton({ onClick }) {
	return (
		<button onClick={onClick} type='button' title="ブロック追加" className="add-block-button">
			<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="graphics-symbol img" aria-hidden="true">
				<rect x="4" y="20" width="40" height="8"></rect>
				<rect x="20" y="4" width="8" height="40"></rect>
			</svg>
		</button>
	);
}

export default AddBlockButton;
