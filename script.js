const apiURL = "https://saavn.dev/api/search/songs?query=";

async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    if (!query) {
        alert("Please enter a song name!");
        return;
    }

    try {
        const response = await fetch(apiURL + query);
        const data = await response.json();
        
        // Check if data exists
        if(data.success && data.data.results.length > 0) {
            const songs = data.data.results;
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ""; // Purane results clear karein

            songs.forEach(song => {
                // Sabse best quality link (320kbps) dhundna
                const downloadLinks = song.downloadUrl;
                const highQualityLink = downloadLinks[downloadLinks.length - 1].url; 
                const image = song.image[2]?.url || song.image[0]?.url; // High quality image

                const div = document.createElement('div');
                div.className = 'song-card';
                div.innerHTML = `
                    <img src="${image}" alt="cover">
                    <div style="flex:1; text-align:left; cursor:pointer;" onclick="playSong('${highQualityLink}', '${song.name.replace(/'/g, "\\'")}', '${image}')">
                        <p><strong>${song.name}</strong></p>
                        <small>${song.artists.primary[0].name}</small>
                    </div>
                `;
                resultsDiv.appendChild(div);
            });
        } else {
            alert("Gaana nahi mila!");
        }
    } catch (error) {
        console.error("Error fetching music:", error);
        alert("Kuch gadbad hui, firse try karein!");
    }
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    
    audio.src = url;
    audio.play();
}