const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const PREFIX = "d.";
const queue = new Map();
const EVERYONE = "@";

var client = new Discord.Client();

var bot = new Discord.Client();

var version = "V.1.0.2"

var emoji_instaID = "460456294285836288"
, emoji_twitterID = "460456343451598849"
, emoji_facebookID = "460456255870337035"

var emoji_insta = "<:emoji_insta:" + emoji_instaID + ">"
, emoji_twitter = "<:emoji_twitter:" + emoji_twitterID + ">"
, emoji_facebook = "<:emoji_facebook:" + emoji_facebookID + ">"

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
    bot.user.setActivity("DiversionBOT - " + PREFIX + "help | Par Ilian", {
        'type': 'STREAMING',
        'url': "https://www.twitch.tv/sebilein001"
}),
    bot.user.setUsername("DiversionBOT")
    var connection_embed = new Discord.RichEmbed()
        .setTitle("Je suis connecté")
        .setTimestamp()
        .setColor("#36393E")
    bot.channels.findAll("name", "log_channel").map(channel => channel.send(connection_embed));
    console.log("DiversionBOT - Connecté");
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
    
    var foother = "Demande de @" + message.author.username + "#" + message.author.discriminator + " ! | DiversionBOT - " + version

    var modlog = member.guild.channels.find("name", "📄logs📄")
    
    var user = message.mentions.users.first();

    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
                message.channel.send("[```Diversion Musique```] - **Vous devez mettre un lien**.");   
                return;
            }
            if(!message.member.voiceChannel) {
                message.channel.send("[```Diversion Musique```] - **Vous devez être dans un salon vocal**.");   
                return;
            }
            
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            
            var server = servers[message.guild.id];
            message.channel.send("[```Diversion Musique```] - **Musique jouer ** :``EN DEV``");
            server.queue.push(args[1]);
         
            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message) 
            });
        break;    
      
        case "stop":
            if(!message.member.voiceChannel) {
                message.channel.send("[```Diversion Musique```] - **Vous devez être dans un salon vocal**.");   
                return;
            }
            var server = servers[message.guild.id];
            message.channel.send("[```Diversion Musique```] - **Fin de la session**");
            if(server.dispatcher) server.dispatcher.end();
        break;    
      
        case "unmute":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je retire la sanction: MUTE ?")
                member.removeRole(roleMute)
            message.channel.send(user.toString() + " a bien été unmute ✅")
            console.log("Tu a unmute quelqu'un toi " + message.author.username + " !")  
        
            var unmute_embed = new Discord.RichEmbed()
                    .addField("Commande :", "UnMute")
                    .addField("Utilisateur :", user.username)
                    .addField("Modérateur :", message.author.username)
                    .addField("Heure:", message.channel.createdAt)
                .setColor("#3333cc")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
                .setFooter("SupersBOT - " + version)
            member.guild.channels.find("name", "🤖📄logs📄").send(unmute_embed);
        break;
      
        case "mute":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: MUTE")
            message.channel.send(member.toString() + " a bien été mute. ✅")
                member.addRole(roleMute)
            console.log("Tu a mute quelqu'un toi " + message.author.username + " !")
                
            var mute_embed = new Discord.RichEmbed()
                    .addField("Action :", "Mute")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                    .addField("Raison :", reasontimed)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
                .setFooter("SupersBOT - " + version)
            member.guild.channels.find("name", "📄logs📄").send(mute_embed);
        break;
      
        case "shelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var start_embed = new Discord.RichEmbed()
                .setTitle("🛠Menu d'aide staff🛠 !")
                .setDescription("**Pour naviguer dans le menu d'aide du staff , utilisez les réactions si-dessous.**")
                .setColor("#36393E")
                .setFooter(foother)
            var shelp1_embed = new Discord.RichEmbed()
                .setAuthor("Commande qui demande au moins le modo ( sauf pour le kick )", message.author.avatarURL)
                .setColor("#cc0000")
                    .addField(PREFIX + "purge", "Cette commande permet de supprimé des messages beaucoup plus rapidement ! Pour l'utiliser, faites " + PREFIX + "purge (nombredemessages)")
                    .addField(PREFIX + "mute", "Cette commande permet de muté un utilisateur pendant un certain temps. Pour l'utiliser, faites " + PREFIX + "mute @(utilisateur) + (raison)")
                    .addField(PREFIX + "unmute", "Cette commande permet d'unmute un utilisateur. Pour l'utiliser, faites " + PREFIX + "unmute @(utilisateur)")
                .setFooter("Page 1/2 | " + foother)
            var helptwo_embed = new Discord.RichEmbed()
                .setAuthor("Commande qui demande au moins l'admin ( sauf pour le kick )", message.author.avatarURL)
                .setColor("#cc0000")
                    .addField(PREFIX + "annoncehelp", "Cette commande permet d'avoir l'aide pour faire des annonces avec le bot.")
                    .addField(PREFIX + "kick", "Cette commande permet de kick un utilisateur ! Pour l'utiliser, faites " + PREFIX + "kick @(utilisateur) + (raison)")
                    .addField(PREFIX + "ban", "Cette commande permet de bannir un utilisateur ! Pour l'utiliser, faites " + PREFIX + "ban @(utilisateur) + (raison)")
                    .addField(PREFIX + "unkick", "Cette commande permet de unkick un utilisateur ! Pour l'utiliser, faites " + PREFIX + "unkick @(utilisateur)")
                    .addField(PREFIX + "unban", "Cette commande permet de unban un utilisateur ! Pour l'utiliser, faites " + PREFIX + "unban @(utilisateur)")
                .setFooter("Page 2/2 | " + foother)
            const shelpmessage = await message.channel.send(start_embed);
            await shelpmessage.react("1⃣");
            await shelpmessage.react("2⃣");
            const panierr = shelpmessage.createReactionCollector((reaction, user) => user.id === message.author.id);
            panierr.on('collect', async(reaction) => {
            if (reaction.emoji.name === "1⃣") {
                shelpmessage.edit(shelp1_embed);
            }
            if (reaction.emoji.name === "2⃣") {
                shelpmessage.edit(helptwo_embed);
            }
            await reaction.remove(message.author.id);
            })
        break;      
        
        case "annoncehelp":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var annoncehelp_embed = new Discord.RichEmbed()
                    .addField(PREFIX  + "nouveaustaff", "Cette commande permet de faire un message dans le salon #💬discussion-staff💬 .")
                    .addField(PREFIX  + "annonce", "Cette commande permet de faire un message dans le salon #🔔annonce .")
                    .addField(PREFIX  + "nouveau", "Cette commande permet de faire un message dans le salon #🔔nouveauté .")
                    .addField(PREFIX  + "nouveaustaff@", "Cette commande permet de faire un message dans le salon #💬discussion-staff💬 avec la mention @Membre du Staff .")
                    .addField(PREFIX  + "annonce@", "Cette commande permet de faire un message dans le salon #🔔annonce avec la mention @everyone .")
                    .addField(PREFIX  + "nouveau@", "Cette commande permet de faire un message dans le salon #🔔nouveauté avec la mention @everyone .")
                .setColor("#cc0000")
                .setFooter(foother)
                .setAuthor("Panel d'annonce", message.author.avatarURL)
                .setTimestamp()
            message.delete()
            message.channel.send(annoncehelp_embed)
        break;   
    
        case "help":
            var start_embed = new Discord.RichEmbed()
                .setTitle("🛠Menu d'aide🛠 !")
                .setDescription("**Pour naviguer dans le menu d'aide, utilisez les réactions si-dessous.**")
                .setColor("#36393E")
                .setFooter(foother)
            var help1_embed = new Discord.RichEmbed()
                .setTitle("🎵Musique🎵")
                .setColor("#0000ff")
                    .addField(PREFIX + "play", "Jouer une musique !  Pour l'utiliser, faites " + PREFIX + "play (lien) !")
                    .addField(PREFIX + "skip", "Sauter une musique  Pour l'utiliser, faite " + PREFIX + "skip !")
                    .addField(PREFIX + "stop", "Arreter la musique  Pour l'utiliser, faites " + PREFIX + "stop !")
                .setFooter("Page 1/3 | " + foother)
            var help2_embed = new Discord.RichEmbed()
                .setTitle("💩Autre💩")
                .setColor("#0000ff")
                    .addField(PREFIX  + "serveur", "Pour rejoindre nos Serveur !")
                    .addField(PREFIX + "botinfo", "Grâce à cette commande, tu pourras savoir mes info !")
                    .addField(PREFIX + "servinfo", "Grâce a cette commande tu pourra avoir les informations du serveur !") 
                    .addField(PREFIX + "reseau", "Vous donne mes réseaux sociaux !")
                .setFooter("Page 2/3 | " + foother)    
            var help3_embed = new Discord.RichEmbed()
                .setTitle("⚙Administration🛠")
                .setColor("#cc0000")
                    .addField(PREFIX + "shelp", "❌Afficher les commandes du staff. Mais seule ceux qui ont la perm de kick pourrons y accèder. ❌")
                .setFooter("Page 3/3 | " + foother)
            const helpmessage = await message.channel.send(start_embed);
            await helpmessage.react("1⃣");
            await helpmessage.react("2⃣");
            await helpmessage.react("3⃣");
            const ranier = helpmessage.createReactionCollector((reaction, user) => user.id === message.author.id);
            ranier.on('collect', async(reaction) => {
                if (reaction.emoji.name === "1⃣") {
                    helpmessage.edit(help1_embed);
                }
                if (reaction.emoji.name === "2⃣") {
                    helpmessage.edit(help2_embed);
                }
                if (reaction.emoji.name === "3⃣") {
                    helpmessage.edit(help3_embed)
                }
                await reaction.remove(message.author.id);
            })
        break;
            
        case "kick":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: kick")
            message.channel.send(member.toString() + " a bien été kick. ✅")
            member.roles.forEach(role => {
                member.removeRole(role)
            })
                member.addRole(rolekick)
            console.log("Tu a kick quelqu'un toi " + message.author.username + " !")
                    
            var kick_embed = new Discord.RichEmbed()
                    .addField("Action :", "Kick")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                    .addField("Raison :", reasontimed)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
                .setFooter("SupersBOT - " + version)
            member.guild.channels.find("name", "📄logs📄").send(kick_embed);
            member.guild.channels.find("name", "kick").send(kick_embed);
        break;

        case "unkick":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois enlevé la sanction: kick")
            message.channel.send(member.toString() + " a bien été unkick. ✅")
                member.removeRole(rolekick)
                
            var unkick_embed = new Discord.RichEmbed()
                    .addField("Action :", "unKick")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
                .setFooter("SupersBOT - " + version)
            member.guild.channels.find("name", "📄logs📄").send(unkick_embed);
        break;

        case "ban":
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            if (!reasontimed) return message.reply("Tu as oublié la raison ! :D")
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je dois mettre la sanction: Ban")
            message.channel.send(member.toString() + " a bien été ban. ✅")
            member.roles.forEach(role => {
                member.removeRole(role)
            })
                member.addRole(roleban)
        
            var ban_embed = new Discord.RichEmbed()
                    .addField("Action :", "Bannissement")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                    .addField("Raison :", reasontimed)
                .setFooter("SupersBOT - " + version)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
            member.guild.channels.find("name", "📄logs📄").send(ban_embed);
            member.guild.channels.find("name", "ban").send(ban_embed);
        break;
       
        case "unban":
            if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Tu n'as pas la permission d'exécuter la commande. :x:");
            if(!modlog) return message.reply("Je ne trouve pas de channel log.");  
            var member = message.mentions.members.first();
            if (message.mentions.users.size < 1) return message.reply("À qui je enlevé mettre la sanction: Ban")
            message.channel.send(member.toString() + " a bien été ban. ✅")
                member.removeRole(roleban)
            console.log("Tu a unban quelqu'un toi " + message.author.username + " !")
                
            var unban_embed = new Discord.RichEmbed()
                    .addField("Action :", "UnBan")
                    .addField("Utilisateur :", user.toString())
                    .addField("Modérateur :", message.author.toString())
                .setFooter("SupersBOT - " + version)
                .setColor("#FFFF00")
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTimestamp()
            member.guild.channels.find("name", "📄logs📄").send(unban_embed);
        break; 

        case "purge":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            var messagecount = parseInt(args2.join(" "));
            message.channel.fetchMessages({
                limit: messagecount
            }).then(messages => message.channel.bulkDelete(messagecount));
            message.delete()
        break;

        case "reseau":
           var reseau_embed = new Discord.RichEmbed()
                   .addField(emoji_insta + "Instagram", "[@diversonfr](https://www.instagram.com/diversonfr/)", true) 
                   .addField(emoji_twitter + "Twitter", "[@diversionfrserv](https://twitter.com/diversionfrserv)", true)
                   .addField(emoji_facebook + "Facebook", "[@diversion.serv.7](https://www.facebook.com/diversion.serv.7)", true)
               .setFooter(foother)
               .setAuthor("Réseaux Sociaux Du Serveur", "https://cdn.discordapp.com/avatars/436275320123949068/7bc51d2a832b740959b4633e6d5ef4c8.png")
               .setDescription("Pour l'actualité !")
               .setColor('#00FFE6')
               .setTimestamp()
           message.delete()
           message.channel.send(reseau_embed)
       break;   

       case "serveur":
           var serveur_embed = new Discord.RichEmbed()
                    .addField("Notre Serveur DarkRP", "steam://connect/54.37.198.10:27015")
                .setColor("#ffff00")
                .setFooter(foother)
                .setAuthor("Nos Serveurs", message.author.avatarURL)
                .setDescription("⚠**Google va s'ouvrir lorsque vous allez cliquer sur le lien !**⚠")
                .setTimestamp()
            message.delete()
            message.channel.send(serveur_embed)
        break;            

        case "annonce":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            let annonce = message.content.split(" ");
            annonce.shift();
            var embed = new Discord.RichEmbed()
                .addField("Annonce !", " "+ annonce.join(" "))
            .setColor("#8E8086")
            .setFooter("Annonce de @" + message.author.username + "#" + message.author.discriminator + " | DiversionBOT - " + version)
            message.delete();
            member.guild.channels.find("name", "🔔annonce").send(embed);
        break;

        case "nouveau":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            let nouveauté = message.content.split(" ");
            nouveauté.shift();
            var nouveauté_embed = new Discord.RichEmbed()
                .addField("Nouvauté !", " "+ nouveauté.join(" "))
            .setColor("#8E8086")
            .setFooter("Annonce de @" + message.author.username + "#" + message.author.discriminator + " | DiversionBOT - " + version)
            message.delete();
            member.guild.channels.find("name", "🔔nouveauté").send(nouveauté_embed);
        break;

        case "nouveaustaff":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌")
            let nouveaustaff = message.content.split(" ");
            nouveaustaff.shift();
            var nouveaustaff_embed = new Discord.RichEmbed()
                .addField("Annonce!", " "+ nouveaustaff.join(" "))
            .setColor("#E1302D")
            .setFooter("Annonce de @" + message.author.username + "#" + message.author.discriminator + " | DiversionBOT - " + version)
            message.delete();
            member.guild.channels.find("name", "💬discussion-staff💬").send(nouveaustaff_embed);
        break;

        case "annonce@":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            let annoncem = message.content.split(" ");
            annoncem.shift();
            var annoncem_embed = new Discord.RichEmbed()
                .addField("Annonce !", " "+ annoncem.join(" "))
            .setColor("#8E8086")
            .setFooter("Annonce de @" + message.author.username + "#" + message.author.discriminator + " | DiversionBOT - " + version)
            message.delete();
            member.guild.channels.find("name", "🔔annonce").send(annoncem_embed);
        break;
        
        case "nouveau@":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌");
            let nouveautém = message.content.split(" ");
            nouveautém.shift();
            var nouveautém_embed = new Discord.RichEmbed()
                .addField("Nouvauté !", " "+ nouveautém.join(" "))
            .setColor("#8E8086")
            .setFooter("Annonce de @" + message.author.username + "#" + message.author.discriminator + " | DiversionBOT - " + version)
            message.delete();
            member.guild.channels.find("name", "🔔nouveauté").send("⏬@everyone⏬")
            member.guild.channels.find("name", "🔔nouveauté").send(nouveautém_embed);
        break;

        case "nouveaustaff@":
            if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Tu ne peux exécuter cette commande. ❌")
            let nouveaustaffm = message.content.split(" ");
            nouveaustaffm.shift();
            var nouveaustaffm_embed = new Discord.RichEmbed()
                .addField("Annonce!", " "+ nouveaustaffm.join(" "))
            .setColor("#E1302D")
            .setFooter("Annonce de @" + message.author.username + "#" + message.author.discriminator + " | DiversionBOT - " + version)
            message.delete();
            member.guild.channels.find("name", "💬discussion-staff💬").send("⏬@Membre du Staff⏬");
            member.guild.channels.find("name", "💬discussion-staff💬").send(nouveaustaffm_embed);
        break;
 
        case "botinfo":
            var load1_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours.', "Merci de patienter quelques instants !")
            message.channel.send(load1_embed).then(message => message.edit(load2_embed)).then(message => message.edit(load3_embed)).then(message => message.edit(load4_embed)).then(message => message.edit(botinfo_embed));
            var load2_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours..', "Merci de patienter quelques instants !")  
            var load3_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours...', "Merci de patienter quelques instants !")   
            var load4_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours.', "Merci de patienter quelques instants !")    
            let startTime = Date.now();
            var botinfo_embed = new Discord.RichEmbed()
                .setColor('#04B404')
                .setTitle('Mes informations :')
                    .addField("Serveurs :", "Je suis sur " + bot.guilds.array().length + " serveurs")
                    .addField("Membres :", "Je voit ``" + bot.users.size + " membres`` au total.")
                    .addField("Version :", "La version de mon système est : ``" + version + "`` !")
                    .addBlankField()
                    .addField('Mon Ping :', ':ping_pong: Pong !')
                    .addField(":clock2: Temps :", `${Date.now() - startTime} millisecondes`, true)
                    .addField(":heartpulse: API Discord :", `${bot.ping} millisecondes`, true)
                .setTimestamp()
                .setFooter(foother)
        break;

        case "servinfo":
            var load1_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours.', "Merci de patienter quelques instants !")
            message.channel.send(load1_embed).then(message => message.edit(load2_embed)).then(message => message.edit(load3_embed)).then(message => message.edit(load4_embed)).then(message => message.edit(servinfo_embed));
            var load2_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours..', "Merci de patienter quelques instants !")  
            var load3_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours...', "Merci de patienter quelques instants !")   
            var load4_embed = new Discord.RichEmbed()
                .addField(':clock2: Chargement en cours.', "Merci de patienter quelques instants !")       
            var servinfo_embed = new Discord.RichEmbed()
                .setAuthor("Information du Serveur", message.author.avatarURL)
                    .addField("Nom du Serveur :", "Le serveur s'appelle : ``" + message.guild.name + "``.", true)
                    .addField("ServeurID :", "L'ID du serveur est : ``" + message.guild.id + "``.", true)
                    .addField("Création du Serveur", "Le serveur à été crée le : ``" + message.guild.createdAt + "``.", true)
                    .addField("Fondateur :", "Le fondateur du serveur est : " + message.guild.owner + ".", true)
                    .addField("FondateurID :", "L'ID du Fondateur est : ``" + message.guild.ownerID + "``.", true)
                    .addField("Membres :", "Nous sommes actuellement ``" + message.guild.memberCount  + " membres`` au total.", true)
                .setColor("#FF0000")
                .setFooter(foother)
                .setThumbnail(message.guild.iconURL)
        break; 

    /*    case "majinfo":
           if (message.author.id === "193092758267887616") {
                var maj_embed = new Discord.RichEmbed()
                .setAuthor("Update " + version, "https://cdn.discordapp.com/avatars/436275320123949068/7bc51d2a832b740959b4633e6d5ef4c8.png")
                .setDescription("**Enorme Update !**")
                    .addField("Suppression de commande,", "**Plusieurs commande on été supprimer car elle ne servais pas vraiment pour ce bot.**", true)
                    .addField("Modification des menu d'aide,", "**Tout les menus d'aide on été refais.**", true)
                    .addField("Annonce en embed,", "**Tout le staff peut utiliser le bot pour faire des annonces.**", true)
                    .addField("Changement de couleur,", "**Le message de connection a été editer.**", true)
                    .addField("Serveur,", "**La commande pour rejoindre notre serveur a été légèrement modifié.**", true)
                    .addField("botinfo & servinfo,", "**Ce sont les deux nouvelle commande !**", true)
                .setThumbnail("https://cdn.discordapp.com/avatars/436275320123949068/7bc51d2a832b740959b4633e6d5ef4c8.png")
                .setColor("#04B404")
                .setFooter(version)
            bot.channels.findAll('name', 'bot-update').map(channel => channel.send(maj_embed));
            message.delete()
            }
        break; */
    }
});

bot.login(process.env.TOKEN);
