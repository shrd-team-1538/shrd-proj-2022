const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const bodyParser = require('body-parser');




const validTypes = [
    'username',
    'email',
]

const options = {
    keepCase: true,
    longs: true,
    enums: true,
    defaults: true,
    oneofs: true,
};

if (!process.env.JWT_KEY) {
    console.log('WARNING: no jwt key was specified. Authorization will not work. Please configure env variable.');
}
if (!process.env.GRPC_SERVER_HOST) {
    console.log('WARNING: gRPC server host not specified. Container will throw an error.');
}
if (!process.env.GRPC_SERVER_PORT) {
    console.log('WARNING: gRPC server port not specified. Container will throw an error.');
}


const packageDef = protoLoader.loadSync("./db.proto");
const grpcObject = grpc.loadPackageDefinition(packageDef);
const dbPackage = grpcObject.dbPackage;
const client = new dbPackage.DB(`${process.env.GRPC_SERVER_HOST}:${process.env.GRPC_SERVER_PORT}`,grpc.credentials.createInsecure());




const app = express();

app.use(bodyParser.json());



// User CRUD & login
app.post('/api/auth/login', async (req, res) => {
    if (!req.body) return res.status(400).end();
    if (!req.body.keyType || !req.body.key || !req.body.password) return res.status(400).end();
    if (!(req.body.keyType in validTypes)) return res.status(400).end();

    const hashed = await bcrypt.hash(req.body.password, 10);

    
    try {
    client.findUserByPublicKey({
        "key": req.body.key,
        "type": req.body.keyType
    }, async (err, response) => {
        if (err) return res.status(401).end();

        const result = await bcrypt.compare(req.body.password, response.password);
        if (!result) return res.status(401).end();
        
        const token = jwt.sign({id: response.id}, process.env.JWT_KEY, {
            expiresIn: '14d'
        });

        res.status(200).json({
            token: token
        });
    });
    } catch (error) {
        console.log(error);
    }
    
});

app.post('/api/auth/user', async(req, res) => {
    try {
        console.log(req.body.username, req.body.password, req.body.email);
        if (!req.body) return res.status(400).end();
        if (!req.body.username || !req.body.password || !req.body.email) return res.status(400).end();
        
        if (!/^[A-Za-z0-9_-]+$/.test(req.body.username) || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email) || !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.password)) return res.status(400).end();
    
        const hashed = await bcrypt.hash(req.body.password, 10);
        const data = {
            username: req.body.username,
            password: hashed,
            email: req.body.email
        };
    
        client.createUser(data, (err, response) => {
            if (err) return res.status(500).end();
            if (response.created === true) {
                const token = jwt.sign({
                    id: response.id
                }, process.env.JWT_KEY, {
                    expiresIn: '14d'
                });
                return res.status(201).json({
                    token
                });
            }
            return res.status(409).json({
                conflict: response.conflict
            });
        });
    } catch (error) {
        console.log(error);
    }
});


app.get('/api/auth/users/:id', async (req, res) => {
    try {
        client.getUserProfile({
            id: req.params.id
        }, (err, response) => {
            if (err) return res.status(500).end();

            if (!response.id) return res.status(404).end();

            res.status(200).json(response);
        });
    } catch (error) {
        console.log(error);
    }
});

app.put('/api/users/:id', async (req, res) => {
    if (!req.body) return res.status(400).end();
    if (!req.body.username || !req.body.password || !req.body.values) return res.status(400).end();
    if (!req.body.values.password &&  !req.body.values.email && !req.body.values.username) return res.status(400).end();
    let hashed = null;
    let hashedOriginal = await bcrypt.hash(req.body.password, 10);
    if (req.body.values.password) {
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(req.body.values.password)) return res.status(400).end();
        hashed = await bcrypt.hash(req.body.values.password, 10);
    } 
    if (req.body.values.username) {
        if (!/^[A-Za-z0-9_-]+$/.test(req.body.values.username)) return res.status(400).end();
    }
    if (req.body.values.email) {
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.values.email)) return res.status(400).end();
    }

    try {
        client.editUser({
            password: hashedOriginal,
            username: req.body.username,
            newPassword: hashed,
            newEmail: req.body.values.email || null, 
            newUsername: req.body.values.username || null
        }, async(err, result) => {
            if (err) return res.status(500).end();
            if (!result.ok) return res.status(401).end();
            res.status(204).end();
        });
    } catch (error) {
        console.log(err);
    }
});


app.delete('/api/auth/user', (req, res) => { // deletes the user by id in jwt token
    if (!req.headers.authorization) return res.status(401).end();
    if (req.headers.authorization.split(' ').length > 2) return res.status(400).end();
    if (req.headers.authorization.split(' ')[0] != 'Bearer') return res.status(400).end();
    try {
        const decoded = jwt.verify(req.headers.authorization.split(' ')[1], process,env.JWT_KEY);
    } catch (error) { // handle expiration and other errors 
        if (error.name === 'TokenExpiredError') {
            
        }
    }
});


app.listen(9090);