export function generateMarkdown(title, blocks) {
  let markdown = `# ${title}\n\n`; // h1タイトル

  blocks.forEach(block => {
    switch (block.type) {
      case 'heading':
        // content が空でも見出し記号だけは出力する（空の見出しとして）
        markdown += `${'#'.repeat(block.level)} ${block.content || ''}\n\n`;
        break;
      case 'paragraph':
        markdown += `${block.content}\n\n`;
        break;
      case 'blockquote':
        // content内の改行も > で始める
        markdown += block.content.split('\n').map(line => `> ${line}`).join('\n') + '\n\n';
        break;
      case 'orderedList':
        if (block.items && block.items.length > 0) {
            block.items.forEach((item, index) => {
              markdown += `${index + 1}. ${item.content}\n`;
            });
            markdown += '\n';
        }
        break;
      case 'unorderedList':
        if (block.items && block.items.length > 0) {
					block.items.forEach(item => {
						markdown += `- ${item.content}\n`;
					});
					markdown += '\n';
        }
        break;
      case 'horizontalRule':
        markdown += '---\n\n';
        break;
      case 'code':
        markdown += `\`\`\`${block.language || ''}\n${block.content}\n\`\`\`\n\n`;
        break;
      default:
        break;
    }
  });

  // 末尾の余分な改行を削除して返す
  return markdown.replace(/\n\n$/, '\n');
}
