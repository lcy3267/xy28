
export default  {
	user: {
		register: 'POST /users/register',
		login: 'POST /users/login'
	},
	gameRoles: {
		list: 'GET /gameRules/list'
	},
	recharge: {
		getCollectionAccounts: 'GET /recharge/getCollectionAccounts',
		doAlipayRecharge: 'POST /recharge/alipayRecharge',
	},
}