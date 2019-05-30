const HerokuUrl = 'postgres://jgdfnswemkqcdh:9ccfd43d91fcc63885ef1f5eee5cbc80acf19c0750693b4e007d04b73402d09c@ec2-54-221-198-156.compute-1.amazonaws.com:5432/d2nu9k9bj51786'
module.exports ={
  production: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '123456',
      database : 'postgres'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '123456',
      database : 'postgres'
    },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    },
    useNullAsDefault: true
  },


  development: {
    client: 'pg',
    connection:HerokuUrl,
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }
}
