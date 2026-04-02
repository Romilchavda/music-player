async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p style='color: #1db954;'>Naye server se connect ho raha hoon...</p>";

    // NAYA SERVER LINK (saavn.dev ki jagah ye use karein)
    const url = `https://jiosaavn-api-sigma.vercel.app/search/songs?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        const resData = await response.json();
        
        // Is API ka data format thoda alag ho sakta hai
        const songs = resData.data.results || resData.data;

        if (songs && songs.length > 0) {
            resultsDiv.innerHTML = ""; 
            songs.forEach(song => {
                const title = song.name || song.title;
                const image = song.image[2]?.url || song.image[1]?.url || song.image[0]?.url;
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
            resultsDiv.innerHTML = "<p>Gaana nahi mila. Kuch aur try karein!</p>";
        }
    } catch (error) {
        console.error(error);
        resultsDiv.innerHTML = `<p style='color:red;'>Naya server bhi block hai! <br> Bhai, aapka internet API block kar raha hai.</p>`;
    }
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    audio.src = url;
    audio.play().catch(e => alert("Play error! Try another song."));
}