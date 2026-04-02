async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Wait... Gaane dhoond raha hoon...</p>";

    // Naya Stable API Link (No Proxy Needed)
    const url = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Server down");

        const resData = await response.json();
        const songs = resData.data.results;

        if (songs && songs.length > 0) {
            resultsDiv.innerHTML = ""; 
            songs.forEach(song => {
                const title = song.name;
                const image = song.image[2]?.url || song.image[1]?.url;
                const artist = song.artists?.primary[0]?.name || "Artist";
                const downloadUrl = song.downloadUrl[song.downloadUrl.length - 1].url;

                const div = document.createElement('div');
                div.className = 'song-card';
                div.style = "display: flex; align-items: center; background: #222; margin: 10px 0; padding: 12px; border-radius: 12px; cursor: pointer; border: 1px solid #333;";
                div.innerHTML = `
                    <img src="${image}" style="width:55px; height:55px; border-radius:8px; margin-right:15px; background:#333;">
                    <div style="flex:1; text-align:left;">
                        <p style="margin:0; font-size:15px; color:#fff;"><strong>${title}</strong></p>
                        <p style="margin:0; font-size:12px; color:#aaa;">${artist}</p>
                    </div>
                `;
                div.onclick = () => playSong(downloadUrl, title, image);
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.innerHTML = "<p>Koi gaana nahi mila. Spelling check karein!</p>";
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = `<p style='color:red;'>Error: Server connect nahi ho raha. <br> 1. Apna Internet check karein. <br> 2. Chrome browser hi use karein.</p>`;
    }
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    audio.src = url;
    audio.play().catch(e => alert("Play error: Browser setting allow nahi kar rahi."));
}