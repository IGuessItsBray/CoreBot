// corebot/apps/bot/handlers/autocompleteHandler.js

const config = require('../../../config/configLoader');
const logger = require('../../../shared/utils/logger')('Autocomplete');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const apiHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${config.botAPIToken}`
};

module.exports = async (interaction) => {
  const { commandName, options, user } = interaction;
  const focused = options.getFocused(true);

  logger.info(`[Autocomplete] ${commandName} → "${focused.value}"`);

  const fetchAndFilter = async (endpoint, systemId, getListFn) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/system/${systemId}/${endpoint}`, {
        headers: apiHeaders
      });
      const items = await res.json();
      return interaction.respond(
        items
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(i => i.name.toLowerCase().includes(focused.value.toLowerCase()))
          .slice(0, 25)
          .map(getListFn)
      );
    } catch (err) {
      logger.error(`[Autocomplete] Failed to fetch ${endpoint}:`, err);
      return interaction.respond([]);
    }
  };

  const getSystemId = async (discordId) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/user/${discordId}`, {
        headers: apiHeaders
      });
      const data = await res.json();
      return res.ok ? data.systemId : null;
    } catch (err) {
      logger.error('[Autocomplete] Failed to fetch user systemId:', err);
      return null;
    }
  };

  const systemId = await getSystemId(user.id);
  if (!systemId) return interaction.respond([]);

  // --- Proxy-based Commands ---
  if ([
    'editproxy', 'deleteproxy', 'setavatar', 'settags', 'setbanner', 'proxyinfo'
  ].includes(commandName)) {
    return fetchAndFilter('proxies', systemId, p => ({ name: `${p.id} - ${p.name}`, value: p.id }));
  }

  if (commandName === 'autoproxy' && focused.name === 'member') {
    return fetchAndFilter('proxies', systemId, p => ({ name: `${p.name} (${p.id})`, value: p.id }));
  }

  if (commandName === 'lookupproxy') {
    try {
      const res = await fetch(`${config.apiBaseUrl}/proxy`, { headers: apiHeaders });
      const all = await res.json();
      return interaction.respond(
        all
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(p => p.name.toLowerCase().includes(focused.value.toLowerCase()))
          .slice(0, 25)
          .map(p => ({ name: `${p.name} (${p.id})`, value: p.id }))
      );
    } catch (err) {
      logger.error('[Autocomplete] Failed to fetch all proxies:', err);
      return interaction.respond([]);
    }
  }

  // --- Group Commands ---
  if ([
    'groupinfo', 'editgroup', 'deletegroup', 'lookupgroup'
  ].includes(commandName)) {
    return fetchAndFilter('groups', systemId, g => ({ name: `${g.id} - ${g.name}`, value: g.id }));
  }

  if (commandName === 'addmembertogroup') {
    if (focused.name === 'proxy') {
      return fetchAndFilter('proxies', systemId, p => ({ name: p.name, value: p.id }));
    } else if (focused.name === 'group') {
      return fetchAndFilter('groups', systemId, g => ({ name: g.name, value: g.id }));
    }
  }

  if (commandName === 'removememberfromgroup') {
    if (focused.name === 'group') {
      return fetchAndFilter('groups', systemId, g => ({ name: g.name, value: g.id }));
    } else if (focused.name === 'proxy') {
      try {
        const groupId = options.getString('group');
        if (!groupId) return interaction.respond([]);

        const groupRes = await fetch(`${config.apiBaseUrl}/system/${systemId}/groups`, { headers: apiHeaders });
        const groups = await groupRes.json();
        const selected = groups.find(g => g.id === groupId);
        if (!selected) return interaction.respond([]);

        const proxyRes = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`, { headers: apiHeaders });
        const proxies = await proxyRes.json();

        return interaction.respond(
          proxies
            .filter(p => selected.members.includes(p.id))
            .filter(p => p.name.toLowerCase().includes(focused.value.toLowerCase()))
            .slice(0, 25)
            .map(p => ({ name: p.name, value: p.id }))
        );
      } catch (err) {
        logger.error('[Autocomplete] Failed to fetch group members:', err);
        return interaction.respond([]);
      }
    }
  }

 if (commandName === 'setid') {
  const type = options.getString('type');
  const targetUser = options.getString('user');
  if (!type || !targetUser) return interaction.respond([]);

  try {
    const userRes = await fetch(`${config.apiBaseUrl}/user/${targetUser}`, {
      headers: apiHeaders
    });
    const userData = await userRes.json();
    if (!userRes.ok || !userData?.systemId) {
      logger.warn('[Autocomplete] User has no system');
      return interaction.respond([]);
    }

    const targetSystemId = userData.systemId;

    if (type === 'member') {
      const res = await fetch(`${config.apiBaseUrl}/system/${targetSystemId}/proxies`, {
        headers: apiHeaders
      });
      const data = await res.json();
      return interaction.respond(
        data
          .filter(p => p.name.toLowerCase().includes(focused.value.toLowerCase()))
          .slice(0, 25)
          .map(p => ({ name: `${p.name} (${p.id})`, value: p.id }))
      );
    }

    if (type === 'group') {
      const res = await fetch(`${config.apiBaseUrl}/system/${targetSystemId}/groups`, {
        headers: apiHeaders
      });
      const data = await res.json();
      return interaction.respond(
        data
          .filter(g => g.name.toLowerCase().includes(focused.value.toLowerCase()))
          .slice(0, 25)
          .map(g => ({ name: `${g.name} (${g.id})`, value: g.id }))
      );
    }

if (type === 'system') {
  try {
    const systemUrl = `${config.apiBaseUrl}/system?systemId=${userData.systemId}`;
    logger.info(`[Autocomplete] Fetching system for setid. User: ${targetUser}, URL: ${systemUrl}`);

    const res = await fetch(systemUrl, {
      headers: {
        'Authorization': `Bearer ${config.botAPIToken}`
      }
    });

    if (!res.ok) {
      logger.warn(`[Autocomplete] Failed to fetch system ${userData.systemId}: HTTP ${res.status}`);
      return interaction.respond([]);
    }

    const system = await res.json();

    return interaction.respond([
      {
        name: `${system.name || 'Unnamed'} (${system.id})`,
        value: system.id
      }
    ]);
  } catch (err) {
    logger.error(`[Autocomplete] Error fetching system for setid:`, err);
    return interaction.respond([]);
  }
}

  } catch (err) {
    logger.error('[Autocomplete] Failed to fetch items for /setid:', err);
    return interaction.respond([]);
  }
}

  if (commandName === 'listproxies' && focused.name === 'system') {
    try {
      const res = await fetch(`${config.apiBaseUrl}/system/all`, {
        headers: apiHeaders
      });
      const systems = await res.json();
      return interaction.respond(
        systems
          .filter(s => s.name.toLowerCase().includes(focused.value.toLowerCase()))
          .slice(0, 25)
          .map(s => ({ name: `${s.name} (${s.id})`, value: s.id }))
      );
    } catch (err) {
      logger.error('[Autocomplete] Failed to fetch all systems:', err);
      return interaction.respond([]);
    }
  }
};