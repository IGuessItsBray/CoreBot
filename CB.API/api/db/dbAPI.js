// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require('./mongo').mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------
const tokenSchema = require('./schemas/webTokenSchema');

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------
module.exports = {
	setToken,
	getToken,
	delToken,

};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

async function setToken (token, access, refresh, expires, scope, type, user) {
	return await mongo().then(async () =>{
		try {
			// console.log(`dbAPI: ${arguments.callee.name}: using ${JSON.stringify(arguments)}`);
			return await tokenSchema.create({
				token: token,
				access: access,
				refresh: refresh,
				expires: expires,
				scope: scope,
				type: type,
				user: user,
			});
		}
		catch (e) {
			console.error(`dbAPI: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function getToken (token) {
	return await mongo().then(async () =>{
		try {
			// console.log(`dbAPI: ${arguments.callee.name}: using ${JSON.stringify(arguments)}`);
			return await tokenSchema.findOne({
				token: token,
			});
		}
		catch (e) {
			console.error(`dbAPI: ${arguments.callee.name}: ${e}`);
		}
	});
}

async function delToken (token) {
	return await mongo().then(async () =>{
		try {
			// console.log(`dbAPI: ${arguments.callee.name}: using ${JSON.stringify(arguments)}`);
			return await tokenSchema.findOneAndDelete({
				token: token,
			});
		}
		catch (e) {
			console.error(`dbAPI: ${arguments.callee.name}: ${e}`);
		}
	});
}