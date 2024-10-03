
// ========>>  COMPILADO PARA WORKFLOW :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
/* export const environment = {
  production: false,
  clientId: 'd8ba7c99-e1c1-4560-a154-1bdcb83ad43f',
  tenanId: 'b5fdc43d-890f-4208-917d-107c711d57cc',
  applicationId: 'd8ba7c99-e1c1-4560-a154-1bdcb83ad43f',
  authority: 'https://login.microsoftonline.com/b5fdc43d-890f-4208-917d-107c711d57cc',
  authRedirectUri: 'http://localhost:4200',
  logoutRedirectUri: 'http://localhost:4200', 
  baseUrl: 'https://localhost:44304', 
  //APIS EXTERNOS
  postLogoutUri:"http://localhost:4200",
  //API GRUPO PANA
  apiAnticipoByDocEntry:"https://apps.grupopana.com.pe/apispublicas/AnticipoByDocEntry?docEntry=",
  //ORDEN COMPRA
  apiOrdenCompra:"https://apps.grupopana.com.pe/apispublicas/ordenCompraByCodigo?codigo=",
  //ORDEN COMPRA 2
  apiOrdenCompraPagoepdp:"https://apps.grupopana.com.pe/apispublicas/ordenCompraByCodigo?codigo=",
  //VENTAS
  apiVentas:"https://apps.grupopana.com.pe/apispublicas/ventasByDocEntry?docEntry="
};*/
// ========>>  COMPILADO PARA G PANA AUTOS :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export const environment = {
  production: false,
  clientId: 'd8ba7c99-e1c1-4560-a154-1bdcb83ad43f',
  tenanId: 'b5fdc43d-890f-4208-917d-107c711d57cc',
  applicationId: 'd8ba7c99-e1c1-4560-a154-1bdcb83ad43f',
  authority: 'https://login.microsoftonline.com/b5fdc43d-890f-4208-917d-107c711d57cc',
  authRedirectUri: 'http://localhost:4200',
  logoutRedirectUri: 'http://localhost:4200', 
  baseUrl:'https://localhost:7193',// 'http://192.168.0.6', //API
  //APIS EXTERNOS
  postLogoutUri:"http://localhost:4200",
  //API GRUPO PANA
  apiAnticipoByDocEntry:"https://apps.panaautos.com.pe/apispublicas/AnticipoByDocEntry?docEntry=",
  //ORDEN COMPRA
  apiOrdenCompra:"https://apps.panaautos.com.pe/apispublicas/ordenCompraByCodigo?codigo=",
  //ORDEN COMPRA 2
  apiOrdenCompraPagoepdp:"https://apps.panaautos.com.pe/apispublicas/ordenCompraByCodigo?codigo=",
  //VENTAS
  apiVentas:"https://apps.panaautos.com.pe/apispublicas/ventasByDocEntry?docEntry="
};
 
