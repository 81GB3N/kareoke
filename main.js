let selectedSong = {};

      async function searchSuggestions() {

         const songTitleInput = document.getElementById('songTitle');
         const artistInput = document.getElementById('artist');
         const suggestionsList = document.getElementById('suggestions');

        artistInput.value = '';

         const query = songTitleInput.value;

         if (!query) {
            suggestionsList.innerHTML = '';
            return;
         }

         try {
            const response = await fetch(`https://api.lyrics.ovh/suggest/${query}`);
            const data = await response.json();

            if (data.data) {
               const suggestions = data.data; // Limit suggestions to the first 5 results

               suggestionsList.innerHTML = '';
               suggestions.forEach(suggestion => {
                  const li = document.createElement('li');
                  li.innerText = `${suggestion.artist.name} - ${suggestion.title}`;
                  li.addEventListener('click', () => {
                     selectedSong = suggestion;
                     songTitleInput.value = suggestion.title;
                     artistInput.value = suggestion.artist.name;
                    //  suggestionsList.innerHTML = '';
                     document.getElementById('lyrics').innerText = ''; // Clear lyrics when a new suggestion is selected
                     searchLyrics();
                  });
                  suggestionsList.appendChild(li);
               });
            } else {
               suggestionsList.innerHTML = '<li>Nerasta daina</li>';
            }
         } catch (error) {
            console.error('Error fetching suggestions:', error);
         }
      }

      async function searchLyrics() {
         const songTitleInput = document.getElementById('songTitle');
         const artistInput = document.getElementById('artist');

         const songTitle = songTitleInput.value;
         const artist = artistInput.value;

         if (!songTitle || !artist) {
            alert('Įveskite dainą ir autorių.');
            return;
         }

         try {
            const response = await fetch(`https://api.lyrics.ovh/v1/${selectedSong.artist.name}/${selectedSong.title}`);
            const data = await response.json();

            if (data.lyrics) {
               document.getElementById('lyrics').innerText = data.lyrics;
            } else {
               document.getElementById('lyrics').innerText = 'Nerasti dainos žodžiai.';
            }
            // searchSuggestions();
         } catch (error) {
            console.error('Error fetching lyrics:', error);
         }
      }

      // Attach event listeners
      const songTitleInput = document.getElementById('songTitle');
      songTitleInput.addEventListener('input', searchSuggestions);