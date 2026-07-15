/* Водяной знак «Кинтас · Корешкова» на всех скачиваемых/открываемых PDF.
   Штампует бледную диагональную подпись по центру каждой страницы и тонкую
   строку в футере. Работает целиком в браузере через pdf-lib — исходные
   PDF-файлы в репозитории не меняются.

   Экспортирует window.MMM_PDF:
     stampedBlobUrl(url)  -> Promise<blobUrl>  (для печати/предпросмотра)
     download(url, name)  -> Promise<void>     (скачать с водяным знаком)
     open(url)            -> Promise<void>     (открыть во вкладке с водяным знаком)
   При любой ошибке (нет сети, не загрузился pdf-lib) — тихий откат на оригинал. */
(function () {
  var MARK = 'Кинтас · Корешкова';
  var MARK_LAT = 'KINTAS \u00B7 KORESHKOVA';
  var YEAR = new Date().getFullYear();
  // Кириллический TTF для встраивания (jsDelivr отдаёт с CORS). Кэшируется.
  var FONT_URL = 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans-Bold.ttf';
  var fontPromise = null;
  function getFontBytes() {
    if (fontPromise) return fontPromise;
    fontPromise = fetch(FONT_URL)
      .then(function (r) { if (!r.ok) throw new Error('font ' + r.status); return r.arrayBuffer(); })
      .catch(function () { return null; });
    return fontPromise;
  }

  async function stampBytes(bytes) {
    if (!window.PDFLib) return bytes;
    var L = window.PDFLib;
    var doc = await L.PDFDocument.load(bytes, { ignoreEncryption: true });
    var font = null, useCyr = false;
    try {
      var fb = await getFontBytes();
      if (fb && window.fontkit) {
        doc.registerFontkit(window.fontkit);
        font = await doc.embedFont(fb, { subset: true });
        useCyr = true;
      }
    } catch (e) { font = null; }
    if (!font) font = await doc.embedFont(L.StandardFonts.HelveticaBold);

    var mark = useCyr ? MARK : MARK_LAT;
    var foot = useCyr
      ? '\u00A9 ' + MARK + ' \u00B7 Мастерская математического мышления \u00B7 ' + YEAR
      : '(c) ' + MARK_LAT + ' \u00B7 MMM \u00B7 ' + YEAR;
    var terra = L.rgb(0.63, 0.33, 0.24);
    var ang = 30, rad = ang * Math.PI / 180;

    var pages = doc.getPages();
    for (var i = 0; i < pages.length; i++) {
      var p = pages[i];
      var s = p.getSize(), w = s.width, h = s.height;
      // Диагональная подпись по центру — крупная, очень бледная.
      var size = Math.max(18, Math.min(w, h) * 0.075);
      var tw = font.widthOfTextAtSize(mark, size);
      p.drawText(mark, {
        x: w / 2 - (tw / 2) * Math.cos(rad),
        y: h / 2 - (tw / 2) * Math.sin(rad),
        size: size, font: font, color: terra, opacity: 0.09, rotate: L.degrees(ang)
      });
      // Тонкая строка авторства в футере.
      var fs = Math.max(7, Math.min(w, h) * 0.016);
      var fw = font.widthOfTextAtSize(foot, fs);
      p.drawText(foot, {
        x: Math.max(12, w / 2 - fw / 2), y: 14,
        size: fs, font: font, color: terra, opacity: 0.5
      });
    }
    return await doc.save();
  }

  async function stampedBlobUrl(url) {
    var r = await fetch(url);
    if (!r.ok) throw new Error('http ' + r.status);
    var src = await r.arrayBuffer();
    var out = src;
    try { out = await stampBytes(src); } catch (e) { out = src; }
    return URL.createObjectURL(new Blob([out], { type: 'application/pdf' }));
  }

  async function download(url, name) {
    var obj = url, made = false;
    try { obj = await stampedBlobUrl(url); made = true; } catch (e) { obj = url; }
    var a = document.createElement('a');
    a.href = obj; a.download = name || 'document.pdf';
    document.body.appendChild(a); a.click(); a.remove();
    if (made) setTimeout(function () { URL.revokeObjectURL(obj); }, 60000);
  }

  async function openTab(url) {
    var obj = url, made = false;
    try { obj = await stampedBlobUrl(url); made = true; } catch (e) { obj = url; }
    var win = window.open(obj, '_blank', 'noopener');
    if (!win) {
      var a = document.createElement('a');
      a.href = obj; a.target = '_blank';
      document.body.appendChild(a); a.click(); a.remove();
    }
    if (made) setTimeout(function () { URL.revokeObjectURL(obj); }, 60000);
  }

  window.MMM_PDF = { stampBytes: stampBytes, stampedBlobUrl: stampedBlobUrl, download: download, open: openTab };
})();
