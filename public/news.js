document.addEventListener('DOMContentLoaded', async function () {
    const newsSection = document.getElementById('news-section');
    const apiKey = '43061dfcd68b41b08b622a2e9b0686fd';
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            data.articles.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'bg-white rounded-lg shadow-md overflow-hidden';

                newsItem.innerHTML = `
                    <img src="${article.urlToImage || 'https://placehold.co/600x400'}" 
                         alt="${article.title}" 
                         class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h2 class="text-xl font-bold mb-2">${article.title}</h2>
                        <p class="text-gray-700">${article.description || 'No description available.'}</p>
                        <a href="${article.url}" target="_blank" class="text-green-600 hover:underline mt-2 block">Read more</a>
                    </div>
                `;

                newsSection.appendChild(newsItem);
            });
        } else {
            newsSection.innerHTML = `<p class="text-red-500">Failed to load news articles. Please try again later.</p>`;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsSection.innerHTML = `<p class="text-red-500">An error occurred while fetching news. Please try again later.</p>`;
    }
});
