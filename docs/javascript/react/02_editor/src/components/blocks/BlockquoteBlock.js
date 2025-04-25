import React from 'react';

function BlockquoteBlock({ content, onContentChange }) {
    const handleTextChange = (event) => {
        onContentChange(event.target.value);
    };

    return (
        <textarea
            value={content}
            onChange={handleTextChange}
            placeholder="引用文を入力..."
            rows={3}
            style={{ width: '100%', minHeight: '60px', resize: 'vertical', borderLeft: '3px solid #ccc', paddingLeft: '10px', fontStyle: 'italic' }}
        />
    );
}

export default BlockquoteBlock;
