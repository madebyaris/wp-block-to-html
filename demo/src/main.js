// WordPress REST API endpoint using our proxy
const API_ENDPOINT = '/wp-api/wp/v2/posts';
const WP_SITE_URL = 'https://wp.madebyaris.com';

// CSS Framework URLs
const CSS_FRAMEWORKS = {
  bootstrap: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  tailwind: 'https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css'
};

// DOM elements
const postsContainer = document.getElementById('posts-container');
const frameworkButtons = document.querySelectorAll('[data-framework]');

// Current CSS framework
let currentFramework = 'none';
let loadedFrameworks = new Set();

// Function to load CSS framework
function loadCssFramework(framework) {
  if (framework === 'none') {
    return Promise.resolve();
  }
  
  if (loadedFrameworks.has(framework)) {
    console.log(`${framework} CSS framework already loaded`);
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CSS_FRAMEWORKS[framework];
    link.id = `${framework}-css`;
    
    link.onload = () => {
      console.log(`Loaded ${framework} CSS framework`);
      loadedFrameworks.add(framework);
      resolve();
    };
    
    link.onerror = (err) => {
      console.error(`Failed to load ${framework} CSS:`, err);
      reject(new Error(`Failed to load ${framework} CSS`));
    };
    
    document.head.appendChild(link);
  });
}

// Function to activate a specific CSS framework
function activateFramework(framework) {
  // Hide all framework stylesheets
  Object.keys(CSS_FRAMEWORKS).forEach((fw) => {
    const linkElement = document.getElementById(`${fw}-css`);
    if (linkElement) {
      linkElement.disabled = fw !== framework;
    }
  });
  
  console.log(`Activated ${framework === 'none' ? 'no' : framework} CSS framework`);
}

// Apply CSS framework classes to HTML content
function applyCssFrameworkClasses(html, framework) {
  if (framework === 'none') {
    return html;
  }
  
  let modifiedHtml = html;
  
  // Apply framework-specific classes
  if (framework === 'bootstrap') {
    // Replace WordPress image classes with Bootstrap classes
    modifiedHtml = modifiedHtml.replace(/class="wp-image-\d+"/g, 'class="img-fluid rounded"');
    
    // Add Bootstrap classes to tables
    modifiedHtml = modifiedHtml.replace(/<table/g, '<table class="table table-bordered"');
    
    // Add Bootstrap classes to blockquotes
    modifiedHtml = modifiedHtml.replace(/<blockquote/g, '<blockquote class="blockquote"');
    
    // Add Bootstrap classes to lists
    modifiedHtml = modifiedHtml.replace(/<ul/g, '<ul class="list-group"');
    modifiedHtml = modifiedHtml.replace(/<li/g, '<li class="list-group-item"');
  } 
  else if (framework === 'tailwind') {
    // Replace WordPress image classes with Tailwind classes
    modifiedHtml = modifiedHtml.replace(/class="wp-image-\d+"/g, 'class="w-full max-w-full h-auto rounded shadow-md"');
    
    // Add Tailwind classes to tables
    modifiedHtml = modifiedHtml.replace(/<table/g, '<table class="w-full border-collapse border border-slate-300 bg-white"');
    
    // Add Tailwind classes to blockquotes
    modifiedHtml = modifiedHtml.replace(/<blockquote/g, '<blockquote class="pl-4 border-l-4 border-slate-500 italic my-4"');
    
    // Add Tailwind classes to lists
    modifiedHtml = modifiedHtml.replace(/<ul/g, '<ul class="list-disc pl-5 space-y-2"');
    modifiedHtml = modifiedHtml.replace(/<li/g, '<li class="ml-2"');
    
    // Add Tailwind classes to paragraphs
    modifiedHtml = modifiedHtml.replace(/<p/g, '<p class="mb-4 text-slate-700"');
    
    // Add Tailwind classes to headings
    modifiedHtml = modifiedHtml.replace(/<h2/g, '<h2 class="text-2xl font-bold text-slate-900 mt-6 mb-4"');
    modifiedHtml = modifiedHtml.replace(/<h3/g, '<h3 class="text-xl font-bold text-slate-900 mt-5 mb-3"');
    modifiedHtml = modifiedHtml.replace(/<h4/g, '<h4 class="text-lg font-bold text-slate-900 mt-4 mb-2"');
  }
  
  return modifiedHtml;
}

// Fix image URLs in HTML content
function fixImageUrls(html) {
  // Fix image URLs by replacing relative URLs with absolute URLs
  // This handles both /wp-content and wp-content paths
  let fixedHtml = html.replace(/src="\/wp-content/g, `src="${WP_SITE_URL}/wp-content`);
  fixedHtml = fixedHtml.replace(/src="wp-content/g, `src="${WP_SITE_URL}/wp-content`);
  
  // Also fix image URLs in srcset attributes
  fixedHtml = fixedHtml.replace(/srcset="\/wp-content/g, `srcset="${WP_SITE_URL}/wp-content`);
  fixedHtml = fixedHtml.replace(/srcset="wp-content/g, `srcset="${WP_SITE_URL}/wp-content`);
  
  return fixedHtml;
}

// Fetch posts from WordPress
async function fetchPosts() {
  try {
    postsContainer.innerHTML = '<div class="loading">Loading posts...</div>';
    
    // Load the selected CSS framework if needed
    if (currentFramework !== 'none') {
      try {
        await loadCssFramework(currentFramework);
        activateFramework(currentFramework);
        console.log(`Using ${currentFramework} CSS framework`);
      } catch (error) {
        console.error('Error loading CSS framework:', error);
      }
    } else {
      activateFramework('none');
    }
    
    const response = await fetch(`${API_ENDPOINT}?_embed=true&per_page=5`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched posts:', data);
    
    if (data && data.length > 0) {
      renderPosts(data);
    } else {
      postsContainer.innerHTML = '<div class="alert alert-warning">No posts found.</div>';
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    postsContainer.innerHTML = `
      <div class="error">
        <strong>Error fetching posts:</strong> ${error.message}
      </div>
    `;
  }
}

// Render posts
function renderPosts(posts) {
  postsContainer.innerHTML = '';
  
  posts.forEach((post) => {
    // Create post container
    const postElement = document.createElement('div');
    postElement.className = currentFramework === 'bootstrap' 
      ? 'post-container card' 
      : currentFramework === 'tailwind'
        ? 'post-container bg-white rounded-lg shadow-lg p-6 mb-8'
        : 'post-container';
    
    // Add post title
    const titleElement = document.createElement('h2');
    titleElement.className = currentFramework === 'bootstrap' 
      ? 'post-title card-title' 
      : currentFramework === 'tailwind'
        ? 'post-title text-3xl font-bold text-slate-900'
        : 'post-title';
    titleElement.innerHTML = post.title.rendered;
    postElement.appendChild(titleElement);
    
    // Add post date
    const dateElement = document.createElement('div');
    dateElement.className = currentFramework === 'bootstrap' 
      ? 'post-date text-muted mb-3' 
      : currentFramework === 'tailwind'
        ? 'post-date text-sm text-slate-500 mb-4'
        : 'post-date';
    const postDate = new Date(post.date);
    dateElement.textContent = postDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    postElement.appendChild(dateElement);
    
    // Add post content
    const contentElement = document.createElement('div');
    contentElement.className = currentFramework === 'bootstrap' 
      ? 'post-content card-body' 
      : currentFramework === 'tailwind'
        ? 'post-content prose max-w-none'
        : 'post-content';
    
    // Get the rendered HTML content
    let html = post.content.rendered;
    
    // Fix image URLs
    html = fixImageUrls(html);
    
    // Apply CSS framework classes
    html = applyCssFrameworkClasses(html, currentFramework);
    
    contentElement.innerHTML = html;
    
    // Add a note about the CSS framework
    const noteElement = document.createElement('div');
    noteElement.className = currentFramework === 'bootstrap' 
      ? 'alert alert-info mt-3' 
      : currentFramework === 'tailwind'
        ? 'p-4 mt-3 bg-blue-100 text-blue-800 rounded-lg shadow-sm border border-blue-200'
        : 'mt-3 p-3 bg-gray-100 border border-gray-300 rounded';
    noteElement.innerHTML = `<small>This content is styled using the ${currentFramework === 'none' ? 'default WordPress' : currentFramework} CSS framework.</small>`;
    contentElement.appendChild(noteElement);
    
    postElement.appendChild(contentElement);
    postsContainer.appendChild(postElement);
  });
}

// Handle framework selection
frameworkButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Update active button
    frameworkButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Update current framework
    currentFramework = button.getAttribute('data-framework');
    
    // Update body class for CSS framework
    document.body.classList.remove('bootstrap', 'tailwind');
    if (currentFramework !== 'none') {
      document.body.classList.add(currentFramework);
    }
    
    // Refetch posts with new framework
    fetchPosts();
  });
});

// Initial setup - preload both frameworks for faster switching
Promise.all([
  loadCssFramework('bootstrap'),
  loadCssFramework('tailwind')
])
.then(() => {
  // Set initial framework to none (WordPress default)
  activateFramework('none');
  
  // Initial fetch
  fetchPosts();
})
.catch((error) => {
  console.error('Failed to load CSS frameworks:', error);
  // Try to fetch posts anyway
  fetchPosts();
}); 