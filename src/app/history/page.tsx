'use client'

import React, { useEffect, useState }  from "react";
import Image from "next/image";

import { getDocuments, searchFirestore } from "@/app/lib/firebase/firestore";

import Header from "./../components/Header";
import Footer from "./../components/Footer";
import RelatedArticles from "../components/RelatedArticles";
import { SearchField } from "../components/SearchField";
import { DocumentData } from "../lib/types";

export default function History() {
  const [investigations, setInvestigations] = useState<DocumentData[]>([]);

  const fetchInvestigations = async () => {
    const docs = await getDocuments("investigations");
    const investigationsData = docs.map(doc => ({
      investigationId: doc.investigationId,
      title: doc.title,
      description: doc.description,
      image: '/default-investigation.jpg',
      date: doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toLocaleDateString() : 'Unknown Date',
      link: `/investigation/${doc.investigationId}`,
      createdAt: doc.createdAt,
      fileURL: doc.fileURL,
      userId: doc.userId,
    }));
    setInvestigations(investigationsData);
  };

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm) {
      const searchResults = await searchFirestore(searchTerm);
      setInvestigations(searchResults);
    } else {
      fetchInvestigations();
    }
  };

  useEffect(() => {
    fetchInvestigations();
  }, []);

  return (
    <div className='relative h-screen overflow-hidden bg-gradient-to-b lg:h-[140vh]'>
      <Header />
      <main className='relative pb-24 pl-4 lg:pl-16'>
        <div className='flex-col space-y-2 py-16 md:space-y-4 lg:h-[65vh] lg:justify-end lg:pb-12'>
          
          <div className='absolute left-0 top-0 -z-10 h-[95vh] w-screen flex-col bg-gray-900'>
            <Image
              src='/cop-wallpaper.jpg'
              alt='Background image'
              fill={true}
              className='h-[65vh] object-cover object-top lg:h-[95vh] opacity-10'
            />
          </div>

          <div className="mx-44 max-w-7x1">

            <div className="mb-8">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h2 className="text-3xl font-semibold text-white">Investigation history</h2>
                <SearchField onSearch={handleSearch} />
              </div>
            </div>

            <RelatedArticles investigation={investigations} />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
