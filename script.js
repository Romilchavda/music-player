async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Pehle gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>YouTube Music se Full Song dhoond raha hoon...</p>";

    // Hum do alag-alag YouTube servers try karenge
    const servers = [
        "https://pipedapi.kavin.rocks",
        "https://pipedapi.oxymat.com"
    ];

    let success = false;

    for (let baseUrl of servers) {
        if (success) break;

        // Hum Proxy use kar rahe hain taaki Jio/Airtel block na kare
        const targetUrl = `${baseUrl}/search?q=${encodeURIComponent(query)}&filter=music_songs`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

        try {
            const response = await fetch(proxyUrl);
            const data = await response.json();
            const finalData = JSON.parse(data.contents); // Proxy data ko parse karna padta hai
            const songs = finalData.items;

            if (songs && songs.length > 0) {
                displayResults(songs, baseUrl);
                success = true;
            }
        } catch (error) {
            console.log("Server failed, trying next...");
        }
    }

    if (!success) {
        resultsDiv.innerHTML = "<p style='color:red;'>YouTube Server Busy! <br> Ek baar firse 'Search' dabayein.</p>";
    }
}

function displayResults(songs, baseUrl) {
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
        div.onclick = () => getStream(videoId, title, image, baseUrl);
        resultsDiv.appendChild(div);
    });
}

async function getStream(videoId, title, img, baseUrl) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = "Loading Full Song...";
    
    // Stream fetch karne ke liye bhi proxy use karenge
    const targetUrl = `${baseUrl}/streams/${videoId}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        const res = await fetch(proxyUrl);
        const data = await res.json();
        const finalData = JSON.parse(data.contents);
        
        // Sabse badhiya audio dhoondna
        const audioStream = finalData.audioStreams.find(s => s.format === 'M4A') || finalData.audioStreams[0];

        document.getElementById('trackTitle').innerText = title;
        document.getElementById('trackImage').src = img;
        audio.src = audioStream.url;
        audio.play();
    } catch (e) {
        alert("Ye gaana load nahi ho raha, dusra try karein.");
    }
}