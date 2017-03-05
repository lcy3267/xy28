
export default  {
	user: {
		validCode: "/v1/accounts",
		weChatLogin: '/v1/wechat/app',
		verificationCode: "/v1/sms/mobile_verification_code",
		bindMobile: "/v1/accounts/wechat",
		addPoints: (id)=>`/v1/accounts/${id}/points`,//签到增加积分
		auth: "token",
		detail:(id)=>`/v1/accounts/${id}`,
		statis:(id)=>`/v1/dynamics/users/${id}`,
		updateLogo:(id)=>`/v1/accounts/user/${id}/avatar`,
		updateTimeLogo:(id)=>`/v1/accounts/${id}/poster`,
		updateSign:(id)=>`/v1/accounts/user/${id}/sign`,
	},
	activity: {
		bannerList: '/v1/docs/banners',
		homeList: '/v1/docs/us/activities',
		info: (id)=>`/v1/docs/us/${id}`,
		tickets: (id)=>`/v1/docs/us/${id}/tickets`,
		signup: '/v1/docs/signup', 
		getWeChatParams: (id)=>`/v1/wechat/${id}/unifiedorder`,
		queryOrderStatus: (orderId)=>`/v1/docs/order/${orderId}/pay_status`,
		collectActivity: (id)=>`/v1/docs/favorites/${id}`,
		isCollectActivity: (id)=>`/v1/docs/us/favorites/${id}`,
		addPageView: '/v1/docs/pageviews',

		groupActivityList:(groupId)=>`/v1/docs/us/group/${groupId}`, //获取车圈活动列表
		release:(groupId)=>`/v1/docs/group/${groupId}`,//发布车圈活动
		preview:(groupId)=>`/v1/docs/us/preview/group/${groupId}`,//预览车圈活动
		update:(groupId)=>`/v1/docs/group/${groupId}`,//编辑车圈活动
		hide:(id)=>`/v1/docs/${id}/hidden`,//隐藏(假删除)活动
		setTop:(id)=>`/v1/docs/${id}/weight`,//置顶活动
		detail: (id)=>`/v1/docs/${id}`,
		activityApplicants:(id)=>`/v1/docs/${id}/signup_success`,//活动报名者
	},
	news: {
		list: '/v1/docs/us/info',
	},
	carGroup: {
		create: (user_id)=>`/v1/groups/us/user/${user_id}`,
		carNewMember:(groupId)=>`/v1/groups/us/group/${groupId}/tobejoined`,//车圈会员申请
		carOldMember:(groupId)=>`/v1/groups/${groupId}/joined`,//车圈已有会员
		applyToJoin: (groupId,userId)=>`/v1/groups/us/group/${groupId}/user/${userId}/applyToJoin`,//申请加入车圈
		checkJoined: (groupId,userId)=>`/v1/groups/us/group/${groupId}/user/${userId}/check`,//处理会员申请
		detail: (groupId)=>`/v1/groups/us/group/${groupId}`,//详情
		search: '/v1/groups/search',//搜索
		joinedList:(userId)=>`/v1/groups/us/user/${userId}/myjoined`,//加入的车圈
		owned:(userId)=>`/v1/groups/us/user/${userId}/myself`,//创建的车圈
		edit:(groupId)=>`/v1/groups/us/${groupId}`,//编辑车圈
		groupListOfCategory:'/v1/groups/us/groups',//获取某个分类的车圈列表
		role:(groupId,userId)=>`/v1/groups/us/group/${groupId}/user/${userId}`,//获取用户在车圈中的角色
		joinGroup: (user_id,group_id)=>`/v1/groups/us/group/${group_id}/user/${user_id}/applyToJoin`,
	},
	personal:{
		collectActivity: (id)=>`/v1/docs/favorites/${id}`,//个人活动收藏
		collectnews: (id)=>`/v1/docs/favorites/info/${id}`,//个人咨询收藏
		myActivity: (id)=>`/v1/docs/${id}/publish`,//发布的活动
		joinActivity: (id)=>`/v1/docs/${id}/participation`,//参加的活动
		myTickets: (id)=>`/v1/docs/${id}/mytickets`,//我的票务

		myAttention: (id)=>`/v1/dynamics/user/${id}/following`,//我的关注
		myFans: (id)=>`/v1/dynamics/user/${id}/follower`,//我的车粉
		checkFriend: (id)=>`/v1/dynamics/user/${id}/focus`,//关注/取消关注
		userInfo: (id)=>`/v1/accounts/${id}`,//用户信息
		focusStatus: (id)=>`/v1/dynamics/user/${id}/focus`,//用户关注状态
	},
	letter: {
		sendMassage: (user_id)=>`/v1/messages/user/${user_id}`,
		getChattingList: (user_id)=> `/v1/messages/user/${user_id}/private_letters`,
		updateReadChatting: (user_id)=>`/v1/messages/user/${user_id}/receipt`,
		getSystemMassage: (user_id)=>`/v1/messages/us/systems/user/${user_id}`,
		markReadSystem: (user_id)=>`/v1/messages/us/systems/user/${user_id}/receipt`,
	},
	timeline:{
		release:{path:(id)=>`/v1/dynamics/us/user/${id}`,method:'post'},
		releaseGroupTimeline:{path:(groupId,userId)=>`/v1/dynamics/us/group/${groupId}/user/${userId}`,method:'post'},
		myTimelineList:{path:(id)=>`/v1/dynamics/us/user/${id}`,method:'get'},
		groupTimelineList:{path:(id)=>`/v1/dynamics/us/group/${id}`,method:'get'},
		delete:{path:(id)=>`/v1/dynamics/${id}/invalid`,method:'put'}, //删除动态
		notificationOverview:{path:(userId)=>`/v1/dynamics/user/${userId}/notification`,method:'get'}, //获取动态通知总览
		notificationList:{path:(userId)=>`/v1/dynamics/user/${userId}/notifications`,method:'get'}, //获取动态通知列表
		mixedTimelineList:{path:(userId)=>`/v1/dynamics/circles/user/${userId}`,method:'get'},//获取整站的动态列表
		addComment:{path:(timelineId,userId)=>`/v1/dynamics/${timelineId}/user/${userId}`,method:'post'}, //添加动态评论
		deleteComment:{path:(id)=>`/v1/dynamics/comments/${id}/invalid`,method:'put'}, //评论删除
		addLike:{path:(timelineId,userId)=>`/v1/dynamics/${timelineId}/user/${userId}/likes`,method:'post'}//点赞
	}
}