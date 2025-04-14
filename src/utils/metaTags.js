export const updateMetaTags = (campaign) => {
  // Update title
  document.title = `${campaign.title} | Relief Platform`;

  // Update description
  const description = campaign.description || "Join our global movement to provide immediate relief and long-term recovery support to communities affected by natural disasters.";
  
  // Get the current URL with campaign ID
  const currentUrl = `${window.location.origin}/campaigns/${campaign.id}`;

  // Always use the Hero image for sharing preview (from public assets)
  const imageUrl = `${window.location.origin}/assets/share/Hero.png`;

  // Update all meta tags
  const metaTags = {
    'description': description,
    'og:description': description,
    'twitter:description': description,
    'og:title': campaign.title,
    'twitter:title': campaign.title,
    'og:url': currentUrl,
    'og:image': imageUrl,
    'twitter:image': imageUrl,
    'og:image:secure_url': imageUrl,
    'og:image:alt': `${campaign.title} - Relief Platform Campaign`,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/png',
    'twitter:card': 'summary_large_image',
    'og:site_name': 'Relief Platform'  // Added site name for better preview
  };

  // Update each meta tag
  Object.entries(metaTags).forEach(([property, content]) => {
    const selector = property.startsWith('og:') 
      ? `meta[property="${property}"]`
      : `meta[name="${property}"]`;
    
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      if (property.startsWith('og:')) {
        element.setAttribute('property', property);
      } else {
        element.setAttribute('name', property);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  });

  // Force social media platforms to re-fetch the meta tags
  const head = document.getElementsByTagName('head')[0];
  const refreshMeta = document.createElement('meta');
  refreshMeta.setAttribute('http-equiv', 'refresh');
  refreshMeta.setAttribute('content', '0');
  head.appendChild(refreshMeta);
  setTimeout(() => {
    head.removeChild(refreshMeta);
  }, 0);
}; 