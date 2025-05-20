const YOUTUBE_API_KEY = 'AIzaSyB_Nn917i3m25MvY_0jzKyOeqwCXGi45qs';
const CHANNEL_ID = 'UCV0IxvaApFV5QxtnE19yhcA';
const MAX_RESULTS = 10;

// Create iframe for video
function createVideoCard(videoId) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}`;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  return iframe;
}

// Load YouTube videos with error & empty handling
async function loadVideos(containerId) {
  const container = document.getElementById(containerId);
  const limit = parseInt(container?.getAttribute('data-limit')) || MAX_RESULTS;
  if (!container) return;

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${limit}`);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      container.innerHTML = '<p>No videos found at the moment. Check back soon!</p>';
      return;
    }

    data.items.forEach(item => {
      if (item.id.kind === "youtube#video") {
        // const card = createVideoCard(item.id.videoId);
        // container.appendChild(card);
        const wrapper = document.createElement('div');
        wrapper.className = 'project-card';
        const iframe = createVideoCard(item.id.videoId);
        wrapper.appendChild(iframe);
        container.appendChild(wrapper);

      }
    });
  } catch (error) {
    container.innerHTML = '<p style="color:red;">Unable to load videos. Please try again later.</p>';
    console.error('YouTube API error:', error);
  }
}

// Load subscriber count
async function loadSubscriberCount() {
  const subCountElem = document.getElementById('subscriber-count');
  if (!subCountElem) return;

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`);
    const data = await res.json();
    const subs = data.items[0].statistics.subscriberCount;
    subCountElem.textContent = `Subscribers: ${Number(subs).toLocaleString()}`;
  } catch (error) {
    console.error('Subscriber count fetch error:', error);
  }
}

// Set theme
function setTheme(theme) {
  const lightCSS = 'css/light.css';
  const darkCSS = 'css/dark.css';
  const link = document.querySelector('link[rel="stylesheet"]');
  if (link) link.href = theme === 'dark' ? darkCSS : lightCSS;
}

// DOM Load Logic
document.addEventListener('DOMContentLoaded', () => {
  // Load YouTube + subs
  const projectSection = document.getElementById('youtube-projects');
  if (projectSection) loadVideos('youtube-projects');
  loadSubscriberCount();

  // Hamburger menu toggle
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    setTheme(theme);
  });

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
});

