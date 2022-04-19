const admin_roles = require('../../config.json').PERMS.ADMIN;
const dev_users = require('../../config.json').PERMS.DEVS;
module.exports = {

	// ------------------------------------------------------------------------------
	// Definition
	// ------------------------------------------------------------------------------

	name: 'mongotest',
	description: 'testing databse functions',
	type: 'CHAT_INPUT', // CHAT_INPUT, USER, MESSAGE
	guild_id: [],
	enabled: true,
	permissions: [
        ...dev_users.map(user => {
            return {
                id: user,
                type: 'USER',
                permission: true,
            };
        }),
    ],
	// ------------------------------------------------------------------------------
	// Options
	// ------------------------------------------------------------------------------

	options: [],

	// ------------------------------------------------------------------------------
	// Execution
	// ------------------------------------------------------------------------------

	async execute(interaction, ephemeral = true) {

		// create a new user / update an existing user
		// first thing is to create a user object that looks something like what our
		// userSchema looks like
		const user = {
			id: interaction.user.id,
			name: interaction.user.username,
			discriminator: interaction.user.discriminator,
		};

		// next we can call the updateUser function
		// this will either update an existing user or create a new one
		// we can also assign the result to a variable, we'll call it updateUserResult
		const updateUserResult = await updateUser(user);
		console.log('updateUserResult:', updateUserResult);

		// now we can get the user by their id since one exists now
		// we can assign the result to a variable, we'll call it getUserResult
		// we can now access the properties of this object (as long as they exist)
		// 	getuserResult.id, getUserResult.name, getUserResult.discriminator
		const getUserResult = await getUser(interaction.user.id);
		console.log('getUserResult:', getUserResult);

		// next we'll try out getallUsers
		// we can assign the result to a variable, we'll call it getAllUsersResult
		// note that this is an array of objects, not a single object even if there's only one
		const getAllUsersResult = await getAllUsers();
		console.log('getAllUsersResult:', getAllUsersResult);

		// I'm going to skip deleting user, but you can do that too.

		await interaction.reply({
			content: 'done!',
			ephemeral,
		});
	},

	// ------------------------------------------------------------------------------
};

// import the accessor methods we've just created
const {
	updateUser,
	getUser,
	deleteUser,
	getAllUsers,
} = require('../../db/dbAccess');