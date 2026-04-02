// Hum direct search query use karenge
async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching... Please wait...</p>";

    // Hum 2 alag-alag API endpoints try karenge
    const apiUrls = [
        `https://saavn.dev/api/search/songs?query=${query}`,
        `https://jiosaavn-api-sigma.vercel.app/search/songs?query=${query}`
    ];

    let success = false;

    for (let url of apiUrls) {
        if (success) break;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network issues");
            
            const data = await response.json();
            const songs = data.data.results || data.data;

            if (songs && songs.length > 0) {
                displayResults(songs);
                success = true;
            }
        } catch (error) {
            console.log("Ek API fail hui, doosri try kar raha hoon...");
        }
    }

    if (!success) {
        resultsDiv.innerHTML = "<p style='color:red;'>Nahi mila! Try: <br> 1. Internet check karein. <br> 2. Spelling check karein. <br> 3. VPN band karein agar on hai.</p>";
    }
}

function displayResults(songs) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ""; 

    songs.forEach(song => {
        // Image aur Name nikalna (Alag API mein alag naam hote hain)
        const title = song.name || song.song || "Unknown Song";
        const image = song.image ? (song.image[2]?.url || song.image[0]?.url) : "https://via.placeholder.com/50";
        const artist = song.artists?.primary?.[0]?.name || song.primary_artists || "Artist";
        
        // Sabse best quality MP3 link
        let downloadUrl = "";
        if (song.downloadUrl) {
            downloadUrl = song.downloadUrl[song.downloadUrl.length - 1].url;
        } else if (song.download_url) {
            downloadUrl = song.download_url;
        }

        if (downloadUrl) {
            const div = document.createElement('div');
            div.className = 'song-card';
            div.style = "display: flex; align-items: center; background: #282828; margin: 10px; padding: 10px; border-radius: 10px; cursor: pointer;";
            div.innerHTML = `
                <img src="${image}" style="width:50px; height:50px; border-radius:5px; margin-right:15px;">
                <div style="flex:1; text-align:left;">
                    <p style="margin:0; font-size:14px;"><strong>${title}</strong></p>
                    <p style="margin:0; font-size:12px; color:#b3b3b3;">${artist}</p>
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
    audio.play().catch(e => alert("Play nahi ho paya, link expire ho gaya shayad."));
}