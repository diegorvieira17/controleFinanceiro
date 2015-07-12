var localDB = null;

function onInit() {
    try {
        if (!window.openDatabase) {
            alert('Erro. Banco de dados não suportado!');
        } else {
            initDB();//create DB
            createTables();//create tables
        };
    } catch (e) {
        if (e == 2) {
            alert('Erro: Versão de banco de dados inválida.');
        } else {
            alert('Erro: Erro desconhecido: ' + e + '.');
        };

        return;
    };
};

//open DB
function initDB() {
    var shortName = 'controleFinanceiro';
    var version = '1.0';
    var displayName = 'controleFinanceiro';
    var maxSize = 65536; // bytes (64kb)
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
    //localDB = window.sqlitePlugin.openDatabase({name: "DB"});
};

//create tables
function createTables() {
    var query = [
        'CREATE TABLE IF NOT EXISTS "category"("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"name" CHAR(60) NOT NULL);'
        ,'CREATE TABLE IF NOT EXISTS "type"("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"name" CHAR(60) NOT NULL);'
        ,'CREATE TABLE IF NOT EXISTS "user"("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"email" CHAR(60) NOT NULL,"passwd" CHAR(15) NOT NULL,"name" CHAR(60) NOT NULL,"cel" CHAR(60) DEFAULT NULL,"theme" CHAR(1) DEFAULT NULL);'
        ,'CREATE INDEX IF NOT EXISTS"user.id" ON "user"("id");'
        ,'CREATE TABLE IF NOT EXISTS "userCategory"("userId" INTEGER NOT NULL,"categoryId" INTEGER NOT NULL,PRIMARY KEY("userId","categoryId"),CONSTRAINT "userCategory_ibfk_1" FOREIGN KEY("userId") REFERENCES "user"("id"),CONSTRAINT "userCategory_ibfk_2" FOREIGN KEY("categoryId") REFERENCES "category"("id"));'
        ,'CREATE INDEX IF NOT EXISTS "userCategory.userCategory_ibfk_2" ON "userCategory"("categoryId");'
        ,'CREATE TABLE IF NOT EXISTS "entries"("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,"name" CHAR(60) NOT NULL,"type" INTEGER NOT NULL,"category" INTEGER NOT NULL,"description" CHAR(60) NOT NULL,"date" DATETIME NOT NULL,"user" INTEGER NOT NULL,CONSTRAINT "entries_ibfk_1" FOREIGN KEY("type") REFERENCES "type"("id"),CONSTRAINT "entries_ibfk_2" FOREIGN KEY("category") REFERENCES "category"("id"),CONSTRAINT "entries_ibfk_3" FOREIGN KEY("user") REFERENCES "user"("id"));'
        ,'CREATE INDEX IF NOT EXISTS "entries.fkUser" ON "entries"("user");'
        ,'CREATE INDEX IF NOT EXISTS "entries.fktype" ON "entries"("type");'
        ,'CREATE INDEX IF NOT EXISTS "entries.fkCategory" ON "entries"("category");'
    ];

    for (var i = 0; i < query.length; i++) {
        commitTransaction(query[i],'','Falha ao criar banco de dados!');
    };
};

//drop tables
function dropTables() {
    var query = [
        'DROP TABLE "category"'
        ,'DROP TABLE "type"'
        ,'DROP TABLE "user"'
        ,'DROP TABLE "userCategory"'
        ,'DROP TABLE "entries"'
    ];

    for (var i = 0; i < query.length; i++) {
        commitTransaction(query[i],'','Falha ao excluir o banco de dados!');
    };
    alert('Banco de dados excluído com sucesso!');
}

function commitTransaction (query, sucessMsg, errorMsg) {
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            if (sucessMsg) {
                alert(sucessMsg);
            };
        });
    } catch (e) {
        if (errorMsg) {
            alert(errorMsg + ' Erro: ' + e + '.');
        }
        return;
    }
}

function querySelect (query, errorMsg) {
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], function(transaction, results){
                if (results.rows.length) {
                    return results;
                    alert(results);
                };
            });
        });
        //}, errorHandler);
    } catch (e) {
        if (errorMsg) {
            alert(errorMsg + ' Erro: ' + e + '.');
        };
    };
};

errorHandler = function(transaction, error)
{
    alert('Erro: ' + error.message);
    return true;
}

nullDataHandler = function(transaction, results)
{

}

//################ APP FUNCTIONS ###################

//get user theme
function getTheme () {
    query = "SELECT user.theme FROM users;";

    querySelect(query, 'Impossível recuperar a informação do banco de dados')
};

function signIn (email, passwd) {
    var query = 'SELECT user.email, user.passwd FROM user WHERE user.email="' + email + '"" AND user.passwd="' + passwd + '"';
    alert(query);

    if (querySelect(query)) {
        $.mobile.changePage('#pgHome');
    } else {
        alert('Email ou senha inválido!');
        $('#txtEmail').val('');
        $('#txtPasswd').val('');
        //$('#txtEmail').focus();
    }
};

function signUp (email, passwd, name, cel) {
    var query = 'INSERT INTO user (email,passwd,name,cel) VALUES ("' + email + '",' + passwd + ',"' + name + '","' + cel + '");'
    alert(query);

    if (commitTransaction(query, 'Registro efetuado com sucesso!', 'Falha no registro, tente novamente!')) {
        $.mobile.changePage('#pgHome');
    } else {
        $('#txtIdSnUp').val('');
        $('#txtEmailSnUp').val('');
        $('#txtPasswddSnUp').val('');
        $('#txtNameSnUp').val('');
        $('#txtCelSnUp').val('');
    };
};