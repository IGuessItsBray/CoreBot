const mongoose = require('mongoose');

const requiredString= {
	type: String,
	Required: true
}

const warnSchema = mongoose.Schema({

	guildID: requiredString,
	userID: requiredString,
	punishmentIDE: [String],

	warningInfo: {
		type:[object],
		require: true
	}
})

module.exports = mongoose.model('corebot', warnSchema)