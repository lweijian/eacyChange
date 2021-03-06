'use strict';
const uniID = require('uni-id')
const db = uniCloud.database()
const article = db.collection('articles');
exports.main = async (event, context) => {
	const uniIDIns = uniID.createInstance({
		context
	})
	let params = event.params || {}
	let payload = {}
	let noCheckAction = ['getAllArticles', 'getArticleById']
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
		case 'getAllArticles':
			try {
				let result = await article.aggregate()
					.lookup({
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
		case 'getArticleById':
			try {
				let result = await article
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
		case 'getArticlesByUid':
			try {
				let result = await article
					.aggregate()
					.match({
						uid: params.uid
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

		case 'addArticle':
			try {
				let result = await article.add({
					uid: params.uid,
					publish_date: new Date().getTime(),
					detailSwiper: params.detailSwiper,
					cover: params.detailSwiper[0],
					title: params.title,
					content: params.content,
					article_status: params.article_status,
					view_count: 1000,
					like_count: 100
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
		case 'delArticles':
			try {
				const id = params.id;
				if (!id) {
					return res = {
						code: 500,
						msg: `删除失败,请指定删除的id`
					}
				}
				let articlesData = await article
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
					
				if(articlesData.data[0].uid!==params.uid){
					return res = {
						code: 403,
						msg: `权限不足`
					}
				}

				let result = await article.doc(id).remove()
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

		case 'delArticleImage':
			try {
				const fileID = params.fileID;
				if (!fileID) {
					return res = {
						code: 500,
						msg: `删除失败,请指定删除文件的id`
					}
				}
				let result = await uniCloud.deleteFile({
					fileList: [
						fileID
					]
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
