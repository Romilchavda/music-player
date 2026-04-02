async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Pehle gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching via Super-Proxy... Please wait...</p>";

    // Hum do alag-alag proxy aur server try karenge ek saath
    // Sabse stable link:
    const targetUrl = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Proxy Error");

        const resData = await response.json();
        
        // Data format check
        if (resData && resData.data && resData.data.results.length > 0) {
            const songs = resData.data.results;
            resultsDiv.innerHTML = ""; 

            songs.forEach(song => {
                const title = song.name;
                const image = song.image[2]?.url || song.image[0]?.url;
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
            resultsDiv.innerHTML = "<p>Gaana nahi mila. Dusra naam try karein!</p>";
        }
    } catch (error) {
        console.error("Debug Error:", error);
        resultsDiv.innerHTML = `
            <p style='color:orange;'>Abhi bhi block ho raha hai! :(</p>
            <button onclick="checkDirectLink()" style="padding:10px; background:#1db954; color:white; border:none; border-radius:5px;">Check Server Status</button>
        `;
    }
}

// Ye function check karega ki server aapke mobile par zinda hai ya nahi
function checkDirectLink() {
    window.open("https://saavn.dev/api/search/songs?query=makhna", "_blank");
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    audio.src = url;
    audio.play().catch(e => alert("Play error! Song link expired or blocked."));
}