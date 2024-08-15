const { ShardingManager } = require("discord.js");
const { config } = require("./util/localStorage");
const { token } = require("./util/localStorage").config;

const manager = new ShardingManager("./bot.js", { token: token });

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

manager
  .spawn
  //{amount: 3} //Comment this line out to use the automatic recomended amount of shards
  ()

  .then((shards) => {
    require("./util/vars").shard = manager;

    shards.forEach((shard) => {
      shard.on("message", (message) => {
        console.log(
          `Shard[${shard.id}] : ${message._eval} : ${message._result}`
        );
      });
    });
  })
  .catch(console.error);
