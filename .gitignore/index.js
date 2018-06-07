const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX = ".";
const queue = new Map();
const EVERYONE = "@";

var client = new Discord.Client();

var bot = new Discord.Client();

var servers = {};

function play(connection, message) {
 var server = servers[message.guild.id];
    
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    
    server.queue.shift();
    
    server.dispatcher.on("end", function() {
     if (server.queue[0]) play(connection, message);
     else connection.disconnect();
    });
}

bot.on("ready", function () {
    bot.user.setActivity("DiversionBOT V2 - .help | Par Ilian, {
        'type': 'STREAMING',
        'url': "https://www.twitch.tv/sebilein001"
}),
    bot.user.setUsername("DiversionBOT - V2")
    var connection_embed = new Discord.RichEmbed()
        .setTitle("Je suis connecté")
        .setTimestamp()
        .setColor("#04B404")
    bot.channels.findAll("name", "log_channel").map(channel => channel.send(connection_embed));
    console.log("DiversionBOT V2 - Connecté");
});

//bot.on('message', function(message) {
  //  });

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name", "📄logs📄").sendMessage(member.toString() + " Bienvenue sur ``" + message.guild.name + "`` ! :white_check_mark:");
    member.addRole(member.guild.roles.find("name", "Membre Communauté Gmod"));
});

bot.on("guildMemberRemove", function(member) {
     member.guild.channels.find("name", "📄logs📄").sendMessage(member.toString() + " Bye bye!" + member.toString() + " :x:");
});


bot.on("message", async function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split (" ");

    var args2 = message.content.split(" ").slice(1);

    var suffix = args2.join(" ");

    var reason = args2.slice(1).join(" ");
    
    var reasontimed = args2.slice(2).join(' ')

    var user = message.mentions.users.first();
    
    var guild = message.guild;
    
    var member = message.member;

    var roleJoueur= member.guild.roles.find("name", "Membre Communauté Gmod")
    
    var roleMute = member.guild.roles.find("name", "Mute")
    
    var modlog = member.guild.channels.find("name", "📄logs📄")
    
    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
             message.channel.sendMessage("[Diversion Musique] - Vous devez mettre un lien.");   
             return;
            }
            if(!message.member.voiceChannel) {
             message.channel.sendMessage("[Diversion Musique] - Vous devez être dans un salon vocal.");   
             return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            
            var server = servers[message.guild.id];
      
            server.queue.push(args[1]);
            
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
               play(connection, message) 
            });
                var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + PREFIX + "play " + args +"``")
                .addField(---------------, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter("Par Ilian")
                .setColor("#04B404")
                .setTimestamp();
      bot.channels.findAll("name", "log_channel").map(channel => channel.send(log_embed));0
      console.log("-> " + PREFIX + "play\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n---------------------");
        break;    
      
        case "skip":
             if(!message.member.voiceChannel) {
             message.channel.sendMessage("[Diversion Musique] - Vous devez être dans un salon vocal.");   
             return;
            }
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
                      var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + PREFIX + "skip``")
                .addField(---------------, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter("Par Ilian")
                .setColor("#04B404")
                .setTimestamp();
      bot.channels.findAll("name", "log_channel").map(channel => channel.send(log_embed));0
      console.log("-> " + PREFIX + "skip\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n---------------------");
        break;    
      
        case "stop":
             if(!message.member.voiceChannel) {
             message.channel.sendMessage("[Diversion Musique] - Vous devez être dans un salon vocal.");   
             return;
            }
             const serverQueue = queue.get(message.guild.id);
             var server = servers[message.guild.id];
             if (!serverQueue) return message.channel.send("[Diversion Musique] - Aucune musique est joué, je ne peux donc pas exécuter cette commande. ❌")
            if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
                     var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + PREFIX + "stop``")
                .addField(---------------, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter("Par Ilian")
                .setColor("#04B404")
                .setTimestamp();
      bot.channels.findAll("name", "log_channel").map(channel => channel.send(log_embed));0
      console.log("-> " + PREFIX + "stop\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n---------------------");
        break;   
      
        case "servinfo":
            message.reply("Nous sommes``" + message.guild.memberCount + " membres`` sur ``" + message.guild.name + "`` !");
                      var log_embed = new Discord.RichEmbed()
                .setThumbnail(message.author.displayAvatarURL)
                .addField(message.author.username + " - Logs : ", "``" + PREFIX + "servinfo``")
                .addField(---------------, "Provenance du message : ``" + message.guild.name + "``\nDans le salon ``#" + message.channel.name + "``", true)
                .setFooter("Par Ilian")
                .setColor("#04B404")
                .setTimestamp();
      bot.channels.findAll("name", "log_channel").map(channel => channel.send(log_embed));0
      console.log("-> " + PREFIX + "servinfo\nAuteur : " + message.author.username + "\nLocalisation : " + message.guild.name + ", #" + message.channel.name + "\n---------------------");
        break;
      
        case "unmute":
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je retire la sanction: MUTE ?")
        member.removeRole(roleMute)
        message.channel.sendMessage(user.toString() + " a bien été unmute ✅")
        
        var embed = new Discord.RichEmbed()
        .addField("Commande :", "UNMUTE")
        .addField("Utilisateur :", user.username)
        .addField("Modérateur :", message.author.username)
        .addField("Heure:", message.channel.createdAt)
        .setColor("#3333cc")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
        break;
      
        case "mute":
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
        if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
        if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
        var member = message.mentions.members.first();
        if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: MUTE")
        message.channel.sendMessage(member.toString() + " a bien été mute. ✅")
        member.addRole(roleMute)

        var embed = new Discord.RichEmbed()
        .addField("Action :", "Mute")
        .addField("Utilisateur :", user.toString())
        .addField("Modérateur :", message.author.toString())
        .addField("Raison :", reasontimed)
        .setColor("#FFFF00")
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTimestamp()
        member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
        break;
      
        case "shelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
        var embed = new Discord.RichEmbed()
            .addField(PREFIX  + "ban", "Cette commande permet de bannir un utilisateur ! Pour l'utiliser, faites .ban @(utilisateur) + (raison)")
            .addField(PREFIX  + "kick", "Cette commande permet de kick un utilisateur ! Pour l'utiliser, faites .kick @(utilisateur) + (raison)")
             .addField(PREFIX  + "purge", "Cette commande permet de supprimé des messages beaucoup plus rapidement ! Pour l'utiliser, faites .purge (nombredemessages)")
             .addField(PREFIX  + "mute", "Cette commande permet de muté un utilisateur pendant un certain temps. Pour l'utiliser, faites .mute @(utilisateur) + (raison)")
             .addField(PREFIX  + "unmute", "Cette commande permet d'unmute un utilisateur. Pour l'utiliser, faites .unmute @(utilisateur)")
             .addField(PREFIX  + "staffhelp", "Cette commande permet d'afficher l'aide pour écrire les messages dans annonces")
            .setColor("#cc0000")
            .setFooter("Aide du staff.")
            .setAuthor("Pannel d'aide du staff")
            .setDescription("Voici les commandes du staff !")
            .setTimestamp()
            message.delete()
            message.channel.sendEmbed(embed)
        break;    
        
              case "staffhelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
        var embed = new Discord.RichEmbed()
            .addField("Info", "Il y a deux façon d'utiliser ces commandes, la façon avec la mention everyone et la façon sans, pour cela si vous voulez utiliser la mentions everyone marquer la commandes dans le salon ou le message va apparaître et en cas contraitre dans le salon #staff-command Cette info ne s'applique pas au Sondage car chaque Sondage doit avoir une mention !")
            .addField(PREFIX  + "newstaff", "Cette commande permet de faire un message dans le salon staff.")
            .addField(PREFIX  + "web", "Cette commande permet de faire un message dans le salon 🔔annonce.")
             .addField(PREFIX  + "new", "Cette commande permet de faire un message dans le salon 🔔nouveauté.")
             .addField(PREFIX  + "sondage", "Cette commande permet de faire un message dans le salon 🔔sondage. Merci d'utiliser cette commande lors de la créations d'un nouveau sondage.")
            .setColor("#cc0000")
            .setFooter("Aide du staff.")
            .setAuthor("Pannel d'aide du staff")
            .setDescription("Voici les commandes du staff !")
            .setTimestamp()
            message.delete()
            message.channel.sendEmbed(embed)
        break;   
      
        case "help":
            var help_embed = new Discord.RichEmbed()
                 .addField(PREFIX  + "ping", "Grâce à cette commande, tu pourras savoir ton ping !") 
                 .addField(PREFIX  + "reseaux", "Vous donne les réseaux sociaux  du serveur !")
                 .addField(PREFIX  + "play", "Jouer une musique !  Pour l'utiliser, faites .play (lien) !")
                 .addField(PREFIX  + "skip", "Sauter une musique  Pour l'utiliser, faites .skip !")
                 .addField(PREFIX  + "stop", "Arreter la musique  Pour l'utiliser, faites .stop !")
                 .addField(PREFIX  + "membre", "Permet de voir le nombre de personnes sur le discord !")
                 .addField(PREFIX  + "serveur", "Pour rejoindre nos Serveur !")
                 .addField(PREFIX  + "traductionhelp ", "Pour afficher l'aide des traductions !")
                 .addField(PREFIX  + "google", "Commande pas trop utile mais tu peut faire des recherche google. Pour l'utiliser, faites .google (recherche) !")
                 .addField(PREFIX  + "shelp", "❌Afficher les commandes du staff. Mais seule ceux qui ont la perm de kick pourrons y accèder. ❌")
                .setColor("#0000ff")
                .setFooter("Idée de commande ? Proposer en MP!")
                .setAuthor("Pannel d'aide")
                .setDescription("Voici les commandes du bot !")
                .setTimestamp()
                message.delete()
                      member.createDM().then(channel => {
                    return channel.send(help_embed)
             }).catch(console.error)
             //    message.channel.sendEmbed(embed)
            break;
        case "kick":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");
            if (reason.length < 1) return message.reply("Tu as oublié la raison ! :D");
            if (message.mentions.users.size < 1) return message.reply("Tu n'as pas mis son pseudo au complet ! :o")
            message.guild.member(user).kick();
            message.channel.send(user.toString() + " a bien été kick ✅")

            var embed = new Discord.RichEmbed()
            .addField("Commande :", "KICK")
            .addField("Utilisateur :", user.username)
            .addField("Modérateur :", message.author.username)
            .addField("Raison : ", reason)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#99ff33")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            bot.channels.get('429665350922141716').sendMessage(":white_check_mark: Le joueur " + user.username + " à bien été kick pour: " + reason);
       
            message.delete();
            break;
        case "ban":
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande.");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");
            if (reason.length < 1) return message.reply("Tu as oublié la raison.");
            if (message.mentions.users.size < 1) return message.reply("Tu as oublié de préciser qui je dois bannir..")
            
            message.guild.ban(user, 2);
            message.channel.send(user.toString() + " a bien été banni ✅")

            var embed = new Discord.RichEmbed()
            .addField("Commande :", "BAN")
            .addField("Utilisateur :", user.username)
            .addField("Modérateur :", message.author.username)
            .addField("Raison : ", reason)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#ff9933")
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTimestamp()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            
            bot.channels.get('429665350922141716').sendMessage(":white_check_mark: Le joueur " + user.username + " à bien été kick pour: " + reason);
            
            message.delete();
            break;
        case "purge":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
            var embed = new Discord.RichEmbed()
            .addField("Commande :", "Purge d'un Channel")
            .addField("Modérateur :", message.author.username)
            .addField("Message supprimé", messagecount)
            .addField("Heure:", message.channel.createdAt)
            .setColor("#009999")
            .setFooter("Ouf ! Sa as fait un bon ménage dans le serveur ! ^^")
            message.delete()
            member.guild.channels.find("name", "📄logs📄").sendEmbed(embed);
            break;

       case "reseaux":
            var embed = new Discord.RichEmbed()
                 .addField("Instagram", "Notre Instagram est **@diversonfr** ( https://www.instagram.com/diversonfr/ ). ") 
                 .addField("Twitter", "Notre Twitter est **@@diversionfrserv** ( https://twitter.com/diversionfrserv ). ")
                 .addField("Facebook", "Notre Facebook est **@diversion.serv.7** ( https://www.facebook.com/diversion.serv.7 ). ")
                .setFooter("By Ilian")
                .setAuthor("Réseaux Sociaux du Serveur")
                .setDescription("Pour l'actualité !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
           break;
      
       case "serveur":
           var embed = new Discord.RichEmbed()
                 .addField("Notre DarkRP", "steam://connect/54.37.198.10:27015")
                .setColor("#ffff00")
                .setFooter("Amuse toi bien sur nos serveur !")
                .setAuthor("Pannel des Serveurs")
                .setDescription("Petit rappelle, je vais seulement envoyé un liens pour que tu rejoins le serveur !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
            break;            
      
       case "ping":
        message.channel.sendMessage("Pong! Tu as actuellement `" + bot.ping + " ms !` :D");
        message.delete();
        break; 
            
       case "google":
        let glg = message.content.split(' ');
        glg.shift();
        console.log("J'ai rechercher!");
        message.reply('https://www.google.fr/#q=' + glg.join('%20'));
        break;

        case "traductionhelp":
            var embed = new Discord.RichEmbed()
                 .addField(".tradenfr", "Traduction Anglais ==> Français !") 
                 .addField(".tradfren", "Traduction Français ==> Anglais !")
                 .addField(".tradesfr", "Traduction Espagnol ==> Français !")
                 .addField(".tradfres", "Taduction Français ==> Espagnol !")
                 .addField(".tradesen", "Traduction Espagnol ==> Anglais !")
                 .addField(".tradenes", "Taduction Anglais ==> Espagnol !")            
                .setColor("#00ffcc")
                .setFooter("Amuse toi a traduire petit enfant !")
                .setAuthor("Pannel des Traduction")
                .setDescription("Petit rappelle le, je vais seulement envoyé un liens google traduction !")
                .setTimestamp()
                message.delete()
                message.channel.sendEmbed(embed)
            break;      
      
       case "tradenfr":
        let tradenfr = message.content.split(' ');
        tradenfr.shift();
        console.log("Traduction Anglais ==> Français");
        message.reply('https://translate.google.fr/#en/fr/' + tradenfr.join('%20'));
        break;
      
        case "tradfren":
         let tradfren = message.content.split(' ');
         tradfren.shift();
         console.log("Traduction Français ==> Anglais");
         message.reply('https://translate.google.fr/#fr/en/' + tradfren.join('%20'));
         break;
      
        case "tradesfr":
         let tradesfr = message.content.split(' ');
         tradesfr.shift();
         console.log("Traduction Espagnol ==> Français");
         message.reply('https://translate.google.fr/#es/fr/' + tradesfr.join('%20'));
         break;
      
        case "tradfres":
         let tradfres = message.content.split(' ');
         tradfres.shift();
         console.log("Traduction Français ==> Espagnol");
         message.reply('https://translate.google.fr/#fr/es/' + tradfres.join('%20'));
         break;      
      
        case "tradenes":
         let tradenes = message.content.split(' ');
         tradenes.shift();
         console.log("Traduction Anglais ==> Espagnol");
         message.reply('https://translate.google.fr/#en/es/' + tradesen.join('%20'))
         break;
      
       case "web":
           if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
         let annonce = message.content.split(" ");
         annonce.shift();
       var embed = new Discord.RichEmbed()
       .addField("Annonce !", " "+ annonce.join(" "))
       .setColor("#336699")
       .setFooter("By Ilian ! ^^")
       message.delete();
       message.channel.send("@everyone Nouvelle annonce")
       member.guild.channels.find("name", "🔔annonce").sendEmbed(embed);
       break;

       case "new":
         if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
       let newi = message.content.split(" ");
       newi.shift();
     var embed = new Discord.RichEmbed()
     .addField("Nouvauté !", " "+ newi.join(" "))
     .setColor("#FFFB00")
     .setFooter("By Ilian ! ^^")
     message.delete();
     message.channel.send("@everyone Du nouveau sur le serveur")
     member.guild.channels.find("name", "🔔nouveauté").sendEmbed(embed);
     break;

     case "sondage":
         if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
     let sondage = message.content.split(" ");
     sondage.shift();
   var embed = new Discord.RichEmbed()
   .addField("Sondage!", " "+ sondage.join(" "))
   .setColor("#FF0000")
   .setFooter("By Ilian ! ^^")
   message.delete();
   message.channel.send("@everyone Nouveaux sondage")
   member.guild.channels.find("name", "🔔sondage").sendEmbed(embed);
   break;

     case "newstaff":
         if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.sendMessage("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
                        message.delete()
     let staff = message.content.split(" ");
     staff.shift();
   var embed = new Discord.RichEmbed()
   .addField("Annonce!", " "+ staff.join(" "))
   .setColor("#FF0000")
   .setFooter("By Ilian ! ^^")
   message.delete();
   message.channel.send("@everyone Nouvelle annonce")
   member.guild.channels.find("name", "📍staff📍").sendEmbed(embed);
   break;
      
    }
});

bot.login(process.env.TOKEN);
