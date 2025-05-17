const express = require('express');
const Member = require('../../../shared/db/schemas/member');
const router = express.Router();
const createLogger = require('../../../shared/utils/logger');
const logger = createLogger('MemberAPI');

// GET /member/:id - fetch single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findOne({ id: req.params.id });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    logger.error('[GET /member/:id] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /member/system/:systemId - fetch all members in system
router.get('/system/:systemId', async (req, res) => {
  try {
    const members = await Member.find({ systemId: req.params.systemId });
    res.json(members);
  } catch (err) {
    logger.error('[GET /member/system/:systemId] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /member - create a new member
router.post('/', async (req, res) => {
  try {
    const { name, systemId } = req.body;
    const member = await Member.create({ name, systemId });
    res.status(201).json(member);
  } catch (err) {
    logger.error('[POST /member] Error:', err);
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// PUT /member/:id - update an existing member
router.put('/:id', async (req, res) => {
  try {
    const updated = await Member.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.json(updated);
  } catch (err) {
    logger.error('[PUT /member/:id] Error:', err);
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// DELETE /member/:id - remove a member
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Member.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    logger.error('[DELETE /member/:id] Error:', err);
    res.status(500).json({ error: 'Failed to delete member' });
  }
});
// PUT /member/:id/message - log a proxied message
router.put('/:id/message', async (req, res) => {
    const { guild, channel, content } = req.body;
  
    if (!guild || !channel || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      const member = await Member.findOne({ id: req.params.id });
      if (!member) return res.status(404).json({ error: 'Member not found' });
  
      const newMessage = {
        content,
        channel,
        guild,
      };
  
      // Find the guild log or create it
      let guildLog = member.guildLogs.find(g => g.guildId === guild);
  
      if (!guildLog) {
        // New guild entry with message
        member.guildLogs.push({ guildId: guild, messages: [newMessage] });
      } else {
        // Append message to existing guild entry
        guildLog.messages.push(newMessage);
      }
  
      member.messageCount += 1;
      member.characterCount += content.length;
  
      await member.save();
  
      res.json({ message: 'Logged message', member });
    } catch (err) {
      logger.error('[PUT /member/:id/message] Error:', err);
      res.status(500).json({ error: 'Failed to log message' });
    }
  });

// GET /member - fetch all members globally
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().select('id name').lean();
    res.json(members);
  } catch (err) {
    logger.error('[GET /member] Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;