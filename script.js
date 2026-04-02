async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching on Apple Servers...</p>";

    // Search hamesha iTunes se karein kyunki ye block nahi hota
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=15`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        const songs = data.results;

        if (songs && songs.length > 0) {
            resultsDiv.innerHTML = ""; 
            songs.forEach(song => {
                const title = song.trackName;
                const artist = song.artistName;
                const image = song.artworkUrl100.replace('100x100', '500x500');
                const preview = song.previewUrl; // 30-sec backup link

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
                // Click par pehle full song try karega, fail hua toh 30-sec preview bajega
                div.onclick = () => playFullOrPreview(title + " " + artist, title, image, preview);
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.innerHTML = "<p>Gaana nahi mila!</p>";
        }
    } catch (error) {
        resultsDiv.innerHTML = "<p style='color:red;'>Search failed. Network issues.</p>";
    }
}

async function playFullOrPreview(query, title, img, preview) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = "Unlocking Full Song...";
    document.getElementById('trackImage').src = img;

    // JioSaavn API URL
    const saavnUrl = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`;
    
    // Sabse important: Hum PROXY use karenge taaki Jio/Airtel block na kar sake
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(saavnUrl)}`;

    try {
        const res = await fetch(proxyUrl);
        const data = await res.json();
        const finalData = JSON.parse(data.contents); // Proxy se data 'contents' mein aata hai
        
        const song = finalData.data.results[0];
        
        if (song) {
            const fullUrl = song.downloadUrl[song.downloadUrl.length - 1].url;
            audio.src = fullUrl;
            document.getElementById('trackTitle').innerText = title + " (Full)";
            audio.play();
        } else {
            throw new Error("No full song");
        }
    } catch (e) {
        // Agar Full song block ho gaya toh Apple ka 30-sec Preview bajao
        console.log("Playing preview as fallback...");
        audio.src = preview;
        document.getElementById('trackTitle').innerText = title + " (Preview Only)";
        audio.play();
        alert("Full song server block hai, abhi preview baj raha hai. DNS check karein!");
    }
}