// Hum 2 alag API links use karenge, agar ek kaam na kare toh doosra chale
const primaryAPI = "https://saavn.dev/api/search/songs?query=";
const backupAPI = "https://jiosaavn-api-sigma.vercel.app/search/songs?query=";

async function searchMusic() {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query) {
        alert("Gaane ka naam likhein!");
        return;
    }

    resultsDiv.innerHTML = "<p>Loading... Gaane dhund raha hoon...</p>";

    try {
        // Pehle primary API try karte hain
        let response = await fetch(primaryAPI + query);
        
        // Agar primary fail ho toh backup try karein
        if (!response.ok) {
            response = await fetch(backupAPI + query);
        }

        const data = await response.json();
        const songs = data.data.results || data.data; // Dono API ka format handle karne ke liye

        if (songs && songs.length > 0) {
            resultsDiv.innerHTML = ""; // Loading text hatao
            songs.forEach(song => {
                // Quality links check
                const downloadUrl = song.downloadUrl ? song.downloadUrl[song.downloadUrl.length - 1].url : song.download_url;
                const image = song.image ? (song.image[2]?.url || song.image[0]?.url) : song.image_url;
                const title = song.name || song.song;
                const artist = (song.artists && song.artists.primary) ? song.artists.primary[0].name : (song.primary_artists || "Artist");

                const div = document.createElement('div');
                div.className = 'song-card';
                div.innerHTML = `
                    <img src="${image}" alt="cover" style="width:50px; border-radius:5px;">
                    <div style="flex:1; text-align:left; margin-left:15px; cursor:pointer;" onclick="playSong('${downloadUrl}', '${title.replace(/'/g, "\\'")}', '${image}')">
                        <p style="margin:0;"><strong>${title}</strong></p>
                        <small style="color:#b3b3b3;">${artist}</small>
                    </div>
                `;
                resultsDiv.appendChild(div);
            });
        } else {
            resultsDiv.innerHTML = "<p>Koi gaana nahi mila. Kuch aur search karein!</p>";
        }
    } catch (error) {
        console.error("Error details:", error);
        resultsDiv.innerHTML = `<p style="color:red;">Error: API se connect nahi ho pa raha. <br> Kripya apna Internet check karein ya thodi der baad try karein.</p>`;
        alert("API Error! Please check console or internet.");
    }
}

function playSong(url, title, img) {
    const audio = document.getElementById('audioPlayer');
    document.getElementById('trackTitle').innerText = title;
    document.getElementById('trackImage').src = img;
    
    audio.src = url;
    audio.play();
}