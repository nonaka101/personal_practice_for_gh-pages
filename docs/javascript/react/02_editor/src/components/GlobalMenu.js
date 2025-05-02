import React from 'react';

function GlobalMenu({ title, setTitle, blocks, onExport, onSave, onNew }) { // onNew を追加
	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const headings = blocks.filter(block => block.type === 'heading');

	return (
		<div style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
			<h1>Markdown Editor</h1>
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

			{/* 操作ボタン */}
			<div style={{ marginTop: '10px' }}>
				<button onClick={onNew} style={{ marginRight: '10px', color: 'red' }}>New Document</button> {/* 新規ボタン */}
				<button onClick={onExport}>Copy Markdown</button>
				<button onClick={onSave} style={{ marginLeft: '10px' }}>Save as .md</button>
			</div>
		</div>
	);
}

export default GlobalMenu;
