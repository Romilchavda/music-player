async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    // Naya message taaki pata chale naya code chal raha hai
    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching on Servers... Please wait...</p>";

    // Is link mein maine random number add kiya hai taaki error na aaye
    const url = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}&_t=${Date.now()}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Server Response Error");
        }

        const data = await response.json();
        const songs = data.data.results;

        if (songs && songs.length > 0) {
            resultsDiv.innerHTML = ""; 
            songs.forEach(song => {
                const title = song.name;
                const image = song.image[2]?.url || song.image[0]?.url;
                const artist = song.artists?.primary[0]?.name || "Artist";
                const downloadUrl = song.downloadUrl[song.downloadUrl.length - 1].url;

                const div = document.createElement('div');
                div.className = 'song-card';
                div.style = "display: flex; align-items: center; background: #282828; margin: 10px; padding: 10px; border-radius: 10px; cursor: pointer; border-bottom: 1px solid #333;";
                div.innerHTML = `
                    <img src="${image}" style="width:55px; height:55px; border-radius:5px; margin-right:15px;">
                    <div style="flex:1; text-align:left;">
                        <p style="margin:0; font-size:15px; color:white;"><strong>${title}</strong></p>
                        <p style="margin:0; font-size:13px; color:#b3b3b3;">${artist}</p>
                    </div>
                `;
                div.onclick = () => playSong(downloadUrl, title, image);
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.innerHTML = "<p>Koi gaana nahi mila. Dusra naam try karein!</p>";
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = `<p style="color:orange;">Server se contact nahi ho pa raha. <br> Thodi der baad try karein ya VPN off karein.</p>`;
    }
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    audio.src = url;
    audio.play();
}