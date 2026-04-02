async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Searching via Proxy... Thoda intezar karein...</p>";

    // Hum API ko ek proxy ke andar lapet kar bhejenge taaki block na ho
    const targetUrl = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        // Proxy se data "contents" ke andar string ban kar aata hai, use parse karna hoga
        const finalData = JSON.parse(data.contents);
        const songs = finalData.data.results;

        if (songs && songs.length > 0) {
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
                    <img src="${image}" style="width:55px; height:55px; border-radius:8px; margin-right:15px;">
                    <div style="flex:1; text-align:left;">
                        <p style="margin:0; font-size:15px; color:#fff;"><strong>${title}</strong></p>
                        <p style="margin:0; font-size:13px; color:#aaa;">${artist}</p>
                    </div>
                `;
                div.onclick = () => playSong(downloadUrl, title, image);
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.innerHTML = "<p>Gaana nahi mila. Kuch aur try karein!</p>";
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = `<p style='color:red;'>Proxy bhi fail ho gayi! <br> Shayad aapka internet connection weak hai. <br> Ek baar WiFi try karein ya Phone Restart karein.</p>`;
    }
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    audio.src = url;
    audio.play().catch(e => alert("Play error! Try another song."));
}