const { Sequelize,Op, DataTypes, Model  } = require('sequelize');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

const packageDef = protoLoader.loadSync('./db.proto', options);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const dbPackage = grpcObject.dbPackage;
const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'base_db',
    host: process.env.DB_HOST || 'db',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PWD || 'password',
    dialect: 'mysql'
});

class User extends Model {};
class Question extends Model {};
class Device extends Model {};  
class Message extends Model {};
class Answer extends Model {};
class Vendor extends Model {};
class Post extends Model {};

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        autoIncrement: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        autoIncrement: false
    }
}, {
    sequelize,
    modelName: 'User'
});


Device.init({
    vendor_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: { // NTB_WIN_11_PRO_x64 or else
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment: { // maybe remove
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Device'
});

Question.init({
    text: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    }
}, {
    modelName: 'Question',
    sequelize
});

Message.init({
    text: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Message'
});


Answer.init({
    text: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Answer'
});

Vendor.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    website: {
        allowNull: true,
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'Vendor'
});

Post.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        allowNull: false,
        type: DataTypes.TEXT("long")
    }
}, {
    sequelize, 
    modelName: 'Post'
});


Device.belongsToMany(User, {through: 'user_device'});
User.hasMany(Question);
User.hasMany(Post);
User.hasMany(Answer);
User.hasMany(Message);

Device.hasMany(Question);
Question.hasMany(Answer);
Question.hasMany(Message);

Vendor.hasMany(Device);


const server = new grpc.Server();
server.bindAsync(`0.0.0.0:${process.env.GRPC_PORT || 40000}`, grpc.ServerCredentials.createInsecure(), () => {
    server.addService(dbPackage.DB.service, {
        "verifyAuth": verifyAuth,
        "findUserByPublicKey": findUserByPublicKey,
        "createUser": createUser,
        "getUserProfile": getUserProfile,
    });
    server.start();
});

async function verifyAuth (call, callback) {
    try {
        const user = await User.findByPk(call.request.id);
        callback(null, {
            "ok": user === null
        });
    } catch (error) {
        console.log(error);
    }
}

async function findUserByPublicKey(call, callback) {
    const where = {};
    where[call.request.type] = call.request.key; 


    try {
        const user = await User.findOne({
            where,
            attributes: [
                'id',
                'username',
                'rank',
                'type',
                'email',
                'password'
            ]
        });
        if (user) {
            console.log(user.toJSON());
            callback(null, user.toJSON());
        } else {
            callback(null, {
                err: 'notfound'
            });
        }
    } catch (e) {
        console.log(e);
        callback(null, {
            err: 'mysql'
        });
    }
}

async function getUserProfile(call, callback) {
    try {
        const user = await User.findByPk(call.request.id, {
            attributes: [
                'id',
                'username',
                'rank',
                'type',
            ]
        });
        if (!user) {
            callback(null, {});
        } else {
            callback(null, user.toJSON());
        }
    } catch (error) {
        console.log(error);
    }
}



async function createUser(call, callback) {
    try {
        const [user, created] = await User.findOrCreate({
            where: {
                [Op.or]: [
                    {
                        username: call.request.username
                    },
                    {
                        email: call.request.email
                    }
                ]
            },
            defaults: {
                username: call.request.username,
                password: call.request.password,
                email: call.request.email,
            }
        });
    
        if (!created) {
            let conflict = null;
            if (user.email === call.request.email && user.password === call.request.password) conflict = "both";
            if (user.password === call.request.password && user.email !== call.request.email) conflict = "password";
            if (user.email === call.request.email && user.password !== call.request.password) conflict = "email";
            callback(null, {
                created: false,
                conflict: conflict,
                id: null        
            })
        } else {
            callback(null, {
                created: true,
                conflict: null,
                id: user.id
            });
        }
    } catch (error) {
        console.log(error);
    }
}


async function editUser(call, callback) {
    try {
        let value = {};
        if (call.request.username) value.username = call.request.newUsername;
        if (call.request.password) value.password = call.request.newPassword;
        if (call.request.email) value.email = call.request.newEmail;


        const [rows] = await User.update(value, {
            where: {
                username: call.request.username,
                password: call.request.password
            }
        });

        if (rows.length !== 1) return callback(null, {ok: false});
        return callback(null, {ok: true});
    } catch (error) {
        console.log(error);
    }
}



(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        await User.create({
            username: 'test',
            password: '$2b$10$RW9Ets5hCnPz.aXR/XaGKeHoMSMmvbLRU4R.hYvnco.c.V21dWqHu',
            email: 'test'
        });
    } catch (error) {
        console.log(error);
    }
})()