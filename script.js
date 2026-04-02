async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching on Global Servers...</p>";

    // Hum Apple ke server se search karenge kyunki ye block nahi hota
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
                // Jab click karein toh Saavn se full song dhoondhein
                div.onclick = () => findFullSong(title + " " + artist, title, image);
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.innerHTML = "<p>Gaana nahi mila!</p>";
        }
    } catch (error) {
        resultsDiv.innerHTML = "<p style='color:red;'>Network Blocked! Check DNS Settings.</p>";
    }
}

// Ye function Apple ke gaane ko Saavn ke full song link se jodega
async function findFullSong(query, title, img) {
    document.getElementById('trackTitle').innerText = "Fetching Full Song...";
    const audio = document.getElementById('audioPlayer');

    // Hum 2 alag mirrors try karenge
    const apiUrls = [
        `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`,
        `https://jiosaavn-api-sigma.vercel.app/search/songs?query=${encodeURIComponent(query)}`
    ];

    let found = false;
    for(let url of apiUrls) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            const song = data.data.results[0] || data.data[0];
            
            if(song) {
                const downloadUrl = song.downloadUrl ? song.downloadUrl[song.downloadUrl.length - 1].url : song.download_url;
                document.getElementById('trackTitle').innerText = title;
                document.getElementById('trackImage').src = img;
                audio.src = downloadUrl;
                audio.play();
                found = true;
                break;
            }
        } catch(e) { continue; }
    }

    if(!found) {
        alert("Full song server block hai. Please follow Step 2 (DNS) below!");
    }
}