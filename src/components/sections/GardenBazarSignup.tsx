import { CoffeeBean } from '@/components/ui/coffee-illustrations';
import { Sparkle, SunBurst } from '@/components/ui/doodles';
import { GardenBazarForm } from './GardenBazarForm';

/** Bloco do Garden Café Bazar: chamada para expositores/artesãos + cadastro via WhatsApp. */
export function GardenBazarSignup() {
  return (
    <div
      role="group"
      aria-labelledby="bazar-cadastro-titulo"
      className="card relative mt-14 overflow-hidden px-6 py-14 md:px-16"
    >
      {/* Estrelas e grãos de café nos cantos — decorativos, só a partir do tablet */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        <Sparkle className="absolute left-[8%] top-[12%] size-5 text-amandia-orange/70" />
        <SunBurst className="absolute left-[12%] top-[22%] size-7 text-amandia-pink/70" />
        <CoffeeBean className="absolute bottom-[18%] left-[7%] w-4 rotate-12 text-ceramic-brown/45" />
        <CoffeeBean className="absolute bottom-[14%] left-[10%] w-4 -rotate-45 text-ceramic-brown/45" />
        <Sparkle className="absolute right-[9%] top-[14%] size-6 text-clay-500/70" />
        <CoffeeBean className="absolute right-[12%] top-[40%] w-4 rotate-45 text-ceramic-brown/45" />
        <Sparkle className="absolute bottom-[20%] right-[8%] size-4 text-amandia-orange/70" />
      </div>

      <header className="relative text-center">
        <h3 id="bazar-cadastro-titulo" className="text-h2">
          Quero participar da <em>Garden</em>
        </h3>
        <p className="mt-3 font-handwriting text-3xl font-semibold text-amandia-green">
          Nos conte aqui embaixo
        </p>
      </header>

      <div className="relative">
        <GardenBazarForm />
      </div>
    </div>
  );
}
