// لجعل جليتش 24 ساعة بيعمل مونتر
const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 180000);
require("events").EventEmitter.defaultMaxListeners = 15;
// منتور لنفسه
setInterval(() => {
    fetch(`http://${process.env.PROJECT_DOMAIN}.glitch.me`)
}, 60000);

//************************************************ Z C o o L ************************************************************

// الاساس
const Discord = require("discord.js");
const client = new Discord.Client();

// باكدجات
const request = require("request");
const fs = require("fs");
const pretty = require("pretty-ms");
const waiting = new Set();

//************************************************ Z C o o L ************************************************************
//********************************************** MY NAME IS TITO  *******************************************************

var devs = ["YOUR ID"];

function hook(messagePost, channelsPost, client) {
    
   channelsPost.fetchWebhooks().then(webhook => {
     let foundhook = webhook.find(we => we.name === client.user.username);
     console.log(foundhook)
     
        try {
          
    foundhook.send(messagePost, {
            'username': client.user.username,
            'avatar': client.user.avatarURL()
		});
          channelsPost.createOverwrite(channelsPost.guild.id,{
                SEND_MESSAGES: false,
                READ_MESSAGES: true,
                EMBED_LINKS: true,
                MANAGE_WEBHOOKS: true
              
                });
    } catch {
      channelsPost.createWebhook(`${client.user.username}`,{avatar: client.user.avatarURL()})
        .then(weebhook => {
          weebhook.send(messagePost, {
            'username': client.user.username,
            'avatar': client.user.avatarURL()
          });
                channelsPost.createOverwrite(channelsPost.guild.id,{
                SEND_MESSAGES: false,
                READ_MESSAGES: true,
                EMBED_LINKS: true,
                MANAGE_WEBHOOKS: true
              
                });
  });
    }; 
     
   });

};

//************************************************ Z C o o L ************************************************************

client.login(process.env.TOKEN);

//************************************************ ( السيرفرات ) ************************************************************

// servers
const servers = JSON.parse(fs.readFileSync("./servers.json", "utf8"));
client.on("message", message => {
// المتغيرات واختصاراتها
  let serverID = message.guild.id;
  let User = message.author;
  let bot = User.bot;
  let dm = message.channel.type == "dm";
  let serverMessage = message.content.toLowerCase(); // كود الرسالة اللي هيكتبها الاولي
  let embed = new Discord.MessageEmbed().setColor("RANDOM"); // كود الامبيد
  let deleteMessage = m => m.delete({ timeout: 5000 }); // كول داون مسح الرسالة
  let sendEmbed = message.channel; // معرفة الروم اللي كاتب فيها

// تسجيل بيانات السيرفرات
  if (!servers[serverID] && !message.author.bot) {
    (servers[serverID] = {
      "serverID": serverID,
      "serverName": message.guild.name,
      "serverPrefix": '-',
      "serverLanguage": 'Arabic',
      "serverPostChannel": 0,
      "serverPostTime": 0,
      "serverBlackList": "NO",
      "serverPlan": "Free",
      "serverPlanTime": 0
    }),
      fs.writeFile("./servers.json", JSON.stringify(servers), err => {
        if (err) console.error(err);
      });  
  };
  let findChannels = client.channels.cache; // بحث عن الروم
  let planPrime = servers[serverID].serverPlan; // السيرفر برايم ولا عادي
  let serverPrefix = servers[serverID].serverPrefix; // برفكس السيرفر
  let blackListServer = servers[serverID].serverBlackList; // سيرفرات البلاك لست
  let language = servers[serverID].serverLanguage; // لغة البوت حسب السيرفر
  let emojiSeed = '<a:PostlinkSeed:753547300587962420>'; // ايموجي علامة الصح
  if (bot || dm) return;

// رومات النشر
  if (serverMessage.startsWith(serverPrefix + 'setchannel')) {
    if (language === 'English') return;
    let botsIN = message.guild.members.cache.filter(m => m.user.bot).size;
    let filter = message.guild.members.cache.filter(m => m.presence.status == "online").size;
    console.log(botsIN);
    
    let memberOn = filter - botsIN;
    if (memberOn < 10) return embed.setDescription(`**يجب ان يكون هناك \`10\` اشخاص اون لاين علي الاقل لبدء استخدام البوت لديك الان \`${memberOn}\` اون لاين ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    
    if (blackListServer === 'YES') return embed.setDescription(`**لقد تم حظر السيرفر لمخالفة الشروط والقوانين ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    if (!message.guild.member(User).hasPermission('ADMINISTRATOR')) return embed.setDescription(`**لا تمتلك صلاحية \`ADMINISTRATOR\` :no_mouth:**`),sendEmbed.send(embed).then(deleteMessage);
    var messageSetting = serverMessage.split(" ").slice(1).join(" ");
    
    if (!messageSetting) return embed.setDescription(`**برجاء قم بكتابة اسم التشانل او كتابة الايدي الخاص بها! ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    if (isNaN(messageSetting)) { 
    let channelIS = message.guild.channels.cache.find(ch => ch.name === messageSetting);
    if (!channelIS) return embed.setDescription(`**برجاء قم بالتاكد من اسم التشانل او كتابة الايدي الخاص بها! ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    if (channelIS.id === servers[serverID].serverPostChannel) {
      embed.setDescription(`**لقد قمت بالفعل بإضافة تلك التشانل من قبل! ⚠️**`);
      sendEmbed.send(embed).then(deleteMessage);
      return;
    };
    if (channelIS.id != servers[serverID].serverPostChannel) {
      servers[serverID].serverPostChannel = channelIS.id;
      embed.setDescription(`**.لقد تم التثبيت بنجاح ${emojiSeed}**`);
      sendEmbed.send(embed).then(deleteMessage);
    //  console.log(channelIS);
    };
 
  } else {
    let channelIS = message.guild.channels.cache.find(ch => ch.id == messageSetting);
    if (!channelIS) return embed.setDescription(`**برجاء قم بالتاكد من الايدي! ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    if (messageSetting === servers[serverID].serverPostChannel) {
      embed.setDescription(`**لقد قمت بالفعل بإضافة تلك التشانل من قبل! ⚠️**`);
      sendEmbed.send(embed).then(deleteMessage);
      return;
    };
    if (messageSetting !== servers[serverID].serverPostChannel) {
      servers[serverID].serverPostChannel = messageSetting;
      embed.setDescription(`**.لقد تم التثبيت بنجاح ${emojiSeed}**`);
      sendEmbed.send(embed).then(deleteMessage);
    };
  };
    
};

// الرومات الي هيتنشر فيها  
  if (message.content.toLowerCase() === serverPrefix + "post") {
    if (language === 'English') return;
    if (blackListServer === 'YES') return embed.setDescription(`**لقد تم حظر السيرفر لمخالفة الشروط والقوانين ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    if (!message.guild.member(User).hasPermission('ADMINISTRATOR')) return embed.setDescription(`**لا تمتلك صلاحية \`ADMINISTRATOR\` :no_mouth:**`),sendEmbed.send(embed).then(deleteMessage);
    let cooldown = 8.64e7; // اليوم بالثانية
    let postServer = servers[serverID].serverPostChannel; // الوقت بتاع نشر السيرفر فيه كام ثانية
    let postTime = servers[serverID].serverPostTime;
    if (!postServer && postServer === 0) return embed.setDescription(`**برجاء قم بعمل روم خاصة للنشر! ⚠️**`),message.channel.send(embed);
    if (!postServer && postServer != 0) return postServer = 0 , embed.setDescription(`**إذا قم بحذف الروم مرة اخري سوف يتم حظر السيرفر! ⚠️**`),message.channel.send(embed);
    if (postTime !== null && cooldown - (Date.now() - postTime) > 0) {
    let postServerTime = cooldown - (Date.now() - postTime); // حساب الثواني المتبقية
      embed.setDescription(`**:stopwatch: | ${message.author.username}, الوقت المتبقي لإعادة نشر السيرفر\n\`${pretty(postServerTime, {verbose: true})}.\`**`);
      message.channel.send(embed);
      return;
    } else {
      // لو حد حب يلعب في الاعدادات
      if (!postServer && postServer === 0) return embed.setDescription(`**برجاء قم بعمل روم خاصة للنشر! ⚠️**`),message.channel.send(embed);
      if (!postServer && postServer != 0) return postServer = 0 , embed.setDescription(`**إذا قم بحذف الروم مرة اخري سوف يتم حظر السيرفر! ⚠️**`),message.channel.send(embed);
      servers[serverID].serverPostTime = Date.now(); // كول داون نشر السيرفر
      if (!message.guild.member(client.user).hasPermission("ADMINISTRATOR")) return embed.setDescription(`**برجاء عدم العبث في صلاحيات البوت لكي تتجنب حظر السيرفر! ⚠️**`),message.channel.send(embed);     
      
      var list = []; // قائمة السيرفرات اللي هيقفشها عشان لو مسك تشانلات هيبقي ابطئ 
      client.guilds.cache.forEach(sb => {
    
        list.push(sb.id);
        
      }); // السيرفرات اللي فيها البوت
      var idChannelsFree = []; // قائمة التشانلات اللي تنفع للاعلانات
      for (let i =0; i < list.length;){
        if (servers[list[i]] && servers[list[i]].serverPostChannel != 0) {
          idChannelsFree.push(servers[list[i]].serverPostChannel);
          i++
        } else {
          i++
        };
           
      }; // فلتر نشر في السيرفرات اللي عاملة تشانل بس
      for (let u = 0;u < idChannelsFree.length;u++) {
        let channelsPost = findChannels.find(ch => ch.id == idChannelsFree[u]);
        message.channel.createInvite({
          temporary: true,
          max_uses: 0,
          max_age: 0
        }).then(invite => {
        let messagePosts = `**${message.guild.name}**\n**:mailbox_with_no_mail: :** ${invite.url}`;
        if (channelsPost && messagePosts) {
          
          setTimeout(() =>{
            
            hook(messagePosts, channelsPost, client);
            
          }, 1000);
        }; 
        }).catch(err => console.log(err));    
      }; // النشر ذات نفسه

    }; 
  };

// حظر السيرفرات
  if (serverMessage.startsWith(serverPrefix + 'black')) {
    if (!devs.includes(User.id)) return;
    var black = serverMessage.split(" ").slice(1).join(" ");
    if (servers[black] && servers[black].serverBlackList === 'YES') return embed.setDescription(`**لقد تم حظر السيرفر بالفعل ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    servers[black].serverBlackList = 'YES';
    embed.setDescription(`**لقد تم حظر السيرفر بنجاح ${emojiSeed}**`),sendEmbed.send(embed).then(deleteMessage);
  };
  if (serverMessage.startsWith(serverPrefix + 'unblack')) {
    if (!devs.includes(User.id)) return;
    var black = serverMessage.split(" ").slice(1).join(" ");
    if (servers[black] && servers[black].serverBlackList === 'NO') return embed.setDescription(`**ان السيرفر ليس في قائمة الحظر ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    servers[black].serverBlackList = 'NO';
    embed.setDescription(`**لقد تم إزالة الحظر من السيرفر بنجاح ${emojiSeed}**`),sendEmbed.send(embed).then(deleteMessage);
  }; 
  if (serverMessage.startsWith(serverPrefix + 'addpre')) {
    if (!devs.includes(User.id)) return;
    var Premium = serverMessage.split(" ").slice(1).join(" ");
    if (servers[Premium] && servers[Premium].serverPlan === 'Premium') return embed.setDescription(`**ان سيرفر \`${servers[Premium].serverName}\` \`Premium\` بالفعل ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    servers[Premium].serverPlan = 'Premium';
    servers[Premium].serverPlanTime = Date.now();
    embed.setDescription(`**تم إضافة سيرفر \`${servers[Premium].serverName}\` إلي الـ \`Premium\` بنجاح ${emojiSeed}**`),sendEmbed.send(embed).then(deleteMessage);
  }; 
  if (serverMessage.startsWith(serverPrefix + 'removepre')) {
    if (!devs.includes(User.id)) return;
    var Premium = serverMessage.split(" ").slice(1).join(" ");
    if (servers[Premium] && servers[Premium].serverPlan === 'Free') return embed.setDescription(`**ان سيرفر \`${servers[Premium].serverName}\` \`Free\` بالفعل ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    servers[serverID].serverLanguage = 'Arabic';
    servers[serverID].serverPrefix = '-';
    servers[Premium].serverPlan = 'Free';
    servers[Premium].serverPlanTime = 0;
    embed.setDescription(`**تم إزالة سيرفر \`${servers[Premium].serverName}\` من الـ \`Premium\` بنجاح ${emojiSeed}**`),sendEmbed.send(embed).then(deleteMessage);
  }; 
  if (serverMessage === serverPrefix + 'pre' || serverMessage === serverPrefix + 'premium') {
    if (servers[serverID] && servers[serverID].serverPlan === 'Free') return embed.setDescription(`**ان سيرفر \`${servers[serverID].serverName}\`  ليس مشترك في الـ \`Premium\` ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    let cooldown = 8.64e7;
    let preTime = servers[serverID].serverPlanTime; // الوقت بتاع المستخدم فيه كام ثانية
    let preNow = cooldown - (Date.now() - preTime);
    if (preTime !== null && preNow > 0) {
        embed.setDescription(`**الوقت المتبقي علي إنتهاء الاشتراك \`${pretty(preNow, {verbose: true})}\`**`),sendEmbed.send(embed);
    } else {
        servers[serverID].serverLanguage = 'Arabic';
        servers[serverID].serverPrefix = '-';
        servers[serverID].serverPlan = 'Free';
        servers[serverID].serverPlanTime = 0;
        embed.setDescription(`**انتهي اشتراك البرايم في هذا السيرفر ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
    };
  }; 
  
// البرايم
  if (serverMessage.startsWith(serverPrefix + 'setting')) {
  if (language === 'English') return;
  if (blackListServer === 'YES') return embed.setDescription(`**لقد تم حظر السيرفر لمخالفة الشروط والقوانين ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
  if (!message.guild.member(User).hasPermission('MANAGE_SERVER')) return embed.setDescription(`**لا تمتلك صلاحية \`Manage server\` :no_mouth:**`),sendEmbed.send(embed).then(deleteMessage);
  if (planPrime === 'Free') return embed.setDescription(`**هذا السيرفر ليس مشترك في خدمات البرايم ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
  var messageUser = serverMessage.split(" ").slice(1).join(" ");
  var messageSetting = serverMessage.split(" ").slice(2).join(" ");
  let cooldown = 8.64e7;
  let preTime = servers[serverID].serverPlanTime; // الوقت بتاع المستخدم فيه كام ثانية
  let preNow = cooldown - (Date.now() - preTime);
  if (preTime !== null && preNow > 0) {
  if (messageUser.includes('prefix')) {
      if (!messageSetting) return embed.setDescription(`**برجاء ادخال البرفكس الجديد بعد الامر ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
      if (!message.member.hasPermission("ADMINISTRATOR")) return embed.setDescription(`انت لا تملك صلاحيات **\`"ADMINISTRATOR"\`** ⚠️`),sendEmbed.send(embed).then(deleteMessage);
      if (messageSetting === servers[serverID].serverPrefix) {
        embed.setDescription(`**هذا هوا البرفكس الخاص بالسيرفر بالفعل.! ⚠️**`);
        sendEmbed.send(embed).then(deleteMessage);
        return;
      };
      if (messageSetting !== servers[serverID].serverPrefix) {
        servers[serverID].serverPrefix = messageSetting;
        embed.setDescription(`**تم تغيير البرفكس الخاص بالسيرفر بنجاح ${emojiSeed}**\n**\`${servers[serverID].serverPrefix}\` البرفكس الجديد هوا**`);
        sendEmbed.send(embed).then(deleteMessage);
    };
    };
  } else {
    servers[serverID].serverLanguage = 'Arabic';
    servers[serverID].serverPrefix = '-';
    servers[serverID].serverPlan = 'Free';
    servers[serverID].serverPlanTime = 0;
    embed.setDescription(`**انتهي اشتراك البرايم في هذا السيرفر ⚠️**`),sendEmbed.send(embed).then(deleteMessage);
  };
};

// الاب تايم
  if (message.content.toLowerCase() === serverPrefix + "uptime") {
  let uptime = client.uptime;

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let notCompleted = true;

  while (notCompleted) {
    if (uptime >= 8.64e7) {
      days++;
      uptime -= 8.64e7;
    } else if (uptime >= 3.6e6) {
      hours++;
      uptime -= 3.6e6;
    } else if (uptime >= 60000) {
      minutes++;
      uptime -= 60000;
    } else if (uptime >= 1000) {
      seconds++;
      uptime -= 1000;
    }

    if (uptime < 1000) notCompleted = false;
  }
  let embeds = new Discord.MessageEmbed()
    .setTitle("**`System UP-Time`** <a:as_on:753234194439864441>")
    .setColor("#82ffd0")
    .setDescription(
      `**› [${days}] يوم  › [${hours}] ساعة  › [${minutes}] دقيقة › [${seconds}] ثانية**`
    )
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL());
  message.channel.send(embeds);
  }
// البينج
  if (message.content.toLowerCase() === serverPrefix + "ping") {
  let start = Date.now();
  let embed = new Discord.MessageEmbed().setColor("RANDOM");

  message.channel.send(embed).then(message => {


      embed.setDescription(`Time taken: ${Date.now() - start} ms\nDiscord API: ${client.ws.ping.toFixed(0)} ms`);
    message.edit(embed);
  });
  };
// معلومات عن البوت
  if (message.content.toLowerCase() === serverPrefix + "botinfo") {   
  message.channel.send({
    embed: new Discord.MessageEmbed()
      .setAuthor(client.user.username, client.user.avatarURL(),'https://bit.ly/2SHzk90')
      .setThumbnail(message.author.avatarURL())
      .setColor("RANDOM")
      .setTitle('اضغط هنا لإضافة البوت إلي سيرفرك')
      .setURL('https://bit.ly/2SHzk90')
      .addField("Tag", `**\`${client.user.tag}\`**`, true)
      .addField("Ping", `**\`${Date.now() - message.createdTimestamp} MS\`**`, true)
      .addField("RAM Usage",`**\`${(process.memoryUsage().rss / 1048576).toFixed()} MB\`**`, true)
      .addField("Servers", `**\`${client.guilds.cache.size}\`**`, true)
      .addField("Channels", `**\`${client.channels.cache.size}\`**`, true)
      .addField("Users", `**\`${client.users.cache.size}\`**`, true)
      .addField("ID", `**\`${client.user.id}\`**`, true)
      .addField("Prefix", `**\`${serverPrefix}\`**`, true)
      .addField("Language", `**\`JavaScript\`**`, true)
      .setTimestamp()
      .setFooter(client.user.username,client.user.avatarURL())
  });
  };
// help
  if (message.content.toLowerCase() === serverPrefix + "help") {
      message.author.send(`يساعدك بوت **${client.user.username}** على نشر سيرفرك\nفي ديسكورد بلا حدود إطلاقاً.. جربه الان :star_struck:!\nأوامر **${client.user.username}** العامة :busts_in_silhouette:\n> **${serverPrefix}setchannel** : تعيين روم النشر\n> **${serverPrefix}post** : نشر السيرفر\n> **${serverPrefix}botinfo** : معلومات البوت\n> **${serverPrefix}ping** : سرعة اتصال البوت\n> **${serverPrefix}help** : قائمة الاوامر\n\n  :camping: **Premium** إشتراك \n> **${serverPrefix}premium** : معرفة مدة الاشتراك\n> **${serverPrefix}autopost** : نشر تلقائي كل 6 ساعات\n> **${serverPrefix}settings prefix** : لتغيير البرفكس الخاص بالسيرفر\n> **${serverPrefix}settings language** : تعين لُغة البوت\n\nفماذا تنتظر! أضفه الأن وانُشر سيرفرك.\n:package: : [ https://bit.ly/2SHzk90 ]\n**Support :** discord.gg/yjJK5hf `)
     .then(message.react("a:PostlinkTrue:753547290626752552")).catch(err => message.react("a:PostlinkFalse:753547293839458374"));
  };

  
  
// لتسجيل البيانات
  fs.writeFile("./servers.json", JSON.stringify(servers), err => {
  
  if (err) console.error(err).catch(err => {
    console.error(err);
    return;
  });
  return;
});
  return;
});

//********************************************** MY NAME IS TITO  *******************************************************

// لوج البوت لما يشتغل
client.on("ready", function() {
  console.log("╔[════════════]╗");
  console.log(" System Is Online");
  console.log("╚[════════════]╝");
  var statuss = [
    `Welcome To ${client.user.username}.`,
    `Everyone here is a family`,
    `Developer: ◥🆃🅸◣•◢🅃🄾◤`,
    `-help | ${client.user.username}`,
    `Servers: ${client.guilds.cache.size} | Users: ${client.users.cache.size}`
  ];
  setInterval(() => {
    client.user.setActivity(
      statuss[Math.floor(Math.random() * statuss.length)]
    );
  }, 5000);
});

// شكر اضافة البوت
client.on("guildCreate", guild => {
  guild.owner.send("يساعدك بوت **Postlink bot®** على نشر سيرفرك\nفي ديسكورد بلا حدود إطلاقاً.. جربه الان :star_struck:!\nأوامر **Postlink bot®** العامة :busts_in_silhouette:\n> **-setchannel** : تعيين روم النشر\n> **-post** : نشر السيرفر\n> **-botinfo** : معلومات البوت\n> **-ping** : سرعة اتصال البوت\n> **-help** : قائمة الاوامر");
});
