'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PageHero from '@/components/PageHero';
import DataState from '@/components/DataState';
import { useFetch } from '@/lib/useFetch';
import { fmtDate } from '@/lib/format';

export default function BlogPost() {
  const { slug } = useParams();
  const { data, loading, error, reload } = useFetch(`/blogs/${slug}`);
  const b = data?.blog;
  return (
    <>
      <PageHero title={b?.title || 'News & Blogs'} subtitle={b ? `${fmtDate(b.createdAt)} · ${b.author}` : ''} />
      <section className="section"><div className="container prose">
        <p><Link href="/blog" className="link-btn">← All articles</Link></p>
        <DataState loading={loading} error={error} onRetry={reload} empty={!b}>
          {b && (<>
            {b.image && <img src={b.image} alt="" style={{ borderRadius: 14, marginBottom: '1.5rem' }} />}
            {b.content.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </>)}
        </DataState>
      </div></section>
    </>
  );
}
