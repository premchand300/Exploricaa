// Data: destinations (with images)
const DESTINATIONS = [
  { id: 'araku', name: 'Araku Valley', state: 'Andhra Pradesh', desc: 'Coffee terraces, waterfalls, tribal culture and serene viewpoints — a green escape.', img: 'images/araku.png', hotelImg: 'hotels/araku.png'},
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', desc: 'Historic Charminar, Golconda, and a modern food scene — culture meets innovation.', img: 'images/hyderabad.png', hotelImg: 'hotels/hyderabad.png' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', desc: 'Marina Beach, classical arts, temples, and delicious coastal cuisine.', img: 'images/chennai.png', hotelImg: 'hotels/chennai.png' },
  { id: 'kerala', name: 'Kerala Backwaters', state: 'Kerala', desc: 'Houseboats, tranquil lagoons and lush coconut-lined canals — perfect for slow travel.', img: 'images/kerala.png', hotelImg: 'hotels/kerala.png' },
  { id: 'manali', name: 'Manali', state: 'Himachal Pradesh', desc: 'Snowy valleys, adventure sports, and alpine forests ideal for outdoor lovers.', img: 'images/manali.png', hotelImg: 'hotels/manali.png' },
  { id: 'ooty', name: 'Ooty', state: 'Tamil Nadu', desc: 'Tea gardens, toy train and misty hills — the quintessential hill-station.', img: 'images/ooty.png', hotelImg: 'hotels/ooty.png' },
  { id: 'delhi', name: 'Delhi', state: 'Delhi NCR', desc: 'Historic monuments, markets and a culinary tapestry spanning centuries.', img: 'images/delhi.png', hotelImg: 'hotels/delhi.png' },
  { id: 'goa', name: 'Goa', state: 'Goa', desc: 'Sandy beaches, vibrant nightlife, and heritage churches — a coastal playground.', img: 'images/goa.png', hotelImg: 'hotels/goa.png' }
];
// DOM refs
const cardsGrid = document.getElementById('cardsGrid');
const hotelsGrid = document.getElementById('hotelsGrid');
const yearEl = document.getElementById('year');
// Modal refs
const modal = document.getElementById('exploreModal');
const closeModal = document.getElementById('closeModal');
const modalImg = document.getElementById('modalImg');
const modalName = document.getElementById('modalName');
const modalState = document.getElementById('modalState');
const modalDesc = document.getElementById('modalDesc');
const mapsBtn = document.getElementById('mapsBtn');
const mmtHotelsBtn = document.getElementById('mmtHotelsBtn');
const modalCar = document.getElementById('modalCar');
const modalTrain = document.getElementById('modalTrain');
const modalFlight = document.getElementById('modalFlight');
// Render destination cards
function renderDestinations() {
  cardsGrid.innerHTML = '';
  DESTINATIONS.forEach(dest => {
    const el = document.createElement('article');
    el.className = 'card reveal';
    el.innerHTML = `
      <div class="card-media" style="background-image:url('${dest.img}')"></div>
      <div class="card-body">
        <h3>${dest.name}</h3>
        <p class="muted">${dest.state}</p>
        <p class="muted">${truncate(dest.desc, 110)}</p>
        <div style="margin-top:12px">
          <button class="btn small" data-id="${dest.id}">Explore</button>
        </div>
      </div>
    `;
    // open modal when clicking anywhere on the card OR button
    el.addEventListener('click', () => openModal(dest));
    cardsGrid.appendChild(el);
  });
}
// Render hotels section cards (links to MakeMyTrip hotels for that city)
function renderHotels() {
  hotelsGrid.innerHTML = '';
  DESTINATIONS.forEach(dest => {
    const el = document.createElement('article');
    el.className = 'card reveal';
    el.innerHTML = `
      <div class="card-media" style="background-image:url('${dest.hotelImg || dest.img}')"></div>
      <div class="card-body">
        <h3>${dest.name} Hotels</h3>
        <p class="muted">View hotels & deals in ${dest.name} on MakeMyTrip.</p>
        <a class="btn small" href="${makeMMTHotelsUrl(dest)}" target="_blank" rel="noopener">Open Hotels</a>
      </div>
    `;
    hotelsGrid.appendChild(el);
  });
}
// Helpers: truncate text
function truncate(s, n){ return s.length > n ? s.slice(0,n-1) + '…' : s; }
// Build MakeMyTrip hotels URL (city-specific)
function makeMMTHotelsUrl(dest){
  // Common pattern: https://www.makemytrip.com/hotels/<city>-hotels.html
  // Normalize: lower-case, replace spaces with '-'
  const cityHotel = dest.name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');
  return `https://www.makemytrip.com/hotels/${cityHotel}-hotels.html`;
}
// Open modal with destination details and links
function openModal(dest){
  modalImg.src = dest.img;
  modalName.textContent = dest.name;
  modalState.textContent = dest.state;
  modalDesc.textContent = dest.desc;
  // Maps (google search/maps)
  mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest.name + ', ' + dest.state)}`;
  // MakeMyTrip hotels (city-specific)
  mmtHotelsBtn.href = makeMMTHotelsUrl(dest);
  // Travel options: Car/Bike (Zoomcar or Ola), Train (IRCTC), Flight (MakeMyTrip flights)
  modalCar.href = `https://www.zoomcar.com/`; // Zoomcar home — city-specific flows require extra API
  modalTrain.href = `https://www.irctc.co.in/`;
  modalFlight.href = `https://www.makemytrip.com/flights/`;
  modal.style.display = 'flex';
}
// Close modal
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none' });
// Footer year
yearEl.textContent = new Date().getFullYear();
// Render UI
renderDestinations();
renderHotels();
// Reveal (repeatable) using IntersectionObserver
function setupReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
      else entry.target.classList.remove('show'); // remove so it can animate again
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}
setupReveal();

// Contact form handling
const contactForm = document.querySelector(".contact-form");
const successPopup = document.getElementById("successPopup");

if (contactForm) {
  contactForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    
    // Save to server via PHP
    fetch("save.php", {
        method: "POST",
        body: formData
      })
      .then(res => res.text())
      .then(() => {
        // ✅ Always show success popup after save.php works
        successPopup.style.display = "flex";
        
        // Reset form fields
        contactForm.reset();
        
        // Auto hide popup after 3 seconds
        setTimeout(() => {
          successPopup.style.display = "none";
        }, 3000);
        
        // Try sending email in the background
        emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", contactForm)
          .catch(err => console.error("EmailJS error:", err));
      })
      .catch(err => {
        alert("Something went wrong while saving details. Please try again.");
        console.error("Saving failed:", err);
      });
  });
}