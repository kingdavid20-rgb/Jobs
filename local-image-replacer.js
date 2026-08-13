// local-image-replacer.js
// Maps local image files to product names heuristically and replaces external images.
(function(){
    const localImages = [
        'crocs.jpg', 'calf (5).jpg', 'Leather.jpg', 'Leather (32).jpg', 'Leather(37).jpg', 'Leather(40).jpg',
        'Leather (32).jpg','Leather(40).jpg','Leather(37).jpg','images (18).jpg','images (19).jpg','images (20).jpg',
        'images (21).jpg','images (22).jpg','images (23).jpg','images (25).jpg','images (26).jpg','images (27).jpg','images (28).jpg','images (29).jpg','images (30).jpg','images (33).jpg','images(35).jpg','images(36).jpg','images(38).jpg','images(39).jpg','images(41).jpg',
        'download (6).jpg','download (8).jpg','download (9).jpg','download (10).jpg','download (11).jpg','download (12).jpg','download (13).jpg','download (14).jpg','download (15).jpg','download (16).jpg',
        'Skin.jpg','Skin (4).jpg','Skin (24).jpg','skin (2).jpg','skin (3).jpg','Skin(34).jpg','calf (5).jpg','Leather (32).jpg'
    ].filter(Boolean);

    let rotateIndex = 0;
    function norm(s){ return (s||'').toLowerCase().replace(/[^a-z0-9]+/g,' '); }

    function getLocalImage(name, fallback){
        const n = norm(name || '');
        // try exact keyword matches
        for (let f of localImages) {
            const fn = norm(f);
            const tokens = n.split(' ');
            for (let t of tokens) {
                if (t && fn.includes(t)) return encodeURI(f);
                // partial matches for 'croc' -> crocs.jpg
                if (t && (t.startsWith('croc') && fn.includes('croc'))) return encodeURI('crocs.jpg');
                if (t && (t.includes('skin') && fn.includes('skin'))) return encodeURI(f);
                if (t && (t.includes('leather') && fn.includes('leather'))) return encodeURI(f);
            }
        }
        // fallback: return rotating image
        const file = localImages[rotateIndex % localImages.length];
        rotateIndex++;
        return encodeURI(file);
    }

    function replaceExternalImages(){
        document.querySelectorAll('img').forEach(img => {
            try{
                const src = img.getAttribute('src') || '';
                if (src.includes('images.unsplash.com') || src.startsWith('http')){
                    const alt = img.getAttribute('alt') || '';
                    const local = getLocalImage(alt || src, src);
                    img.setAttribute('src', local);
                }
            }catch(e){/* ignore */}
        });
    }

    // expose for pages
    window.getLocalImage = getLocalImage;
    window.replaceExternalImages = replaceExternalImages;

    // run once DOM ready
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', replaceExternalImages);
    else replaceExternalImages();
})();
