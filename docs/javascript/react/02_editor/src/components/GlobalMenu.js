import React from 'react';
import './GlobalMenu.css';

function GlobalMenu({ title, setTitle, blocks, onExport, onSave, onNew }) { // onNew を追加
	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const headings = blocks.filter(block => block.type === 'heading');

	return (
		<React.Fragment>
			<header className='header'>
				<h1>{title}</h1>
				<button
					type="button"
					className='icon-button'
					aria-controls="global-menu"
					onClick={() => document.getElementById('global-menu').showModal()}
				>
					<svg role="graphics-symbol img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M21 5.5H3V7H21V5.5ZM21 11.2998H3V12.7998H21V11.2998ZM3 17H21V18.5H3V17Z"></path>
					</svg>
					メニュー
				</button>
				<dialog id='global-menu' className='menu-dialog'>
					<div className='menu-dialog-body'>
						<div className='menu-dialog-header'>
							<h2>メニュー</h2>
							<button
								type="button"
								className='icon-button'
								onClick={() => document.getElementById('global-menu').close()}
							>
								<svg role="graphics-symbol img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
									<path stroke-width="1.4286" d="M 22,4.0142857 19.985715,2 12,9.9857149 4.0142857,2 2,4.0142857 9.9857149,12 2,19.985715 4.0142857,22 12,14.014286 19.985715,22 22,19.985715 14.014286,12 Z"></path>
								</svg>
								閉じる
							</button>
						</div>
						<div>
							<label htmlFor="doc-title">Document Title (H1): </label>
							<input
								id="doc-title"
								type="text"
								value={title}
								onChange={handleTitleChange}
								style={{ fontSize: '1.5em', width: '50%' }}
							/>
						</div>

						{/* 操作ボタン */}
						<div>
							<button onClick={onNew}>新規作成</button>
							<button onClick={onExport}>クリップボードにコピー</button>
							<button onClick={onSave}>名前をつけて保存</button>
						</div>

						{/* 見出しジャンプ */}
						{headings.length > 0 && (
							<div style={{ marginTop: '10px' }}>
								<strong>Outline:</strong>
								<ul>
									{headings.map(heading => (
										<li key={heading.id}>
											<a href={`#block-${heading.id}`}>
												{/* レベルに応じてインデント */}
												<span style={{ paddingLeft: `${(heading.level - 2) * 15}px` }}>
													{heading.content || '(empty heading)'} (h{heading.level})
												</span>
											</a>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</dialog>
			</header>
			{/* コンテンツがヘッダーに隠れてしまうのを防止 */}
			<div className='header-spacer'></div>
		</React.Fragment>
	);
}

export default GlobalMenu;
