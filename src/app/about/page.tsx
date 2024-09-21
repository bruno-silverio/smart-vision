import React from "react";
import Link from "next/link";
import Image from "next/image";

import { CodeBracketIcon, AcademicCapIcon } from '@heroicons/react/24/solid'


import Header from "./../components/Header";
import Footer from "../components/Footer";

function About() {
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
            Engenharia de Computação
          </h1>
          <h1 className='text-2xl font-bold md:text-3xl lg:text-6x1'>
            Trabalho de Conclusão de Curso
          </h1>

          <p className='text-shadow-md max-w-xs text-xs md:max-w-lg md:text-lg lg:max-w-1x1'>
            Esse site foi desenvolvido com o objetivo de automatizar a busca de veículos em arquivos de video.
            Através da IA é feita a detecção dos veículos, modelo e placa. Depois é realizado a consulta das placas
            onde é confrontado as informações para averiguar a situação dos veículos.
          </p>
        </div>

        <div className='flex space-x-4'>
          <Link href='https://www.linkedin.com/in/bruno-silverio/'>
            <button className='md:text-xl; flex cursor-pointer items-center gap-x-2 rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:opacity-75 md:px-8 md:py-2.5'>
              <AcademicCapIcon className="size-6 text-black" />
              LinkedIn
            </button>
          </Link>
          <Link href='https://github.com/bruno-silverio'>
            <button className='md:text-xl; flex cursor-pointer items-center gap-x-2 rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:opacity-75 md:px-8 md:py-2.5'>
              <CodeBracketIcon className="size-6 text-black" />
              GitHub
            </button>
          </Link>
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default About;