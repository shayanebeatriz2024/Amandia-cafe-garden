/**
 * Fotos reais do Amandia (recortadas dos stories oficiais — originais em assets/originais/).
 * Import estático: o Next gera width/height e blurDataURL automaticamente (CLS 0 + blur-up).
 */
import type { StaticImageData } from 'next/image';
import croissantsEFrutas from '../../public/images/hero/croissants-e-frutas.jpg';
import folhagens from '../../public/images/espaco/folhagens.jpg';
import gardenMesas from '../../public/images/espaco/garden-mesas.jpg';
import revista from '../../public/images/espaco/revista.jpg';
import mesaDecorada from '../../public/images/mesa-posta/mesa-decorada.jpg';
import boloComFrutas from '../../public/images/catalogo/bolo-com-frutas.jpg';
import bebidas from '../../public/images/catalogo/bebidas.jpg';
import aconchego from '../../public/images/identidade/aconchego.jpg';
import gardenMesaBolo from '../../public/images/hero/garden-mesa-bolo.jpg';
import tortaFloresHero from '../../public/images/cardapio/torta-flores-hero.jpg';
import gardenOmbrelones from '../../public/images/espaco/garden-ombrelones.jpg';
import mesaDeDoces from '../../public/images/mesa-posta/mesa-de-doces.jpg';
import mesaSalgados from '../../public/images/mesa-posta/mesa-salgados.jpg';
import focacciaECafe from '../../public/images/catalogo/focaccia-e-cafe.jpg';
import cesta from '../../public/images/catalogo/cesta.jpg';
import mesaPostaBanquete from '../../public/images/momentos/mesa-posta-banquete.jpg';
import cafeBoloCenoura from '../../public/images/momentos/cafe-bolo-cenoura.jpg';
import gardenQueBom from '../../public/images/momentos/garden-que-bom-que-voce-veio.jpg';
import guriaCafesEspeciais from '../../public/images/momentos/guria-cafes-especiais.jpg';
import entradaBalancos from '../../public/images/momentos/entrada-balancos.jpg';
import brownieCappuccino from '../../public/images/momentos/brownie-cappuccino.jpg';
import iconeVasoSementes from '../../public/images/ilustracoes/icone-vaso-sementes.png';
import iconeXicaraAfeto from '../../public/images/ilustracoes/icone-xicara-afeto.png';
import iconePassaroRamo from '../../public/images/ilustracoes/icone-passaro-ramo.png';
import iconeGardenOmbrelone from '../../public/images/ilustracoes/icone-garden-ombrelone.png';
import iconeRamoFolhas from '../../public/images/ilustracoes/icone-ramo-folhas.png';

export interface Photo {
  src: StaticImageData;
  alt: string;
}

export const photos = {
  croissantsEFrutas: {
    src: croissantsEFrutas,
    alt: 'Mini croissants recheados e espetinhos de frutas sobre tronco de madeira, preparados para uma celebração no Amandia',
  },
  folhagens: {
    src: folhagens,
    alt: 'Folhagens verdes junto ao muro do Garden do Amandia Café Garden',
  },
  gardenMesas: {
    src: gardenMesas,
    alt: 'Mesas com louças e taças entre as plantas do Garden ao ar livre',
  },
  revista: {
    src: revista,
    alt: 'Reportagem de revista sobre o Amandia Café Garden: um lugar para estar e também para celebrar',
  },
  mesaDecorada: {
    src: mesaDecorada,
    alt: 'Mesa posta de madeira com xícaras verde-sálvia, guardanapos de linho e taças de cristal',
  },
  boloComFrutas: {
    src: boloComFrutas,
    alt: 'Bolo artesanal com chantilly, morangos e mirtilos decorado com flores',
  },
  bebidas: {
    src: bebidas,
    alt: 'Suqueira de vidro com frutas e garrafas térmicas rosa e verde para chá e café',
  },
  aconchego: {
    src: aconchego,
    alt: 'Lettering "Aconchego" desenhado à mão, com a assinatura Amandia',
  },
  // Fotos em alta do Instagram oficial (originais em assets/originais/instagram/)
  gardenMesaBolo: {
    src: gardenMesaBolo,
    alt: 'Mesa no Garden com fatia de bolo, vaso de flores amarelas, ombrelone e varal de luzes ao fundo',
  },
  // Antiga foto do arco do Hero, guardada para reaproveitar mais abaixo no site
  tortaFloresHero: {
    src: tortaFloresHero,
    alt: 'Fatia de torta em prato azul no Garden, com vaso de flores amarelas e mosquitinhos',
  },
  gardenOmbrelones: {
    src: gardenOmbrelones,
    alt: 'Garden ao ar livre com ombrelone, cadeira de madeira, sofá com almofadas e varal de luzes',
  },
  mesaDeDoces: {
    src: mesaDeDoces,
    alt: 'Mesa de celebração com bolo de chocolate, brigadeiros, docinhos, frutas e arranjos de flores',
  },
  mesaSalgados: {
    src: mesaSalgados,
    alt: 'Mesa Posta com mini croissants, sanduíches de focaccia com tomate cereja, pães de queijo e morangos',
  },
  focacciaECafe: {
    src: focacciaECafe,
    alt: 'Focaccia tostada recheada com queijo, bule de café e xícara Amandia, com flores laranja ao fundo',
  },
  cesta: {
    src: cesta,
    alt: 'Cesta Amandia com suco natural, geleia, croissant, potinhos de doces e bolo do dia',
  },
  // Momentos no Garden (fotos verticais)
  mesaPostaBanquete: {
    src: mesaPostaBanquete,
    alt: 'Mesa posta com mini croissants, sanduíches de focaccia, pães de queijo, tomate cereja e morangos',
  },
  cafeBoloCenoura: {
    src: cafeBoloCenoura,
    alt: 'Xícara de café Amandia e fatia de bolo de cenoura com cobertura de chocolate e granulado',
  },
  gardenQueBom: {
    src: gardenQueBom,
    alt: 'Garden à noite com varal de luzes, plantas e a placa "Que bom que você veio"',
  },
  guriaCafesEspeciais: {
    src: guriaCafesEspeciais,
    alt: 'Pacotes de 250 g dos cafés especiais Guria Coffee Roasters, Clássico G1 e G2, no balcão do Amandia',
  },
  entradaBalancos: {
    src: entradaBalancos,
    alt: 'Entrada do Amandia com balanços de macramé, corações pendurados, varal de luzes e o salão interno ao fundo',
  },
  brownieCappuccino: {
    src: brownieCappuccino,
    alt: 'Cappuccino com latte art e brownie em louça de cerâmica terracota, com cestinha de pães de queijo',
  },
} satisfies Record<string, Photo>;

/**
 * Ilustrações oficiais dos destaques do Instagram (traço verde #2F5241, fundo transparente).
 * Decorativas: usar sempre com alt="".
 */
export const illustrations = {
  vasoSementes: iconeVasoSementes,
  xicaraAfeto: iconeXicaraAfeto,
  passaroRamo: iconePassaroRamo,
  gardenOmbrelone: iconeGardenOmbrelone,
  ramoFolhas: iconeRamoFolhas,
} satisfies Record<string, StaticImageData>;
