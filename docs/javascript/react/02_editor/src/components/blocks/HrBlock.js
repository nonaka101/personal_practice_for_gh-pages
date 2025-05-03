import React from 'react';
import './HrBlock.css';

function HrBlock() {
	// 操作は BlockControls で行うので、ここでは表示のみ
	return(
		<div className='hr-block'>
			{/* 他のブロックと違い、ラベル的なテキストはAOM上から除去（繰り返しになるだけなので） */}
			<span aria-hidden="true">区切り線</span>
			<hr />
		</div>
	);
}

export default HrBlock;
