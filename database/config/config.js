const config = {
    "development": {
        "email": "postgres",
        "password": null,
        "database": "authDB",
        "port":5432,
        "dialect": "postgres"
    },
    "test": {
        "email": "postgres",
        "password": null,
        "database": "authDB",
        "host": "127.0.0.1",
        "port":5432,
        "dialect": "postgres"
    },
    "production": {
        "email": "postgres",
        "password": null,
        "database": "authDB",
        "host": "127.0.0.1",
        "port":5432,
        "dialect": "postgres"
    },
    "docker": {
        "email": "postgres",
        "password": "postgres",
        "database": "authDB",
        "host": "db",
        "dialect": "postgres",
    },
};

module.exports = config;
