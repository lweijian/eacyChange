'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
const draft = db.collection('draft');
exports.main = async (event, context) => {
	const uniIDIns = uniID.createInstance({
		context
	})
	let params = event.params || {}
	let payload = {}
	let noCheckAction = []
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
		case 'getDraft':
			try {
				let result = await draft.where({
					uid: params.uid
				}).get();
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
		case 'addDraft':
			try {
				let result = await draft.add({
					image: params.image,
					uid: params.uid,
					create_date: new Date().getTime()
				})
				res = {
					code: 200,
					msg: '添加成功'
				}
			} catch (e) {
				console.log()
				res = {
					code: 500,
					msg: `添加失败:${e}`,
					
				}
			}
			break;
		case 'delDraft':
			try {
				const id=params.id;
				const fileID=params.fileID;
				if(!id){
					return res={
						code: 500,
						msg: `删除失败,请指定删除的id`
					}
				}
			 uniCloud.deleteFile({fileList:[fileID]})
				let result = await draft.doc(id).remove()
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
