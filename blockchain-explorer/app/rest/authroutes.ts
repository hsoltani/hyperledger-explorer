/**
 *    SPDX-License-Identifier: Apache-2.0
 */
import { helper } from '../common/helper';

import passport from 'passport'

const { responder } = require('./requestutils');

const logger = helper.getLogger('Auth');

/**
 *
 *
 * @param {*} router
 * @param {*} platform
 */
export async function authroutes(router: any, platform: any) {
	const proxy = platform.getProxy();

	/**
	 * *
	 * Network list
	 * GET /networklist -> /login
	 * curl -i 'http://<host>:<port>/networklist'
	 */

	router.get(
		'/networklist',
		responder(async (req: any) => {
			const networkList = await proxy.networkList(req);
			return { networkList };
		})
	);

	/**
	 * *
	 * Login
	 * POST /login -> /login
	 * curl -X POST -H 'Content-Type: routerlication/json' -d '{ 'user': '<user>', 'password': '<password>', 'network': '<network>' }' -i 'http://<host>:<port>/login'
	 */
	router.post('/login', async (req: { body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { success: boolean; message: any; token?: any; user?: any; }): any; new(): any; }; }; }, next: any) => {
		logger.debug('req.body', req.body);
		return passport.authenticate('local-login', (err, token, userData) => {
			if (!token) {
				return res.status(400).json({
					success: false,
					message: userData.message
				});
			}
			return res.status(200).json({
				success: true,
				message: 'You have successfully logged in!',
				token,
				user: userData
			});
		})(req, res, next);
	});

	router.post('/logout', async (req: { body: any; logout: () => void; }, res: { send: () => void; }) => {
		logger.debug('req.body', req.body);
		req.logout();
		res.send();
	});
};
