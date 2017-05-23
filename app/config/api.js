
export default  {
	user: {
		register: 'POST /users/register',
		login: 'POST /users/login',
		bindBank: 'POST /users/bindBank',
		getBankCards: 'GET /users/bankCards',
		queryWithdrawPwd: 'GET /users/queryWithdrawPwd',
		setWithdrawPwd: 'PUT /users/setWithdrawPwd',
		withdraw: 'POST /users/withdraw',
		getUserInfo: 'GET /users/getUserInfo',
	},
	gameRoles: {
		list: 'GET /gameRules/list',
		roomGameRule: 'GET /gameRules/roomGameRule',
	},
	recharge: {
		getCollectionAccounts: 'GET /recharge/getCollectionAccounts',
		doAlipayRecharge: 'POST /recharge/alipayRecharge',
	},
	rooms: {
		getRooms: 'GET /system/rooms',
	},
	bet: {
		getCollectionAccounts: 'GET /recharge/getCollectionAccounts',
		doAlipayRecharge: 'POST /recharge/alipayRecharge',
	},
}