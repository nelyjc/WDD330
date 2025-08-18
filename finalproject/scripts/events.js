document.addEventListener("DOMContentLoaded", () => {
    const eventZipInput = document.getElementById("eventZipInput");
    const eventSearchBtn = document.getElementById("eventSearchBtn");
    const eventError = document.getElementById("eventError");
    const eventsResults = document.getElementById("eventsResults");

    const EVENTBRITE_TOKEN = "F7U4LNYTOQLMM3EFCZPR"; 
    

    eventSearchBtn.addEventListener("click", () => {
        const zip = eventZipInput.value.trim();
        if (/^\d{5}(-\d{4})?$/.test(zip)) {
            fetchEvents(zip);
            eventError.textContent = "";
            eventsResults.innerHTML = "Loading events...";
        } else {
            eventError.textContent = "Please enter a valid US ZIP code.";
            eventsResults.innerHTML = "";
        }
    });

    function fetchEvents(zip) {
        // Geocode ZIP using Google Maps API
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: zip }, (results, status) => {
            if (status === "OK" && results[0]) {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lon = location.lng();

                // Note: In a real app, this URL would be requested by your server-side proxy.
                const url = `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${lat}&location.longitude=${lon}&location.within=10mi&expand=venue`;

                fetch(url, {
                        headers: {
                            // Use the constant here
                            Authorization: 'Bearer GCCLX72HEWBZPEJHCD'
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        displayEvents(data.events);
                    })
                    .catch(error => {
                        eventError.textContent = "Error fetching events. This may be due to browser security (CORS).";
                        eventsResults.innerHTML = "";
                        console.error("Fetch Error:", error);
                    });
            } else {
                eventError.textContent = "Invalid ZIP code or unable to geocode location.";
                eventsResults.innerHTML = "";
            }
        });
    }

    function displayEvents(events) {
        if (!events || events.length === 0) {
            eventsResults.innerHTML = "<p>No events found nearby.</p>";
            return;
        }

        eventsResults.innerHTML = "";

        events.forEach(event => {
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("event-card");

            const startDate = new Date(event.start.local).toLocaleString([], {
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            // Safely get the image URL using optional chaining
            const imageUrl = event.logo?.url || ''; // Use a placeholder if no logo
            const venueName = event.venue?.name || 'Venue not specified';

            // Safely get and truncate the description
            const description = event.description?.text ?
                (event.description.text.length > 150 ? event.description.text.substring(0, 150) + "..." : event.description.text) :
                "No description available.";

            eventDiv.innerHTML = `
                ${imageUrl ? `<img src="${imageUrl}" alt="${event.name.text}" class="event-image">` : ''}
                <div class="event-details">
                    <h3><a href="${event.url}" target="_blank" rel="noopener">${event.name.text}</a></h3>
                    <p><strong>When:</strong> ${startDate}</p>
                    <p><strong>Where:</strong> ${venueName}</p>
                    <p>${description}</p>
                </div>
            `;

            eventsResults.appendChild(eventDiv);
        });
    }
});
