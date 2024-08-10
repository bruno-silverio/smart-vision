import Image from "next/image";
import Header from "./components/Header";
import Link from "next/link";

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { PlayIcon } from '@heroicons/react/24/solid'

export default function Home() {
  return (
    <div className='relative h-screen overflow-hidden bg-gradient-to-b lg:h-[140vh]'>
      <Header />
      <main className='relative pb-24 pl-4 lg:pl-16'>
        <div className='flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12'>
          <div className='absolute left-0 top-0 -z-10 h-[95vh] w-screen flex-col bg-sky-950'>
            <Image
              src='/cop-wallpaper.jpg'
              alt='Trabalho de conclusão de curso - Engenharia de Computação'
              fill={true}
              className='h-[65vh] object-cover object-top lg:h-[95vh]'
            />
          </div>

          <h1 className='text-2xl font-bold md:text-5xl lg:text-6x1'>
            Smart Vision
          </h1>

          <p className='text-shadow-md max-w-xs text-xs md:max-w-lg md:text-lg lg:max-w-1x1'>
          Final project for the computer engineering course:
          a car detection system using artificial intelligence.
          </p>
        </div>

        <div className='flex space-x-4'>
          <Link href='/detection'>
            <button className='md:text-xl; flex cursor-pointer items-center gap-x-2 rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:opacity-75 md:px-8 md:py-2.5'>
              <PlayIcon className="size-6 text-black" />
              Detection
            </button>
          </Link>

          <Link href='/about'>
            <button className='md:text-xl; flex cursor-pointer items-center gap-x-2 rounded bg-gray-500 px-5 py-1.5 text-sm font-semibold text-black transition hover:opacity-75 md:px-8 md:py-2.5'>
              <InformationCircleIcon className="size-6 text-black" />
              More Info
            </button>
          </Link>
        </div>

      </main>
    </div>
  );
}
