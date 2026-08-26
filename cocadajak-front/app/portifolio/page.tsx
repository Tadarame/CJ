import Image from 'next/image';
import { getPortfolio } from '@/lib/api';

export default async function PortfolioPage() {
  const { photos } = await getPortfolio();

  return (
    <div>
      <h1>Portfólio</h1>
      {photos.length === 0 && <p>Nenhuma foto cadastrada ainda.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {photos.map((photo) => (
          <div key={photo.id}>
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${photo.image_path}`}
              alt={photo.title}
              width={300}
              height={300}
              style={{ objectFit: 'cover', width: '100%', height: '200px' }}
            />
            <p>{photo.title}</p>
            <small>{photo.category?.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
}