async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>YouTube Music se Full Song dhoond raha hoon...</p>";

    // Hum Piped API use karenge (YouTube Music ke liye)
    // Ye block nahi hota kyunki iska naam alag hai
    const searchUrl = `https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=music_songs`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();
        const songs = data.items;

        if (songs && songs.length > 0) {
            resultsDiv.innerHTML = ""; 
            songs.forEach(song => {
                const title = song.title;
                const image = song.thumbnail;
                const artist = song.uploaderName;
                // YouTube Video ID nikalna
                const videoId = song.url.split("v=")[1];

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
                // Jab click karein toh stream link fetch karein
                div.onclick = () => getStream(videoId, title, image);
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.innerHTML = "<p>Gaana nahi mila!</p>";
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = "<p style='color:red;'>Server Busy! Ek baar phir 'Search' dabayein.</p>";
    }
}

// Full Song ka real audio link nikalne ke liye function
async function getStream(videoId, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = "Loading Full Song...";
    
    try {
        const res = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        const data = await res.json();
        
        // Sabse badhiya audio stream dhoondna
        const audioStream = data.audioStreams.find(s => s.format === 'M4A' || s.format === 'WEBm');
        const finalUrl = audioStream.url;

        document.getElementById('trackTitle').innerText = title;
        document.getElementById('trackImage').src = img;
        audio.src = finalUrl;
        audio.play();
    } catch (e) {
        alert("Ye gaana play nahi ho raha, koi dusra try karein.");
    }
}