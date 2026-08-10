export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const userAgent = request.headers.get('User-Agent') || '';
        
        // 1. Hardware Node Routing
        if (request.headers.get('X-NPU-Identifier') || userAgent.includes('SubstrateNode')) {
            // Route to node-provisioning-service
            return await fetch(`http://node-provisioning-service.internal${url.pathname}`, request);
        }

        // 2. Mobile App Routing
        if (userAgent.includes('SpaceBookMobile')) {
            // Route to specific mobile auth flow
            if (url.pathname.startsWith('/auth')) {
                return await fetch(`http://auth-service.internal${url.pathname}`, request);
            }
            if (url.pathname.startsWith('/profile')) {
                return await fetch(`http://profile-service.internal${url.pathname}`, request);
            }
        }

        // 3. Web App Routing
        if (url.pathname.startsWith('/auth')) {
            return await fetch(`http://auth-service.internal${url.pathname}`, request);
        }
        if (url.pathname.startsWith('/profile')) {
            return await fetch(`http://profile-service.internal${url.pathname}`, request);
        }

        return new Response('SpaceBook 5D Onboarding Gateway Active.', { status: 200 });
    }
};
