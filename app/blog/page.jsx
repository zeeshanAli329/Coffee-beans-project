'use client';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import DataState from '@/components/DataState';
import CupArt from '@/components/CupArt';
import { useFetch } from '@/lib/useFetch';
import { fmtDate } from '@/lib/format';

export default function Blog() {
  const { data, loading, error, reload } = useFetch('/blogs');
  const blogs = data?.blogs || [];
  return (
    <>
      <PageHero title="News & Blogs" subtitle="Stories, tips and updates from the Bean Scene team." />
      <section className="section"><div className="container">
        <DataState loading={loading} error={error} onRetry={reload} empty={!blogs.length} emptyText="No articles published yet. Check back soon!">
          <div className="cards">
            {blogs.map((b) => (
              <Link href={`/blog/${b.slug}`} className="bcard" key={b._id}>
                <div className="bcard-img">{b.image ? <img src={b.image} alt="" loading="lazy" /> : <CupArt />}</div>
                <div className="bcard-body">
                  <span className="muted" style={{ fontSize: '.8rem' }}>{fmtDate(b.createdAt)} · {b.author}</span>
                  <h3>{b.title}</h3><p className="muted">{b.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </DataState>
      </div></section>
    </>
  );
}
