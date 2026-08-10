export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/atlas5D')) {
      // Remove '/atlas5D' prefix so it maps to the root of the dist directory
      const originalPathname = url.pathname;
      url.pathname = url.pathname.replace(/^\/atlas5D/, '');
      if (url.pathname === '' || url.pathname === '/') {
        url.pathname = '/index.html';
      }
      
      const modifiedRequest = new Request(url.toString(), request);
      let response = await env.ASSETS.fetch(modifiedRequest);
      
      if (response.status === 404) {
        // Fallback to index.html for SPA routing
        url.pathname = '/index.html';
        response = await env.ASSETS.fetch(new Request(url.toString(), request));
      }
      return response;
    }
    
    // If somehow it gets a non-atlas5D request
    return new Response("Not found", { status: 404 });
  }
};
