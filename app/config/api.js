
export default  {
	user: {
		register: 'POST /users/register',
		login: 'POST /users/login',
		bindBank: 'POST /users/bindBank',
		getBankCards: 'GET /users/bankCards',
		getUserInfo: 'GET /users/getUserInfo',
	},
	withdraw: {
		queryWithdrawPwd: 'GET /withdraw/queryWithdrawPwd',
		setWithdrawPwd: 'PUT /withdraw/setWithdrawPwd',
		updateLoginPwd: 'PUT /users/updateLoginPwd',
		withdraw: 'POST /withdraw/withdraw',
		userWithDrawRecord: 'GET /withdraw/userWithDrawRecord',
	},
	gameRoles: {
		list: 'GET /gameRules/list',
		roomGameRule: 'GET /gameRules/roomGameRule',
	},
	bet: {
		records: 'GET /bet/records',
		cancelBet: 'PUT /bet/cancelBet',
		userRecords: 'PUT /bet/userRecords',
		integralChangeRecords: 'GET /bet/integralChangeRecords',
		userBetRecords: 'GET /bet/userBetRecords',
	},
	recharge: {
		getCollectionAccounts: 'GET /recharge/getCollectionAccounts',
		doAlipayRecharge: 'POST /recharge/alipayRecharge',
	},
	rooms: {
		getRooms: 'GET /system/rooms',
		getRoomInfo: 'GET /system/roomInfo',
	},
	message: {
		systemList: 'GET /message/systemList',
		detail: 'GET /message/detail'
	},
	rollback: {
		userRollbackRecords: 'GET /rollback/userRollbackRecords'
	}
}