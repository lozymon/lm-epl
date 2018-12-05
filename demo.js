const EPL = require('./index');
const epl = new EPL({debug: true, samba_temp: process.cwd(), samba: '\\\\10.7.155.99\\gc420'});

const data = [
    {
        CODIGO: '9981520001',
        RAZAO_SOCIAL: 'RAZAO_SOCIAL',
        CNPJ_EMPRESA: 'CNPJ_EMPRESA',
        IE_EMPRESA: 'IE_EMPRESA',
        RAZAO_SOCIAL_CLIENTE: 'RAZAO_SOCIAL_CLIENTE',
        ENDERECO_CLIENTE: 'ENDERECO_CLIENTE',
        BAIRRO_CLIENTE: 'BAIRRO_CLIENTE',
        CIDADE_CLIENTE: 'CIDADE_CLIENTE',
        UF_CLIENTE: 'RN',
        CEP_CLIENTE: '59067-405',
        TRANSPORTADORA: 'TRANSPORTADORA',
        NUMERO_NOTA: 'NUMERO_NOTA',
        s: '1',
        VOLUME: '1',
    }
];

for (let i = 0; i < data.length; i++) {
    const item = data[i];
    epl.ClearImageBuffer()
        .CharacterSubstitution()
        .Density(8)
        .LineDrawBlack(0, 500, 810, 10)
        .LineDrawBlack(0, 400, 800, 10)
        .LineDrawBlack(0, 0, 800, 10)
        .LineDrawBlack(0, 0, 10, 500)
        .LineDrawBlack(800, 0, 10, 500)
        .Text(790, 490, 2, 4, 1, 2, 'N', `${item.RAZAO_SOCIAL}`)
        .Text(790, 440, 2, 2, 1, 2, 'N', `CNPJ: ${item.CNPJ_EMPRESA}`)
        .Text(200, 440, 2, 2, 1, 2, 'N', `IE: ${item.IE_EMPRESA}`)
        .Text(790, 390, 2, 4, 1, 2, 'N', `${item.RAZAO_SOCIAL_CLIENTE}`)
        .Text(790, 340, 2, 2, 1, 2, 'N', `${item.ENDERECO_CLIENTE}`)
        .Text(790, 295, 2, 2, 1, 2, 'N', `${item.BAIRRO_CLIENTE}`)
        .Text(790, 250, 2, 2, 1, 2, 'N', `${item.CIDADE_CLIENTE}`)
        .Text(100, 250, 2, 2, 1, 2, 'N', `UF: ${item.UF_CLIENTE}`)
        .Text(790, 205, 2, 2, 1, 2, 'N', `CEP: ${item.CEP_CLIENTE}`)
        .Text(790, 155, 2, 3, 1, 2, 'N', `TRANSP.: ${item.TRANSPORTADORA}`)
        .Text(790, 105, 2, 3, 1, 2, 'N', `Nº NF: ${item.NUMERO_NOTA}`)
        .Text(790, 55, 2, 3, 1, 2, 'N', `VOLUME: ${item.s}/${item.VOLUME}`)
        .BarCode(300, 125, 2, 1, 3, 7, 75, 'B', item.CODIGO)
        .Print(1)
        .sendToPrinter(function (...args) {
            console.log(args);
        });
}

console.log(epl.getOutput());


// const func = new Function('data', 'epl', code);
//
// func(data, epl);