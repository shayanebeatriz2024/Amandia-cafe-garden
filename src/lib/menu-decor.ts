/**
 * Elementos gráficos do cardápio impresso "Cardápio Atualizado 2026" (assets em
 * public/images/cardapio/ilustracoes/, recortados do PDF original em traço verde).
 * Posições relativas espelham o documento: letreiro manuscrito no topo, desenho da capa
 * no lugar da foto, ilustrações ao lado do item correspondente e desenhos de rodapé.
 * Desenhos da capa: desenho-*.png; adesivos da cartela oficial recoloridos em verde: adesivo-*-verde.png.
 */
import type { StaticImageData } from 'next/image';
import tituloBebidas from '../../public/images/cardapio/ilustracoes/titulo-bebidas.png';
import tituloSalgados from '../../public/images/cardapio/ilustracoes/titulo-salgados.png';
import tituloDoces from '../../public/images/cardapio/ilustracoes/titulo-doces.png';
import maquinaEspresso from '../../public/images/cardapio/ilustracoes/desenho-maquina-espresso.png';
import tacaMochaGrande from '../../public/images/cardapio/ilustracoes/desenho-taca-mocha.png';
import milFolhas from '../../public/images/cardapio/ilustracoes/desenho-mil-folhas.png';
import ramoCafeGrande from '../../public/images/cardapio/ilustracoes/desenho-ramo-cafe-grande.png';
import coadorXicara from '../../public/images/cardapio/ilustracoes/desenho-coador-xicara.png';
import adesivoCoracaoVaso from '../../public/images/cardapio/ilustracoes/adesivo-coracao-vaso-verde.png';
import adesivoCanecaMao from '../../public/images/cardapio/ilustracoes/adesivo-caneca-mao-verde.png';
import passaro from '../../public/images/cardapio/ilustracoes/passaro-menu.png';
import abacaxi from '../../public/images/cardapio/ilustracoes/abacaxi.png';
import casa from '../../public/images/cardapio/ilustracoes/casa.png';
import peixe from '../../public/images/cardapio/ilustracoes/peixe.png';
import quindim from '../../public/images/cardapio/ilustracoes/quindim.png';
import sol from '../../public/images/cardapio/ilustracoes/sol.png';
import vasoPa from '../../public/images/cardapio/ilustracoes/vaso-pa.png';
import brigadeiro from '../../public/images/cardapio/ilustracoes/brigadeiro.png';
import cadeira from '../../public/images/cardapio/ilustracoes/cadeira.png';
import ramoCafe from '../../public/images/cardapio/ilustracoes/ramo-cafe.png';
import tacaMocha from '../../public/images/cardapio/ilustracoes/icone-taca-mocha.png';
// Anotações manuscritas recortadas do impresso (traço original, não fonte).
import notaMaisPedido from '../../public/images/cardapio/ilustracoes/nota-o-mais-pedido.png';
import notaClassicoBebidas from '../../public/images/cardapio/ilustracoes/nota-classico-bebidas.png';
import notaBomDemais from '../../public/images/cardapio/ilustracoes/nota-bom-demais.png';
import notaVegetariana from '../../public/images/cardapio/ilustracoes/nota-opcao-vegetariana.png';
import notaClassicoPizza from '../../public/images/cardapio/ilustracoes/nota-classico-pizza.png';
import notaBolos from '../../public/images/cardapio/ilustracoes/nota-bolos.png';
import notaTortaAutoral from '../../public/images/cardapio/ilustracoes/nota-torta-autoral.png';

export type MenuArt = { src: StaticImageData; className: string };

export type PageDecor = {
  /** Letreiro manuscrito do título, como no impresso (o h3 segue com o nome para leitores de tela). */
  lettering?: StaticImageData;
  /** Desenho do impresso/cartela no topo da página, no lugar da foto. */
  cover?: MenuArt;
  /** Selo "a produção é nossa" com o coração oficial. */
  producaoNossa?: boolean;
  /** Desenhos de rodapé, no fluxo (nunca sobre preços). */
  footerLeft?: MenuArt[];
  footerRight?: MenuArt[];
};

export type ItemDecor = {
  /** Ilustração ao lado do item (abacaxi, casinha, quindim…). */
  art?: MenuArt[];
  /** Coração oficial marcando o item (como no impresso). */
  heart?: boolean;
  /** Anotação manuscrita do impresso como imagem (o texto da nota vira o alt). */
  noteArt?: MenuArt;
  /** Selo manuscrito colado ao nome, sem linha de chamada (ex.: "[ opção vegetariana ]"). */
  badge?: { text: string; art: MenuArt };
  /** Subtítulo de grupo antes do item, com anotação manuscrita opcional. */
  heading?: { text: string; note?: string; noteArt?: MenuArt };
};

export const PAGE_DECOR: Record<string, PageDecor> = {
  bebidas: {
    lettering: tituloBebidas,
    cover: { src: ramoCafeGrande, className: 'w-40 md:w-52' },
    footerRight: [{ src: passaro, className: 'w-40 md:w-48' }],
  },
  'cafes-especiais': {
    cover: { src: maquinaEspresso, className: 'w-52 md:w-64' },
    footerLeft: [{ src: tacaMochaGrande, className: 'w-16 md:w-20' }],
    footerRight: [{ src: ramoCafe, className: 'w-32 md:w-40' }],
  },
  'sanduiches-focaccias': {
    lettering: tituloSalgados,
    cover: { src: adesivoCoracaoVaso, className: 'w-36 md:w-44' },
    producaoNossa: true,
    footerLeft: [{ src: peixe, className: 'w-12 md:w-14' }],
  },
  doces: {
    lettering: tituloDoces,
    cover: { src: milFolhas, className: 'w-48 md:w-60' },
    producaoNossa: true,
    footerLeft: [
      { src: vasoPa, className: 'w-40 md:w-48' },
      { src: cadeira, className: 'w-20 md:w-24' },
    ],
  },
  'graos-para-levar': {
    cover: { src: coadorXicara, className: 'w-36 md:w-44' },
    footerRight: [{ src: adesivoCanecaMao, className: 'w-28 md:w-32' }],
  },
};

export const ITEM_DECOR: Record<string, ItemDecor> = {
  'golden-cafe': { heart: true },
  'capuccino-canela': { noteArt: { src: notaMaisPedido, className: 'w-24' } },
  mocamandia: { art: [{ src: tacaMocha, className: 'w-5' }] },
  'caipirinha-vodka': { noteArt: { src: notaClassicoBebidas, className: 'w-40' } },
  italianinho: {
    heading: {
      text: 'Sanduíches especiais com pão FOCACCIA:',
      note: 'bom demais',
      noteArt: { src: notaBomDemais, className: 'w-28' },
    },
  },
  caprese: { badge: { text: 'opção vegetariana', art: { src: notaVegetariana, className: 'w-36' } } },
  pampas: { art: [{ src: abacaxi, className: 'w-9' }] },
  'pizza-de-sardinha': {
    noteArt: { src: notaClassicoPizza, className: 'w-16' },
    art: [{ src: casa, className: 'w-7' }],
  },
  'bolos-amandia': { heart: true, noteArt: { src: notaBolos, className: 'w-48' } },
  'torta-amandia': { noteArt: { src: notaTortaAutoral, className: 'w-40' } },
  quindim: {
    art: [
      { src: sol, className: 'w-8' },
      { src: quindim, className: 'w-20' },
    ],
  },
  brigadeiro: { art: [{ src: brigadeiro, className: 'w-12' }] },
};
