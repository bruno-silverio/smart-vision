import Image from 'next/image';
import Link from 'next/link';

type Investigation = {
  title: string;
  description: string;
  image: string;
  date: string;
  link: string;
};

type RelatedArticlesProps = {
  investigation: Investigation[];
};

export default function RelatedArticles({ investigation }: RelatedArticlesProps) {
  return (
    <div className="bg-gray-900 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {investigation.map((investigation, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Link href={investigation.link} className="text-blue-600 hover:underline">
                <Image src={investigation.image} alt={investigation.title} width={400} height={250} className="w-full object-cover"/>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{investigation.title}</h3>
                  <p className="text-gray-700 mb-4 truncate">{investigation.description}</p>
                  Created: {investigation.date}
                </div>
              </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
