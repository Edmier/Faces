import { POCKETBASE_URL } from "$env/static/private";
import type { Handle } from "@sveltejs/kit";
import PocketBase from 'pocketbase';


export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies } = event;

	const pbCookie = cookies.get('pocketbase_auth');

	locals.pb = new PocketBase(POCKETBASE_URL);
	locals.pb.authStore.loadFromCookie(pbCookie || '');

	try {
		if (locals.pb.authStore.isValid) {
			await locals.pb.collection('users').authRefresh();
		}
	} catch (_) {
		locals.pb.authStore.clear();
	}

	// Security headers
	event.setHeaders({
		'X-Frame-Options': 'SAMEORIGIN',
		'Referrer-Policy': 'no-referrer',
		'Permissions-Policy': 'accelerometer=(), autoplay=(), camera=(), document-domain=(), encrypted-media=(), fullscreen=(), gyroscope=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()',
		'X-Content-Type-Options': 'nosniff'
	});

	const response = await resolve(event);

	if (locals.pb) {
		response.headers.append('set-cookie', locals.pb.authStore.exportToCookie());
	}

	return response
};