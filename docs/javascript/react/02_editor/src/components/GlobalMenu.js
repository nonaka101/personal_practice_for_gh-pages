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
						<div className='menu-dialog-content'>
							<h3>ドキュメント設定</h3>
							<div className='menu-dialog-input'>
								<label htmlFor="doc-title">文書タイトル</label>
								<input
									id="doc-title"
									type="text"
									value={title}
									onChange={handleTitleChange}
								/>
							</div>
						</div>

						{/* 操作ボタン */}
						<div className='menu-dialog-content'>
							<h3>操作</h3>
							<div className='menu-dialog-buttons'>
								<button onClick={onNew}>新規作成</button>
								<button onClick={onExport}>クリップボードにコピー</button>
								<button onClick={onSave}>名前をつけて保存</button>
							</div>
							<div className='menu-dialog-input'>
								<label for="color-mode">
									カラーモード
								</label>
								<select name="color-mode" id="color-mode">
									<option value="0">デフォルト</option>
									<option value="1">ライト</option>
									<option value="2">ダーク</option>
								</select>
							</div>
						</div>

						{/* 見出しジャンプ */}
						{headings.length > 0 && (
							<div className='menu-dialog-content'>
								<h3>見出しジャンプ</h3>
								<ul className='menu-dialog-list'>
									{headings.map(heading => (
										<li key={heading.id}>
											<a className='menu-dialog-link' href={`#block-${heading.id}`}>
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
			{/* 以降のコンテンツがヘッダーに隠れてしまうのを防止 */}
			<div className='header-spacer'></div>
		</React.Fragment>
	);
}

export default GlobalMenu;
