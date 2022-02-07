'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
const dynamic = db.collection('dynamics');
exports.main = async (event, context) => {
	const uniIDIns = uniID.createInstance({
		context
	})
	let params = event.params || {}
	let payload = {}
	let noCheckAction = ['getAllDynamic', 'getDynamicById']
	if (noCheckAction.indexOf(event.action) === -1) {
		
		if (!event.uniIdToken) {
			return {
				code: 403,
				msg: '缺少token'
			}
		}
		payload = await uniIDIns.checkToken(event.uniIdToken)
		if (payload.code && payload.code > 0) {
			return payload
		}
		params.uid = payload.uid
	}

	let res = {}

	switch (event.action) {
		case 'getAllDynamics':
			try {
				let result=await dynamic.aggregate()
				  .lookup({
				 from: 'uni-id-users',
				 localField:'uid',
				 foreignField:'_id',
				 as:'userInfo'
				  })
				  .end()
				res = {
					code: 200,
					msg: '查询成功',
					dataSource: result
				}
			} catch (e) {
				res = {
					code: 500,
					msg: `查询失败:${e}`,

				}
			}
			break;
		case 'getDynamicById':
			try {
			let result = await dynamic
			.aggregate()
			.match({
				_id: params.id
			}).lookup({
				from: 'uni-id-users',
				localField: 'uid',
				foreignField: '_id',
				as: 'userInfo'
			})
			.end();
				res = {
					code: 200,
					msg: '查询成功',
					dataSource: result
				}
			} catch (e) {
				res = {
					code: 500,
					msg: `查询失败:${e}`,
				}
			}
			break;
		case 'getDynamicsByUid':
			try {
				let result = await dynamic.aggregate()
				.match({
					uid: params.uid
				}).lookup({
					from: 'uni-id-users',
					localField: 'uid',
					foreignField: '_id',
					as: 'userInfo'
				})
				.end()
			
				res = {
					code: 200,
					msg: '查询成功',
					dataSource: result
				}
			} catch (e) {
				res = {
					code: 500,
					msg: `查询失败:${e}`,

				}
			}

			break;

		case 'addDynamic':
			try {
				let result = await dynamic.add({
					uid: params.uid,
					publish_date: new Date().getTime(),
					content:params.content,
					imgList:params.imgList,
					dynamic_status:params.dynamic_status,
					view_count: 1000,
					like_count: 100
				})
				res = {
					code: 200,
					msg: '添加成功'
				}
			} catch (e) {
				
				res = {
					code: 500,
					msg: `添加失败:${e}`,

				}
			}
			break;
		case 'delDynamics':
			try {
				const id = params.id;
				if (!id) {
					return res = {
						code: 500,
						msg: `删除失败,请指定删除的id`
					}
				}
			let dynamicData = await dynamic
			.aggregate()
			.match({
				_id: params.id
			}).lookup({
				from: 'uni-id-users',
				localField: 'uid',
				foreignField: '_id',
				as: 'userInfo'
			})
			.end();
					
				if(dynamicData.data[0].uid!==params.uid){
					return res = {
						code: 403,
						msg: `权限不足`
					}
				}
			
				let result = await dynamic.doc(id).remove()
				res = {
					code: 200,
					msg: '删除成功',
				}
			} catch (e) {
				res = {
					code: 500,
					msg: `删除失败:${e}`,
				}
			}
			
			break;

		case 'delDynamicImage':
		const fileIDList=params.fileIDList
			try {
				if (!fileIDList) {
					return res = {
						code: 500,
						msg: `删除失败,请指定删除文件的id`
					}
				}
			let result = await uniCloud.deleteFile({
			    fileList:params.fileIDList
			});
				res = {
					code: 200,
					msg: '删除成功'
				}
			} catch (e) {
				res = {
					code: 500,
					msg: `删除失败:${e}`,
				}
			}

			break;


		
		default:
			res = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}

	//返回数据给客户端
	return res
};
