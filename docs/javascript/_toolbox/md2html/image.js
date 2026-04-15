// 画像の縮小表示とクリック拡大ダイアログ
document.addEventListener('DOMContentLoaded', function () {
  // 1. すべてのimgタグにスタイルを適用
  document.querySelectorAll('img').forEach(function(img) {
    img.style.maxHeight = '50dvh';
    img.style.maxWidth = '50dvw';
    img.style.cursor = 'pointer';
    img.style.transition = 'box-shadow 0.2s';
    img.classList.add('copilot-img-zoomable');
  });

  // 2. ダイアログ生成用の関数
  function showImageDialog(src, alt) {
    // 既存ダイアログがあれば削除
    let oldDialog = document.getElementById('copilot-img-dialog');
    if (oldDialog) oldDialog.remove();

    // ダイアログ要素作成
    const dialog = document.createElement('dialog');
    dialog.id = 'copilot-img-dialog';
    dialog.style.padding = '0';
    dialog.style.border = 'none';
    dialog.style.background = 'rgba(0,0,0,0.7)';
    dialog.style.maxWidth = '98vw';
    dialog.style.maxHeight = '98vh';
    dialog.style.cursor = 'zoom-out';

    // 画像要素作成
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.style.display = 'block';
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.margin = 'auto';
    img.style.boxShadow = '0 0 16px #000';

    dialog.appendChild(img);
    document.body.appendChild(dialog);

    // ダイアログを開く
    dialog.showModal();

    // ダイアログ外クリック・Escキーで閉じる
    dialog.addEventListener('click', function(e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function() {
      dialog.remove();
    });
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        dialog.close();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  // 3. 画像クリックでダイアログ表示
  document.querySelectorAll('img.copilot-img-zoomable').forEach(function(img) {
    img.addEventListener('click', function(e) {
      showImageDialog(img.src, img.alt);
      e.stopPropagation();
    });
  });
});