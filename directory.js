// Direktori masjid dan musala: isi data-tempat-ibadah.json dengan data yang telah diverifikasi.
const placeSearch = document.getElementById('placeSearch');
const directoryList = document.getElementById('directoryList');
const directoryEmpty = document.getElementById('directoryEmpty');
const filterButtons = document.querySelectorAll('.filter-btn');
let allPlaces = [];
let activeFilter = 'semua';

function renderPlaces() {
  const term = (placeSearch?.value || '').trim().toLocaleLowerCase('id');
  const filtered = allPlaces.filter(place => {
    const kind = (place.jenis || '').toLocaleLowerCase('id');
    const text = `${place.nama || ''} ${place.desa || ''} ${place.alamat || ''}`.toLocaleLowerCase('id');
    return (activeFilter === 'semua' || kind === activeFilter) && text.includes(term);
  });
  directoryList.innerHTML = '';
  directoryEmpty.hidden = filtered.length > 0;
  if (allPlaces.length === 0) {
    directoryEmpty.hidden = false;
    return;
  }
  if (filtered.length === 0) {
    directoryEmpty.hidden = false;
    directoryEmpty.querySelector('h3').textContent = 'Data tidak ditemukan';
    directoryEmpty.querySelector('p').textContent = 'Coba kata kunci lain atau pilih filter yang berbeda.';
    return;
  }
  directoryEmpty.hidden = true;
  filtered.forEach(place => {
    const card = document.createElement('article');
    card.className = 'place-card';
    const symbol = document.createElement('div');
    symbol.className = 'place-symbol';
    symbol.textContent = '☾';
    const content = document.createElement('div');
    const type = document.createElement('div');
    type.className = 'place-type';
    type.textContent = place.jenis || 'Tempat ibadah';
    const title = document.createElement('h3');
    title.textContent = place.nama || 'Nama belum tersedia';
    const detail = document.createElement('p');
    detail.textContent = [place.desa, place.alamat].filter(Boolean).join(' · ') || 'Alamat belum tersedia';
    content.append(type, title, detail);
    card.append(symbol, content);
    directoryList.append(card);
  });
}
placeSearch?.addEventListener('input', renderPlaces);
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => item.classList.toggle('active', item === button));
  renderPlaces();
}));
fetch('data-tempat-ibadah.json')
  .then(response => response.ok ? response.json() : [])
  .then(data => { allPlaces = Array.isArray(data) ? data : []; renderPlaces(); })
  .catch(() => { allPlaces = []; renderPlaces(); });
