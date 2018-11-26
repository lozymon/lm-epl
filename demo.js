const EPL = require('./index');
const epl = new EPL();

const data = [
    {
        RAZAO_SOCIAL: 'RAZAO_SOCIAL',
        CNPJ_EMPRESA: 'CNPJ_EMPRESA',
        IE_EMPRESA: 'IE_EMPRESA',
        RAZAO_SOCIAL_CLIENTE: 'RAZAO_SOCIAL_CLIENTE',
        ENDERECO_CLIENTE: 'ENDERECO_CLIENTE',
        BAIRRO_CLIENTE: 'BAIRRO_CLIENTE',
        CIDADE_CLIENTE: 'CIDADE_CLIENTE',
        UF_CLIENTE: 'UF_CLIENTE',
        CEP_CLIENTE: 'CEP_CLIENTE',
        TRANSPORTADORA: 'TRANSPORTADORA',
        NUMERO_NOTA: 'NUMERO_NOTA',
        s: 's',
        VOLUME: 'VOLUME',
    },
    {
        RAZAO_SOCIAL: '123123',
        CNPJ_EMPRESA: '123123',
        IE_EMPRESA: '123123',
        RAZAO_SOCIAL_CLIENTE: '123123',
        ENDERECO_CLIENTE: '123123',
        BAIRRO_CLIENTE: '123123',
        CIDADE_CLIENTE: '123123',
        UF_CLIENTE: '123123',
        CEP_CLIENTE: '123123',
        TRANSPORTADORA: '123123',
        NUMERO_NOTA: '123123',
        s: '123123',
        VOLUME: '123123',
    }
];

for(let i = 0; i < data.length; i++) {
    const item = data[i];
    epl.ClearImageBuffer()
        .CharacterSubstitution()
        .Density(8)
        .LineDrawBlack(0,500,900, 10)
        .LineDrawBlack(0,400,900, 10)
        .LineDrawBlack(0,0,900,10)
        .LineDrawBlack(0,0,10, 500)
        .LineDrawBlack(806,0,10,500)
        .Text(725,490,2,4,1,2,'N',`${item.RAZAO_SOCIAL}`)
        .Text(725,440,2,2,1,2,'N',`NPJ: ${item.CNPJ_EMPRESA}`)
        .Text(200,440,2,2,1,2,'N',`E: ${item.IE_EMPRESA}`)
        .Text(790,390,2,4,1,2,'N',`${item.RAZAO_SOCIAL_CLIENTE}`)
        .Text(790,340,2,2,1,2,'N',`${item.ENDERECO_CLIENTE}`)
        .Text(790,295,2,2,1,2,'N',`${item.BAIRRO_CLIENTE}`)
        .Text(790,250,2,2,1,2,'N',`${item.CIDADE_CLIENTE}`)
        .Text(100,250,2,2,1,2,'N',`F: ${item.UF_CLIENTE}`)
        .Text(790,205,2,2,1,2,'N',`EP: ${item.CEP_CLIENTE}`)
        .Text(790,155,2,3,1,2,'N',`RANSPORTADORA: ${item.TRANSPORTADORA}`)
        .Text(790,105,2,3,1,2,'N',`º NOTA FISCAL: ${item.NUMERO_NOTA}`)
        .Text(790,55,2,3,1,2,'N',`VOLUME: ${item.s}/${item.VOLUME}`)
        .Print(1);
}
console.log(epl.getOutput());