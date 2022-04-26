const fs = require('fs');
fs.mkdir('./sqlite', { recursive: true }, (err) => { if (err) throw err; });
const db = require('better-sqlite3')('./sqlite/tags.db', {});

module.exports = {
	initGuild,

	getAllTags,
	getOneTag,
	insertOneTag,
	updateOneTag,
	deleteOneTag,
};

function initGuild(guildId) {
	const create_table = db.prepare(
		`CREATE TABLE IF NOT EXISTS TAGS_${guildId} (` +
		'	id 			INTEGER PRIMARY KEY	,' +
		'	content 	TEXT 	NOT NULL	,' +
		'	trigger 	TEXT 	NOT NULL	,' +
		'	createdUser TEXT 	NOT NULL	,' +
		'	createdDate TEXT 	NOT NULL	,' +
		'	editedUser 	TEXT 	NOT NULL	,' +
		'	editedDate 	TEXT 	NOT NULL	 ' +
		');',
	);
	return create_table.run();
}

function getAllTags(guildId) {
	initGuild(guildId);

	const get_all_tags = db.prepare(
		`SELECT * FROM TAGS_${guildId};`,
	);
	return get_all_tags.all();
}

function getOneTag(guildId, tagId) {
	initGuild(guildId);

	const get_one_tag = db.prepare(
		`SELECT * FROM TAGS_${guildId}` +
		'	WHERE id = ?;',
	);
	return get_one_tag.get(Number(tagId));
}

function insertOneTag(guildId, content, trigger, user) {
	initGuild(guildId);

	const insert_one_tag = db.prepare(
		`INSERT INTO TAGS_${guildId}` +
		'(content, trigger, createdUser, createdDate, editedUser, editedDate)' +
		'VALUES (?, ?, ?, ?, ?, ?);',
	);

	return insert_one_tag.run(
		content.substring(0, 4000),
		trigger,
		user.id,
		new Date().toString(),
		user.id,
		new Date().toString(),
	);
}

function updateOneTag(guildId, tagId, content, trigger, user) {
	initGuild(guildId);

	const update_one_tag = db.prepare(
		`UPDATE TAGS_${guildId} SET ` +
		'content = ?, ' +
		'trigger = ?, ' +
		'editedUser = ?, ' +
		'editedDate = ? ' +
		'WHERE id = ?;',
	);

	return update_one_tag.run(
		content.substring(0, 4000),
		trigger,
		user.id,
		new Date().toString(),
		tagId,
	);
}

function deleteOneTag(guildId, tagId) {
	initGuild(guildId);

	const update_one_tag = db.prepare(
		`DELETE FROM TAGS_${guildId} ` +
		'WHERE id = ?;',
	);

	return update_one_tag.run(
		tagId,
	);
}