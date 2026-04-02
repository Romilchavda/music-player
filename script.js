async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching... Sabar rakhein...</p>";

    // Hum naya aur stable API use kar rahe hain
    const url = `https://jiosaavn-api-sigma.vercel.app/search/songs?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Data check kar rahe hain
        const songs = data.data.results || data.data;

        if (songs && songs.length > 0) {
            resultsDiv.innerHTML = ""; 
            songs.forEach(song => {
                // API ke alag-alag formats handle karne ke liye
                const title = song.name || song.song;
                const image = song.image ? (song.image[2]?.url || song.image[1]?.url) : "https://via.placeholder.com/150";
                const artist = song.artists?.primary?.[0]?.name || song.primary_artists || "Artist";
                
                // Download URL nikalna
                let downloadUrl = "";
                if(song.downloadUrl) {
                    downloadUrl = song.downloadUrl[song.downloadUrl.length - 1].url;
                } else if (song.download_url) {
                    downloadUrl = song.download_url;
                }

                if(downloadUrl) {
                    const div = document.createElement('div');
                    div.className = 'song-card';
                    div.style = "display: flex; align-items: center; background: #222; margin: 10px 0; padding: 12px; border-radius: 12px; cursor: pointer; border: 1px solid #333;";
                    div.innerHTML = `
                        <img src="${image}" style="width:50px; height:50px; border-radius:8px; margin-right:15px; object-fit: cover;">
                        <div style="flex:1; text-align:left;">
                            <p style="margin:0; font-size:14px; color:#fff;"><strong>${title}</strong></p>
                            <p style="margin:0; font-size:12px; color:#aaa;">${artist}</p>
                        </div>
                    `;
                    div.onclick = () => playSong(downloadUrl, title, image);
                    resultsDiv.appendChild(div);
                }
            });
        } else {
            resultsDiv.innerHTML = "<p>Koi gaana nahi mila. Kuch aur likhein!</p>";
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = `<p style='color:red;'>Internet ya Server Error! <br> Ek baar Flight Mode on-off karke try karein.</p>`;
    }
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    audio.src = url;
    audio.play().catch(err => alert("Play error: Chrome browser use karein."));
}