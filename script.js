async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    if (!query) return alert("Gaana likhein!");

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching on Global Servers...</p>";

    try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`);
        const data = await response.json();
        resultsDiv.innerHTML = ""; 

        data.results.forEach(song => {
            const title = song.trackName;
            const artist = song.artistName;
            const image = song.artworkUrl100.replace('100x100', '500x500');
            const preview = song.previewUrl;

            const div = document.createElement('div');
            div.className = 'song-card';
            div.style = "display: flex; align-items: center; background: #222; margin: 10px 0; padding: 12px; border-radius: 12px; cursor: pointer; border: 1px solid #333;";
            div.innerHTML = `
                <img src="${image}" style="width:55px; height:55px; border-radius:8px; margin-right:15px; object-fit: cover;">
                <div style="flex:1; text-align:left;">
                    <p style="margin:0; font-size:14px; color:#fff;"><strong>${title}</strong></p>
                    <p style="margin:0; font-size:12px; color:#aaa;">${artist}</p>
                </div>
            `;
            div.onclick = () => tryFullSong(title + " " + artist, title, image, preview);
            resultsDiv.appendChild(div);
        });
    } catch (e) { resultsDiv.innerHTML = "Search failed."; }
}

async function tryFullSong(query, title, img, preview) {
    const audio = document.getElementById('audioPlayer');
    const titleTag = document.getElementById('trackTitle');
    titleTag.innerText = "Connecting to Full Song Server...";
    document.getElementById('trackImage').src = img;

    // Hum 3 alag-alag API sources try karenge
    const sources = [
        `https://saavn.me/search/songs?query=${encodeURIComponent(query)}`,
        `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`,
        `https://jiosaavn-api-sigma.vercel.app/search/songs?query=${encodeURIComponent(query)}`
    ];

    let songFound = false;

    for (let url of sources) {
        if (songFound) break;
        try {
            // Hum Proxy ka use karenge taaki Jio/Airtel block na kare
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const res = await fetch(proxyUrl);
            const json = await res.json();
            const data = JSON.parse(json.contents);
            const results = data.data.results || data.data;

            if (results && results.length > 0) {
                const s = results[0];
                const dUrl = s.downloadUrl ? s.downloadUrl[s.downloadUrl.length - 1].url : s.download_url;
                audio.src = dUrl;
                titleTag.innerText = title + " (Full Song)";
                audio.play();
                songFound = true;
            }
        } catch (err) { console.log("Trying next source..."); }
    }

    if (!songFound) {
        // Agar kuch nahi chala toh preview bajao bina alert ke
        audio.src = preview;
        titleTag.innerText = title + " (Preview Mode)";
        audio.play();
        console.log("All full song sources blocked. Playing preview.");
    }
}