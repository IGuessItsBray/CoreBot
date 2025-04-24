// ------------------------------------------------------------------------------
// scheduler.js
// Schedule Jobs / Functions for run at a later date
// ------------------------------------------------------------------------------

module.exports = {
	scheduleJob,
	cancelJob,
	listJobs,
	resumeJobs,
};

class jobObj {
	constructor(id, args, intv, file, func) {
		this._id = id;
		this.args = args;
		this.intv = intv;
		this.file = file;
		this.func = func;
	}
}

const schedulerJobs = {};

const ns = require('node-schedule');
const moment = require('moment');

// ------------------------------------------------------------------------------
// Public Functions
// ------------------------------------------------------------------------------

async function listJobs() {
	return dbGetAll();
}

async function resumeJobs() {
	if(Object.keys(schedulerJobs).length) return;
	const jobs = await dbGetAll();
	jobs.forEach(dbJob => {
		const job = new jobObj(dbJob._id, dbJob.args, dbJob.intv, dbJob.file, dbJob.func);
		const date = moment(new Date(dbJob.intv));

		if(date.isBefore(moment.now())) {
			console.log(`Scheduler: Job ${dbJob._id} was missed, running now (${moment(dbJob.intv).calendar()}).`);
			executeJob(job._id);
		}
		else {
			const runtimeJob = ns.scheduleJob(job.intv, function() { executeJob(job._id); });
			schedulerJobs[dbJob._id] = runtimeJob;
			console.log(`Scheduler: Job ${dbJob._id} has been resumed for ${moment(dbJob.intv).fromNow()} (${moment(dbJob.intv).calendar()}).`);
		}
	});
}

async function cancelJob(id) {
	const runJob = schedulerJobs[id];
	runJob.cancel();
	await dbDel(id);
	console.log(`Scheduler: Job ${id} has been cancelled.`);
}


async function scheduleJob(file, func, args, intv) {
	const newId = (Math.round(Date.now())).toString(36).toUpperCase();
	const job = new jobObj(newId, args, intv, file, func);

	const runtimeJob = ns.scheduleJob(job.intv, function() { executeJob(job._id); });
	await dbPut(job)
		.then(j => console.log(`Scheduler: Job ${j._id} has been scheduled for ${moment(j.intv).fromNow()} (${moment(j.intv).calendar()}).`));

	schedulerJobs[newId] = runtimeJob;
}

async function executeJob(id) {
	const job = await dbGet(id);
	console.log(`Scheduler: Job ${job._id} Executing: ${job.func}`);

	try {
		await require(job.file)[job.func](...job.args);
	}
	catch (e) {
		console.error(`Scheduler: Job ${job._id} Failed, Job will be deleted.`, e?.message ?? '');
	}
	finally {
		await dbDel(id);
		delete schedulerJobs[id];
	}
}

// ------------------------------------------------------------------------------
// Private DB Functions
// ------------------------------------------------------------------------------

const mongoose = require('mongoose');
const mongo = require('../db/mongo').mongoose;
const schedulerSchema = mongoose.model(
	'scheduler',
	{
		_id: { type: String, required: true },
		args: { type: Array, required: true },
		intv: { type: Object, required: true },
		file: { type: String, required: true },
		func: { type: String, required: true },
	},
	'scheduler-jobs',
);

// Scheduler DB Access

async function dbPut (job) {
	return await mongo().then(async () => {
		try {
			return await schedulerSchema.findOneAndUpdate(
				{
					_id: job._id,
				},
				{
					_id:  job._id,
					args: job.args,
					intv: job.intv,
					file: job.file,
					func: job.func,
				},
				{
					upsert: true,
					new: true,
					useFindAndModify: false,
				},
			);
		}
		catch(e) {
			console.error('Scheduler DB: ', e ?? '');
		}

	});
}

async function dbGet (_id) {
	return await mongo().then(async () => {
		try {
			return await schedulerSchema.findOne(
				{ _id },
			);
		}
		catch(e) {
			console.error('Scheduler DB: ', e ?? '');
		}

	});
}

async function dbGetAll () {
	return await mongo().then(async () => {
		try {
			return await schedulerSchema.find({});
		}
		catch(e) {
			console.error('Scheduler DB: ', e ?? '');
		}

	});
}

async function dbDel (_id) {
	return await mongo().then(async () => {
		try {
			return await schedulerSchema.findOneAndDelete(
				{ _id },
			);
		}
		catch(e) {
			console.error('Scheduler DB: ', e ?? '');
		}

	});
}
// ------------------------------------------------------------------------------