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

  // Get systemId for current user
  let systemId;
  try {
    const userRes = await fetch(`${config.apiBaseUrl}/user/${user.id}`, {
      headers: apiHeaders
    });
    const userData = await userRes.json();
    if (!userRes.ok || !userData?.systemId) return interaction.respond([]);
    systemId = userData.systemId;
  } catch (err) {
    logger.error('[Autocomplete] Failed to fetch user:', err);
    return interaction.respond([]);
  }

  const fetchAndFilter = async (endpoint, getListFn) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/system/${systemId}/${endpoint}`, {
        headers: apiHeaders
      });
      const items = await res.json();
      const filtered = items
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(i => i.name.toLowerCase().includes(focused.value.toLowerCase()))
        .slice(0, 25)
        .map(getListFn);
      return interaction.respond(filtered);
    } catch (err) {
      logger.error(`[Autocomplete] Failed to fetch ${endpoint}:`, err);
      return interaction.respond([]);
    }
  };

  // Proxy-based commands
  if ([
    'editproxy', 'deleteproxy', 'setavatar', 'settags', 'setbanner', 'proxyinfo'
  ].includes(commandName)) {
    return fetchAndFilter('proxies', p => ({ name: `${p.id} - ${p.name}`, value: p.id }));
  }

  // Autoproxy member mode
  if (commandName === 'autoproxy' && focused.name === 'member') {
    return fetchAndFilter('proxies', p => ({ name: `${p.name} (${p.id})`, value: p.id }));
  }

  // Lookup proxies globally
  if (commandName === 'lookupproxy') {
    try {
      const res = await fetch(`${config.apiBaseUrl}/proxy`, { headers: apiHeaders });
      const all = await res.json();
      const filtered = all
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(p => p.name.toLowerCase().includes(focused.value.toLowerCase()))
        .slice(0, 25)
        .map(p => ({ name: `${p.name} (${p.id})`, value: p.id }));
      return interaction.respond(filtered);
    } catch (err) {
      logger.error('[Autocomplete] Failed to fetch all proxies:', err);
      return interaction.respond([]);
    }
  }

  // Group commands
  if ([
    'groupinfo', 'editgroup', 'deletegroup', 'lookupgroup'
  ].includes(commandName)) {
    return fetchAndFilter('groups', g => ({ name: `${g.id} - ${g.name}`, value: g.id }));
  }

  if (commandName === 'addmembertogroup') {
    if (focused.name === 'proxy') {
      return fetchAndFilter('proxies', p => ({ name: `${p.name}`, value: p.id }));
    }
    if (focused.name === 'group') {
      return fetchAndFilter('groups', g => ({ name: `${g.name}`, value: g.id }));
    }
  }

  if (commandName === 'removememberfromgroup') {
    if (focused.name === 'group') {
      return fetchAndFilter('groups', g => ({ name: g.name, value: g.id }));
    }
    if (focused.name === 'proxy') {
      try {
        const groupId = options.getString('group');
        if (!groupId) return interaction.respond([]);

        const groupRes = await fetch(`${config.apiBaseUrl}/system/${systemId}/groups`, {
          headers: apiHeaders
        });
        const groups = await groupRes.json();
        const selected = groups.find(g => g.id === groupId);
        if (!selected) return interaction.respond([]);

        const memberRes = await fetch(`${config.apiBaseUrl}/system/${systemId}/proxies`, {
          headers: apiHeaders
        });
        const members = await memberRes.json();

        const filtered = members
          .filter(m => selected.members.includes(m.id))
          .filter(m => m.name.toLowerCase().includes(focused.value.toLowerCase()))
          .slice(0, 25)
          .map(m => ({ name: m.name, value: m.id }));

        return interaction.respond(filtered);
      } catch (err) {
        logger.error('[Autocomplete] Failed to fetch members for group:', err);
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
      if (!userRes.ok || !userData?.systemId) return interaction.respond([]);
      const targetSystemId = userData.systemId;

      if (type === 'member') {
        const res = await fetch(`${config.apiBaseUrl}/system/${targetSystemId}/proxies`, {
          headers: apiHeaders
        });
        const data = await res.json();
        return interaction.respond(
          data.filter(p => p.name.toLowerCase().includes(focused.value.toLowerCase()))
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
          data.filter(g => g.name.toLowerCase().includes(focused.value.toLowerCase()))
              .slice(0, 25)
              .map(g => ({ name: `${g.name} (${g.id})`, value: g.id }))
        );
      }

      if (type === 'system') {
        const res = await fetch(`${config.apiBaseUrl}/system?systemId=${targetSystemId}`, {
          headers: apiHeaders
        });
        const system = await res.json();
        return interaction.respond([{ name: `${system.name} (${system.id})`, value: system.id }]);
      }
    } catch (err) {
      logger.error('[Autocomplete] Failed to fetch data for /setid:', err);
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
        systems.filter(s => s.name.toLowerCase().includes(focused.value.toLowerCase()))
               .slice(0, 25)
               .map(s => ({ name: `${s.name} (${s.id})`, value: s.id }))
      );
    } catch (err) {
      logger.error('[Autocomplete] Failed to fetch systems:', err);
      return interaction.respond([]);
    }
  }
};