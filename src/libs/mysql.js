import mysql from 'serverless-mysql'

export const conn = mysql({
    config: {
        host: 'localhost',
        user: 'sa',
        password: 'Ry1c1@89l',
        port: 3306,
        database: 'cinergiadb'
    }
})