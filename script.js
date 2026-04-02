async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching on 3 Servers... Please wait...</p>";

    // Hum 3 alag-alag providers try karenge
    const apiSources = [
        `https://saavn.me/search/songs?query=${encodeURIComponent(query)}`,
        `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`,
        `https://jiosaavn-api-sigma.vercel.app/search/songs?query=${encodeURIComponent(query)}`
    ];

    let foundSongs = null;

    // Ek-ek karke sabhi servers ko try karein
    for (let url of apiSources) {
        try {
            console.log("Trying: " + url);
            const response = await fetch(url);
            const data = await response.json();
            
            // Check if results exist in any format
            const songs = data.data?.results || data.data || data.results;
            
            if (songs && songs.length > 0) {
                foundSongs = songs;
                break; // Agar gaane mil gaye toh aage check mat karo
            }
        } catch (err) {
            console.log("This server failed, trying next...");
        }
    }

    if (foundSongs) {
        displayResults(foundSongs);
    } else {
        resultsDiv.innerHTML = `
            <p style='color:orange;'>Koi bhi server kaam nahi kar raha! 
            <br><br> 1. Ek baar Chrome ki Settings > Privacy > <b>Safe Browsing ko 'Standard'</b> karein. 
            <br> 2. Ya fir <b>Incognito (Private) Tab</b> mein try karein.</p>
        `;
    }
}

function displayResults(songs) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ""; 

    songs.forEach(song => {
        const title = song.name || song.song || "Unknown";
        const image = song.image?.[2]?.url || song.image?.[1]?.url || song.image_url || "";
        const artist = song.artists?.primary?.[0]?.name || song.primary_artists || "Artist";
        
        // Download URL check
        let downloadUrl = "";
        if (song.downloadUrl) {
            downloadUrl = song.downloadUrl[song.downloadUrl.length - 1].url;
        } else if (song.download_url) {
            downloadUrl = song.download_url;
        }

        if (downloadUrl) {
            const div = document.createElement('div');
            div.className = 'song-card';
            div.style = "display: flex; align-items: center; background: #222; margin: 10px 0; padding: 12px; border-radius: 12px; cursor: pointer; border: 1px solid #333;";
            div.innerHTML = `
                <img src="${image}" style="width:55px; height:55px; border-radius:8px; margin-right:15px;">
                <div style="flex:1; text-align:left;">
                    <p style="margin:0; font-size:15px; color:#fff;"><strong>${title}</strong></p>
                    <p style="margin:0; font-size:12px; color:#aaa;">${artist}</p>
                </div>
            `;
            div.onclick = () => playSong(downloadUrl, title, image);
            resultsDiv.appendChild(div);
        }
    });
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    audio.src = url;
    audio.play().catch(e => alert("Play error! Browser ne block kiya hai."));
}