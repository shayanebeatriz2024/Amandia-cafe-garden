import type { SVGProps } from 'react';

/**
 * Ilustrações artesanais de café em traço fino (line art), decorativas.
 * Cor via currentColor (ex.: text-ceramic-brown/35).
 */
type Props = SVGProps<SVGSVGElement>;

/**
 * Folha do cafeeiro (Coffea arabica): elíptica, ponta afilada (acuminada),
 * nervura central e nervuras laterais curvas que seguem até a borda. Aponta para a direita.
 */
function CoffeeLeaf({ x, y, angle, flip = false, size = 1 }: { x: number; y: number; angle: number; flip?: boolean; size?: number }) {
  const t = `translate(${x} ${y}) ${flip ? 'scale(-1 1) ' : ''}rotate(${angle}) scale(${size})`;
  return (
    <g transform={t}>
      <path d="M0 0C12 -16 40 -20 58 -8C64 -4 68 -1 74 0C68 1 64 4 58 8C40 20 12 16 0 0Z" />
      <path d="M2 0Q38 -1 72 0" />
      <path d="M12 0Q18 -8 26 -12M12 0Q18 8 26 12M26 0Q33 -9 41 -13M26 0Q33 9 41 13M40 0Q47 -7 54 -9M40 0Q47 7 54 9M53 0Q58 -4 63 -5M53 0Q58 4 63 5" />
    </g>
  );
}

/** Cacho de frutos do café (cerejas ovais com a pequena "coroa" na ponta), junto ao nó. */
function CoffeeCherries({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const fruits = [
    [0, 0, -12],
    [9, 4, 8],
    [2, 11, -4],
    [11, 14, 14],
  ] as const;
  return (
    <g transform={`translate(${x} ${y}) ${flip ? 'scale(-1 1)' : ''}`}>
      {fruits.map(([fx, fy, rot]) => (
        <g key={`${fx}-${fy}`} transform={`translate(${fx} ${fy}) rotate(${rot})`}>
          <ellipse cx="0" cy="0" rx="4.4" ry="5.6" />
          <circle cx="0" cy="4.4" r="0.9" />
        </g>
      ))}
    </g>
  );
}

/** Ramo vertical de cafeeiro: pares opostos de folhas e cachos de frutos nas axilas. */
export function CoffeeBranch(props: Props) {
  const nodes = [80, 175, 270, 365, 460, 555];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 220 640"
      data-parallax="0.12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M110 6C105 130 116 250 109 360C103 470 114 550 110 634" />
      {nodes.map((y, i) => {
        const big = i % 2 === 0 ? 1.3 : 1.12;
        return (
          <g key={y}>
            {/* folhas opostas, inclinadas para cima */}
            <CoffeeLeaf x={111} y={y} angle={-30} size={big} />
            <CoffeeLeaf x={109} y={y} angle={-30} flip size={big} />
            {/* frutos nas axilas, alternando o lado */}
            {i % 2 === 1 && <CoffeeCherries x={i % 4 === 1 ? 116 : 104} y={y + 6} flip={i % 4 !== 1} />}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Sequência de extração no coado: filtro de papel no coador sobre o bule,
 * gotas caindo e, ao lado, a xícara com vapor no pires.
 */
export function PourOverDoodle(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 176 132"
      data-parallax="0.1"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {/* Coador (cone) com o filtro de papel e alça */}
      <path d="M26 16H94L76 56H44Z" />
      <path d="M22 16H98" />
      <path d="M36 18L49 54M84 18L71 54" />
      <path d="M94 24Q110 26 103 42Q100 48 90 46" />
      {/* Gotas */}
      <path d="M60 62V68M60 74V78" />
      {/* Bule de vidro (server) */}
      <path d="M44 82H76Q80 82 80 86L84 114Q84 122 76 122H44Q36 122 36 114L40 86Q40 82 44 82Z" />
      <path d="M38 102H82" />
      <path d="M80 92Q90 92 90 102Q90 110 82 112" />
      {/* Xícara ao lado, com vapor e pires */}
      <path d="M116 92H152V104Q152 118 138 118H130Q116 118 116 104Z" />
      <path d="M152 96Q162 96 162 103Q162 110 152 110" />
      <path d="M108 124Q134 130 160 124" />
      <path d="M128 84Q124 78 128 72Q132 66 128 60M140 84Q136 78 140 72Q144 66 140 60" />
    </svg>
  );
}

/** Grão de café torrado: oval com a fenda central em S. */
export function CoffeeBean(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <ellipse cx="12" cy="16" rx="9" ry="13" />
      <path d="M12 4Q7 10 12 16Q17 22 12 28" />
    </svg>
  );
}

/** Caneca com vapor sobre o pires. */
export function CoffeeMug(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 72 64"
      data-parallax="0.1"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M14 26H50V40Q50 54 36 54H28Q14 54 14 40Z" />
      <path d="M50 30Q62 30 62 38Q62 46 50 46" />
      <path d="M6 58Q32 64 58 58" />
      <path d="M26 20Q22 15 26 10Q30 5 26 2M38 20Q34 15 38 10Q42 5 38 2" />
    </svg>
  );
}

/** Botão de flor em tulipa (três pontas) com a base em (0, 0), apontando para cima. */
function TulipBud({ x, y, angle = 0, size = 1 }: { x: number; y: number; angle?: number; size?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}
      d="M0 0C-7 -1 -9 -8 -8 -16L-4 -11L0 -18L4 -11L8 -16C9 -8 7 -1 0 0Z"
    />
  );
}

/**
 * Florzinha: ramo em traço fino com botões de tulipa, coraçõezinhos e pontos
 * (desenho das xícaras do Amandia). Pensada como marca d'água.
 */
export function FlowerSprig(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {/* Talo central e galhos */}
      <path d="M62 196C58 160 66 120 58 84C55 68 58 52 58 38" />
      <path d="M61 160Q44 154 34 138" />
      <path d="M62 128Q80 122 90 106" />
      <path d="M58 92Q42 86 32 70" />
      <path d="M58 62Q74 56 84 42" />

      {/* Botões de tulipa nas pontas */}
      <TulipBud x={58} y={38} />
      <TulipBud x={34} y={138} angle={-40} />
      <TulipBud x={90} y={106} angle={35} />
      <TulipBud x={32} y={70} angle={-35} />
      <TulipBud x={84} y={42} angle={30} size={0.9} />

      {/* Coraçõezinhos e pontos soltos (preenchidos) */}
      <g fill="currentColor" stroke="none">
        <path d="M44 22c-2-2.4-5-1-4.6 1.6.3 2 2.6 3.4 4.6 5 2-1.6 4.3-3 4.6-5 .4-2.6-2.6-4-4.6-1.6Z" />
        <path d="M100 74c-1.6-2-4-.8-3.7 1.3.2 1.6 2 2.7 3.7 4 1.6-1.3 3.5-2.4 3.7-4 .3-2.1-2.1-3.3-3.7-1.3Z" />
        <path d="M18 108c-1.6-2-4-.8-3.7 1.3.2 1.6 2 2.7 3.7 4 1.6-1.3 3.5-2.4 3.7-4 .3-2.1-2.1-3.3-3.7-1.3Z" />
        <circle cx="72" cy="20" r="1.8" />
        <circle cx="26" cy="46" r="1.5" />
        <circle cx="104" cy="128" r="1.5" />
        <circle cx="22" cy="168" r="1.8" />
        <circle cx="84" cy="156" r="1.5" />
      </g>
    </svg>
  );
}

/** Fatia de bolo em camadas com cobertura escorrendo e uma cereja no topo. */
export function CakeSlice(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M8 30L58 14L72 30V54H8Z" />
      <path d="M8 30H72" />
      <path d="M8 42H72" />
      <path d="M8 30Q12 36 16 30Q20 37 25 30M44 30Q48 35 52 30Q56 36 61 30" />
      <circle cx="58" cy="9" r="4" />
      <path d="M58 5Q60 1 64 1" />
      <path d="M4 58H76" />
    </svg>
  );
}
