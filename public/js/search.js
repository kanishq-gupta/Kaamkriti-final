function handleSearch(event) {
    event.preventDefault();
    
    const city = document.getElementById('city').value;
    const profession = document.getElementById('profession').value;
    
    // Redirect to filter page with query parameters
    window.location.href = `/workers-list.html?city=${encodeURIComponent(city)}&profession=${encodeURIComponent(profession)}`;
}