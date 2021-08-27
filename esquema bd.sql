drop table prospectosDocumentos;
drop table prospectos;

create table prospectos(
	id int not null AUTO_INCREMENT primary key,
    nombre varchar(100) not null,
    apellidoPaterno varchar(50) not null,
    apellidoMaterno varchar(50),
    calle varchar(50) not null,
    numero varchar(20) not null,
    colonia varchar(40) not null,
    codigoPostal varchar(10) not null,
    telefono varchar(10) not null,
    rfc varchar(15),
    status varchar(20) not null constraint ck_status check (status in ('enviado', 'autorizado', 'rechazado')),
    observaciones varchar(500)
);
-- alter table prospectos add observaciones varchar(500)

create table prospectosDocumentos(
	id int not null AUTO_INCREMENT primary key,
    idProspecto int not null,
    nombreDocumento varchar(100) not null
);

alter table prospectosDocumentos add constraint fk_documento_prospecto 
foreign key (idProspecto) references prospectos(id);

alter table prospectosDocumentos add constraint uq_documento_prospecto
unique (idProspecto, nombreDocumento);
