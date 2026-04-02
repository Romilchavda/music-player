// Hum 3 alag-alag servers ki list rakhenge
const servers = [
    "https://pipedapi.kavin.rocks",
    "https://pipedapi.oxymat.com",
    "https://piped-api.lunar.icu"
];

let currentServer = servers[0];

async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching on YouTube Server... Ek pal rukein...</p>";

    let success = false;

    // Ek-ek karke servers try karenge
    for (let server of servers) {
        try {
            const response = await fetch(`${server}/search?q=${encodeURIComponent(query)}&filter=music_songs`);
            if (!response.ok) throw new Error("Next server please");

            const data = await response.json();
            const songs = data.items;

            if (songs && songs.length > 0) {
                currentServer = server; // Jo server chal gaya use yaad rakho
                displayResults(songs);
                success = true;
                break; 
            }
        } catch (err) {
            console.log("Server failed, trying next...");
        }
    }

    if (!success) {
        resultsDiv.innerHTML = "<p style='color:red;'>Sabhi servers busy hain! <br> Ek baar firse 'Search' button dabayein.</p>";
    }
}

function displayResults(songs) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ""; 

    songs.forEach(song => {
        const title = song.title;
        const image = song.thumbnail;
        const artist = song.uploaderName;
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
        div.onclick = () => getStream(videoId, title, image);
        resultsDiv.appendChild(div);
    });
}

async function getStream(videoId, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = "Loading Full Song...";
    
    try {
        const res = await fetch(`${currentServer}/streams/${videoId}`);
        const data = await res.json();
        
        // M4A format sabse badhiya hota hai mobile ke liye
        const audioStream = data.audioStreams.find(s => s.format === 'M4A') || data.audioStreams[0];
        const finalUrl = audioStream.url;

        document.getElementById('trackTitle').innerText = title;
        document.getElementById('trackImage').src = img;
        audio.src = finalUrl;
        audio.play();
    } catch (e) {
        alert("Ye gaana load nahi ho paya, doosra try karein.");
        document.getElementById('trackTitle').innerText = "Error playing song";
    }
}