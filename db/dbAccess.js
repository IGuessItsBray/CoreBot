// ------------------------------------------------------------------------------
// DB Access Layer
// ------------------------------------------------------------------------------
const mongo = require('./mongo').mongoose;

// ------------------------------------------------------------------------------
// Schema Imports
// ------------------------------------------------------------------------------
const userSchema = require('./schemas/userSchema');

// ------------------------------------------------------------------------------
// Function + Prop Exports
// ------------------------------------------------------------------------------
module.exports = {
	updateUser,
	getUser,
	deleteUser,
	getAllUsers,
};

// ------------------------------------------------------------------------------
// Functions
// ------------------------------------------------------------------------------

// updateUser
// serves two purposes:
// 1. update a user's data, by referencing the user's id
// 2. create a new user if one doesn't exist
async function updateUser (user) {
	return await mongo().then(async () =>{
		try {
			console.log(`dbAccess: ${arguments.callee.name}: using ${JSON.stringify(Object.values(arguments))}`);
			// note that we're using the findOneAndUpdate method
			return await userSchema.findOneAndUpdate(
				// the first argument is the query, what we're looking for
				{
					id: user.id,
				},
				// the second argument is the data that we're inserting / updating
				// in this case, we can just pass the entire object
				user,
				// the third argument is the options, which are optional
				// new will create a new database record if one doesn't exist
				// I totally forget what upsert does, but it's important for some reason
				{ new: true, upsert: true });
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

// getUser
// this one is nice and easy - just get the user by their id
// if the user doesn't exist, null is returned
async function getUser (id) {
	return await mongo().then(async () =>{
		try {
			console.log(`dbAccess: ${arguments.callee.name}: using ${JSON.stringify(Object.values(arguments))}`);
			// note that we're using the findOne method
			// this is because we're looking for a single record
			return await userSchema.findOne({
				id: id,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

// deleteUser
// you could get away with not having a delete method in most cases,
// but it's good practice to have one and to learn how to use it
async function deleteUser (id) {
	return await mongo().then(async () =>{
		try {
			console.log(`dbAccess: ${arguments.callee.name}: using ${JSON.stringify(Object.values(arguments))}`);
			// note that we're using the findOneAndDelete method
			return await userSchema.findOneAndDelete({
				id: id,
			});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}

// getAllUsers
// this one is nice and easy - just get all the users
// if there are none, an empty array is returned
// this is another method you may never need, but it's here
async function getAllUsers () {
	return await mongo().then(async () =>{
		try {
			console.log(`dbAccess: ${arguments.callee.name}: using ${JSON.stringify(Object.values(arguments))}`);
			// note that we're using the find method which returns multiple records
			// in this case we're calling it on userSchema which will give us everything
			return await userSchema.find({});
		}
		catch (e) {
			console.error(`dbAccess: ${arguments.callee.name}: ${e}`);
		}
	});
}