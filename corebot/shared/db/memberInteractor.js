import { v4 as uuidv4 } from 'uuid';
import db from '../../../shared/utils/mongoClient.js';

const members = db.collection('members');

// Generate a 6-char alphanumeric ID (uppercase)
function generateMemberId() {
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

export async function createMember(systemId, data = {}) {
  const newMember = {
    _id: generateMemberId(),
    systemId,
    name: data.name || '',
    avatarURL: data.avatarURL || '',
    messageCount: 0,
    characterCount: 0,
    messagesByGuild: {}, // { guildId: [messageObj, ...] }
  };

  await members.insertOne(newMember);
  return newMember;
}

export async function getMemberById(id) {
  return members.findOne({ _id: id });
}

export async function incrementMessageStats(memberId, guildId, messageData) {
  const messageId = uuidv4();
  const messageRecord = {
    id: messageId,
    timestamp: new Date(),
    channel: messageData.channel,
    content: messageData.content,
    guild: guildId
  };

  await members.updateOne(
    { _id: memberId },
    {
      $inc: {
        messageCount: 1,
        characterCount: messageData.content.length
      },
      $push: {
        [`messagesByGuild.${guildId}`]: messageRecord
      }
    }
  );

  return messageId;
}