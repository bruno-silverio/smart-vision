import Image from 'next/image';
import Link from 'next/link';

const articles = [
  {
    title: 'Titulo 1',
    description: 'Over the past year, Volosoft has undergone many changes! After months of preparation.',
    image: '/cop-wallpaper.jpg',
    date: '05/10/2024',
    link: '/article1'
  },
  {
    title: 'Titulo 2',
    description: 'Over the past year, Volosoft has undergone many changes! After months of preparation.',
    image: '/cop-wallpaper.jpg',
    date: '05/10/2024',
    link: '/article2'
  },
  {
    title: 'Titulo 3',
    description: 'Over the past year, Volosoft has undergone many changes! After months of preparation.',
    image: '/cop-wallpaper.jpg',
    date: '05/10/2024',
    link: '/article3'
  },
  {
    title: 'Titulo 4',
    description: 'Over the past year, Volosoft has undergone many changes! After months of preparation.',
    image: '/cop-wallpaper.jpg',
    date: '05/10/2024',
    link: '/article4'
  },
  {
    title: 'Titulo 5',
    description: 'The longest word in any of the major English language dictionaries is pneumonoultramicroscopicsilicovolcanoconiosis, a word that refers to a lung disease contracted from the inhalation of very fine silica particles, specifically from a volcano; medically, it is the same as silicosis.',
    image: '/cop-wallpaper.jpg',
    date: '05/10/2024',
    link: '/article5'
  },
  {
    title: 'Titulo 6',
    description: 'Over the past year, Volosoft has undergone many changes! After months of preparation.',
    image: '/cop-wallpaper.jpg',
    date: '05/10/2024',
    link: '/article6'
  }
];

export default function RelatedArticles() {
  return (
    <div className="bg-gray-900 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Link href={article.link} className="text-blue-600 hover:underline">
                <Image src={article.image} alt={article.title} width={400} height={250} className="w-full object-cover"/>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-700 mb-4 truncate">{article.description}</p>
                  Created: {article.date}
                </div>
              </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
