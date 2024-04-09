CREATE TABLE SERVICO (
ID_SERVICO INT AUTO_INCREMENT NOT NULL,
NOME_SERVICO VARCHAR (45) NOT NULL,
DESCRICAO_SERVICO VARCHAR(400) NOT NULL,
DATA_POSTAGEM_SERVICO DATE NOT NULL,
CATEGORIA_SERVICO INT NOT NULL,
PRIMARY KEY(ID_SERVICO)
);
 
 
CREATE TABLE ITEM_PEDIDO_SERVICO (
ID_ITEM_SERVICO INT AUTO_INCREMENT NOT NULL,
FK_ID_SERVICO INT,
DESCRICAO_ITEM_SERVICO_SERVICO VARCHAR(400) NOT NULL,
PRIMARY KEY(ID_ITEM_SERVICO),
FOREIGN KEY (FK_ID_SERVICO) REFERENCES SERVICO(ID_SERVICO)
);
 
 
CREATE TABLE PEDIDO_SERVICO(
ID_PEDIDO_SERVICO INT AUTO_INCREMENT NOT NULL,
DATA_PEDIDO_SERVICO DATE,
DESCRICAO_PEDIDO_SERVICO VARCHAR(400) NOT NULL,
FK_ID_ITEM_PEDIDO_SERVICO INT,
PRIMARY KEY (ID_PEDIDO_SERVICO),
FOREIGN KEY(FK_ID_ITEM_PEDIDO_SERVICO) REFERENCES ITEM_PEDIDO_SERVICO(ID_ITEM_PEDIDO_SERVICO)
);
 
 
 
 
CREATE TABLE USUARIOS(
ID_USUARIOS INT AUTO_INCREMENT NOT NULL,
CELULAR_USUARIOS VARCHAR(11) NOT NULL,
EMAIL_USUARIOS VARCHAR(50) NOT NULL,
CIDADE_USUARIOS VARCHAR(30) NOT NULL,
UF_USUARIOS CHAR(2) NOT NULL,
CEP_USUARIOS CHAR(8) NOT NULL,
LOGRADOURO_USUARIOS VARCHAR(100) NOT NULL,
BAIRRO_USUARIOS VARCHAR(11),
PRIMARY KEY(ID_USUARIOS)
);
 
 
CREATE TABLE USUARIOS_PF(
CPF_USUARIOS_PF CHAR(11) NOT NULL,
NOME_USUARIOS_PF VARCHAR(70),
DATA_NASC_USUARIOS_PF DATE,
FK_ID_USUARIOS_PF INT,
FOREIGN KEY(FK_ID_USUARIOS_PF) REFERENCES USUARIOS(ID_USUARIOS)
);
 
 
CREATE TABLE USUARIOS_PJ(
RAZAO_SOCIAL_USUARIOS_PJ VARCHAR(150) NOT NULL,
CNPJ_USUARIOS_PJ VARCHAR(14) NOT NULL,
FK_ID_USUARIOS_PJ INT,
FOREIGN KEY (FK_ID_USUARIOS_PJ) REFERENCES USUARIOS(ID_USUARIOS)
);
 
 
 
 
CREATE TABLE ONGS(
ID_ONGS INT AUTO_INCREMENT NOT NULL,
CNPJ_ONGS CHAR(14) NOT NULL,
RAZAO_SOCIAL_ONGS VARCHAR(150) NOT NULL,
CIDADE_ONGS VARCHAR(20) NOT NULL,
UF_ONGS CHAR(2) NOT NULL,
CEP_ONGS CHAR(2) NOT NULL,
LOGRADOURO_ONGS VARCHAR(100) NOT NULL,
BAIRRO_ONGS VARCHAR(50) NOT NULL,
CELULAR_ONGS CHAR(11) NOT NULL,
PRIMARY KEY(ID_ONGS)
);
 
 
 
 
CREATE TABLE CLIENTE(
ID_CLIENTE INT AUTO_INCREMENT NOT NULL,
EMAIL_CLIENTE VARCHAR(50) NOT NULL,
CELULAR_CLIENTE CHAR(11) NOT NULL,
NOME_CLIENTE VARCHAR(70) NOT NULL,
SENHA_CLIENTE VARCHAR(30) NOT NULL,
CPF_CLIENTE CHAR(14) NOT NULL,
DATA_NASC_CLIENTE DATE ,
CIDADE_CLIENTE VARCHAR(30) NOT NULL,
LOGRADOURO_CLIENTE VARCHAR(100) NOT NULL,
UF_CLIENTE CHAR(2) NOT NULL,
CEP_CLINTE CHAR(8) NOT NULL,
BAIRRO_CLIENTE VARCHAR(11),
FK_ID_ONGS INT,
PRIMARY KEY(ID_CLIENTE),
FOREIGN KEY(FK_ID_ONGS) REFERENCES CLIENTE(ID_CLIENTE) 
);
 
 
 
 
CREATE TABLE PETS_CLIENTE(
ID_PETS_CLIENTE INT AUTO_INCREMENT NOT NULL,
RACA_PETS_CLIENTE VARCHAR(20) NOT NULL,
COR_PETS_CLIENTE VARCHAR(25) NOT NULL,
DATA_NASC_PETS_CLIENTE DATE,
NOME_PETS_CLIENTE VARCHAR(70) NOT NULL,
PORTE_FISICO_PETS_CLIENTE VARCHAR(15) NOT NULL,
SEXO_PETS_CLIENTE VARCHAR(15) NOT NULL,
FK_ID_CLIENTE INT NOT NULL,
PRIMARY KEY(ID_PETS_CLIENTE),
FOREIGN KEY(FK_ID_CLIENTE) REFERENCES CLIENTE(ID_CLIENTE)
);
 
 
 
 
CREATE TABLE PETS_DOACAO(
ID_PETS_DOACAO INT AUTO_INCREMENT NOT NULL,
COR_PETS_DOACAO VARCHAR(25) NOT NULL,
RACA_PETS_DOACAO VARCHAR(20) NOT NULL,
NOME_PETS_DOACAO VARCHAR(70) NOT NULL,
SEXO_PETS_DOACAO VARCHAR(15) NOT NULL,
PORTE_FISICO_PETS_DOACAO VARCHAR(15) NOT NULL,
FK_ID_ONGS INT,
FK_ID_CLIENTE INT,
PRIMARY KEY (IND_PETS_DOACAO),
FOREIGN KEY (FK_ID_ONGS) REFERENCES ONGS(ID_ONG),
FOREIGN KEY (FK_ID_CLIENTE) REFERENCES CLIENTE(ID_CLIENTE)
);
 
 
 
 
CREATE TABLE MENSAGEM(
ID_MENSAGEM INT AUTO_INCREMENT NOT NULL,
CONTEUDO_MENSAGEM VARCHAR(600),
FK_ID_ONGS INT,
FK_ID_CLIENTE INT,
PRIMARY KEY(ID_MENSAGEM),
FOREIGN KEY(FK_ID_ONGS) REFERENCES ONGS(ID_ONG),
FOREIGN KEY(FK_ID_CLIENTE) REFERENCES CLIENTE(ID_CLIENTE)
);
