fetch("https://api.alquran.cloud/v1/quran/ar.alafasy")
      .then(response => response.json())
      .then(responseData => {
        const surahs = responseData.data.surahs;
        const selectSurah = document.getElementById("selectSurah");
        const nextAyahBtn = document.getElementById("nextAyahBtn");
        const bodyElement = document.body;
        let currentSurahIndex = 0;
        let currentAyahIndex = 0;
        let audioPlayer;

        surahs.forEach(surah => {
          const option = document.createElement("option");
          option.value = surah.number.toString();
          option.textContent = `${surah.name} (${surah.number})`;
          selectSurah.appendChild(option);
        });

        selectSurah.addEventListener("change", function () {
          const selectedSurahNumber = this.value;
          const selectedSurah = surahs.find(surah => surah.number.toString() === selectedSurahNumber);
          currentSurahIndex = surahs.findIndex(surah => surah.number.toString() === selectedSurahNumber);
          currentAyahIndex = 0;
          renderAyah(selectedSurah);
        });

        nextAyahBtn.addEventListener("click", function () {
          const selectedSurah = surahs[currentSurahIndex];
          currentAyahIndex++;
          if (currentAyahIndex < selectedSurah.ayahs.length) {
            renderAyah(selectedSurah);
          } else {
            Swal.fire({
              title: 'All ayahs played',
              text: 'You have reached the end of this surah.',
              icon: 'info',
              confirmButtonText: 'OK'
            });
          }
        });

        function renderAyah(selectedSurah) {
          const cardContainer = document.getElementById("cardContainer");
          cardContainer.innerHTML = ""; 

          const ayah = selectedSurah.ayahs[currentAyahIndex];
          const audioHTML = `
            <div class="card mb-3">
              <audio id="audioPlayer" controls class="card-img-top">
                <source src="${ayah.audio}" type="audio/mp3">
              </audio>
              <div class="card-body">
                <h5 class="card-title">${ayah.text}</h5>
                <p class="card-text">Surah Number: ${selectedSurah.number} - Ayah Number: ${ayah.number}</p>
              </div>
            </div>
          `;
          cardContainer.innerHTML = audioHTML;

          
          audioPlayer = document.getElementById("audioPlayer");
          audioPlayer.addEventListener("play", handleAudioPlay);
          audioPlayer.addEventListener("pause", handleAudioPause);
        }

        function handleAudioPlay() {
          bodyElement.classList.add("dimmed-background"); // Add dimming effect
        }

        function handleAudioPause() {
          bodyElement.classList.remove("dimmed-background"); // Remove dimming effect
        }

        // Play Surah 1 as default
        renderAyah(surahs[0]);

    
        const loadingMessage = document.getElementById("loadingMessage");
        loadingMessage.style.display = "none";
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });