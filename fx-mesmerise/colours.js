const colours = [
    {
        name: 'Apple',
        black: '#0E2622',
        white: '#F2F2F2',
        greys: ['#58788C'],
        colours: ['#05F258', '#D95F5F']
    },
    {
        name: 'Rubine',
        black: '#232526',
        white: '#e9edef',
        greys: ['#767c7e'],
        colours: ['#a10bdc', '#e7077e']
    },
    {
        name: 'Constructivist',
        black: '#16130c',
        white: '#E8E5D7',
        greys: ['#8c8989', '#afada4'],
        colours: ['#FF4100']
    },
    {
        name: 'Warm Grey',
        black: '#0B2126',
        white: '#f5f1ec',
        greys: ['#BEBFB8', '#989993'],
        colours: ['#72736E', '#F2D8A7', '#D9B391']
    },
    {
        name: 'Dusty Red',
        black: '#0e0c0a',
        white: '#faf6eb',
        greys: ['#a2a198', '#d5d2c2'],
        colours: ['#850404', '#12384f', '#295c7c']
    },
    {
        name: 'French Grey',
        black: '#0E1012',
        white: '#fafaf7',
        greys: ['#b3b8be', '#d0d7dc'],
        colours: ['#1A2D3B', '#1C3F69', '#77B2D0']
    },
    {
        name: 'Mint',
        black: '#151716',
        white: '#f6f3f3',
        greys: ['#a3b7ad', '#5f6964'],
        colours: ['#fce250', '#569E91', '#a3e12f']
    },
    {
        name: 'Rouge',
        black: '#171521',
        white: '#fff6f0',
        greys: ['#5b5d55', '#a1a097'],
        colours: ['#f83558', '#c7094e', '#790530']
    },
    {
        name: 'Furnace',
        black: '#172526',
        white: '#e9ece7',
        greys: ['#455759', '#748C8C'],
        colours: ['#c71808', '#e86e1a', '#da0764']
    },
    {
        name: 'Harvest',
        black: '#0D1F30',
        white: '#f6efdb',
        greys: ['#d9d1c7', '#a9a49c'],
        colours: ['#3B6670', '#DB6C0F', '#8BADA3']
    },
    {
        name: 'Cool Black & White',
        black: '#0D0D0D',
        white: '#F7F2EB',
        greys: ['#b7bdc9'],
        colours: ['#595857', '#D9CEC1', '#A69C94', '#e3e3e3']
    },
    {
        name: 'Pink Blossom',
        black: '#04090D',
        white: '#FFF1E3',
        greys: ['#8a9fa2'],
        colours: ['#F25C78', '#BABDBF', '#F2D8CE', '#A62D2D']
    },
    {
        name: 'Azure',
        black: '#1B1B1D',
        white: '#F1F2EB',
        greys: ['#E4E6DF', '#C1C2BC'],
        colours: ['#1131ec', '#0712ea', '#0b81da', '#9235e1']
    },
    {
        name: 'Mocha',
        black: '#17130e',
        white: '#F2ECE6',
        greys: ['#d4c8c3', '#a19b94'],
        colours: ['#deac85', '#A6634B', '#592C22', '#410b15']
    },
    {
        name: 'Forest',
        black: '#0D0D0D',
        white: '#F5F5F5',
        greys: ['#ADA695', '#CCC3AF'],
        colours: ['#1e4d40', '#94BF36', '#5AAB2E', '#91d726']
    },
    {
        name: 'Lemon',
        black: '#010326',
        white: '#F2F1ED',
        greys: ['#ADA695', '#CCC3AF'],
        colours: ['#F2E205', '#D9D6B0', '#A6A48A', '#F2CB05']
    },
    {
        name: 'Twilight',
        black: '#141517',
        white: '#eeede9',
        greys: ['#C3D4D2', '#94A19D'],
        colours: ['#05F2AF', '#175073', '#12396b', '#D9525E']
    },
    {
        name: 'Slate & Peach',
        black: '#082026',
        white: '#E6F3FA',
        greys: ['#E8D5DC', '#AAA3B5'],
        colours: ['#1C6277', '#103F4C', '#FFC3A1', '#FFA194']
    },
    {
        name: 'Retro Grey',
        black: '#111112',
        white: '#FDFDFD',
        greys: ['#BDBDBF', '#8B8B8C'],
        colours: ['#A4B6A0', '#DA4522', '#39393d', '#575758']
    },
    {
        name: 'Sunset',
        black: '#0D0D0D',
        white: '#F7F4EB',
        greys: ['#ABCFCB', '#C3EBE7'],
        colours: ['#F2637E', '#038C7F', '#D9AC25', '#F25430']
    },
    {
        name: 'Pastel',
        black: '#222226',
        white: '#f5f2ec',
        greys: ['#D6D3CB', '#C9C6BF'],
        colours: ['#A4E5E6', '#f3d593', '#6D7099', '#FF8B94']
    },
    {
        name: 'Spy',
        black: '#0F1413',
        white: '#E6F2F0',
        greys: ['#424241', '#b9b9b6'],
        colours: ['#77A69D', '#3E4A2D', '#D8D9D0', '#A67F38', '#D99748']
    },
    {
        name: 'Warm Dusk',
        black: '#11161A',
        white: '#E4F0F7',
        greys: ['#829DAD', '#A4C6DB'],
        colours: ['#D96A9E', '#053959', '#043142', '#177DA6', '#1FA2BF']
    },
    {
        name: 'Luscious Purple',
        black: '#0b0b0c',
        white: '#DEE3E2',
        greys: ['#918E99', '#717177'],
        colours: ['#C004D9', '#7c12a9', '#4a0e85', '#12158c', '#1590ab']
    },
    {
        name: 'Peach',
        black: '#13161A',
        white: '#f8f0e8',
        greys: ['#E8D5DC', '#AAA3B5'],
        colours: ['#FFAA5C', '#DA727E', '#AC6C82', '#685C79', '#455C7B']
    },
    {
        name: 'Candy',
        black: '#1F1C1C',
        white: '#F8F2FA',
        greys: ['#C1B1C7', '#A1999C'],
        colours: ['#F08571', '#C9F07D', '#F065A3', '#4DF0AE', '#CB59F0']
    }
];
