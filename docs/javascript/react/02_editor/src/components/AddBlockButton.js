import React from 'react';

// 各 Block コンポーネント内で呼び出されるボタン
function AddBlockButton({ onClick }) {
	return (
		<div style={{ textAlign: 'center', margin: '5px 0' }}>
			<button onClick={onClick} title="Add Block Below">+</button>
		</div>
	);
}

export default AddBlockButton;
