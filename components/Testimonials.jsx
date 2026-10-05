'use client';
import { useState } from 'react';

const ITEMS = [
  { name: 'Jonny Thomas', role: 'Project Manager', text: "The cappuccino here is the best I've found in the city. Rich, smooth and never bitter. Bean Scene has become my daily ritual before every standup, and the team knows my order before I reach the counter." },
  { name: 'Priya Raman', role: 'Product Designer', text: "I came for the chai latte and stayed for the atmosphere. Perfectly spiced, beautifully presented, and the staff are always warm. It's the kind of place that makes a Monday morning feel like a weekend." },
  { name: 'Marcus Lee', role: 'Software Engineer', text: "As someone who takes espresso seriously, I'm impressed. The crema is gorgeous and the beans are clearly treated with care. Fair prices for coffee this good. I recommend it to everyone in the office." },
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = ITEMS[i];
  const initials = t.name.split(' ').map((w) => w[0]).join('');
  return (
    <div className="testi">
      <button className="round-btn" onClick={() => setI((i + ITEMS.length - 1) % ITEMS.length)} aria-label="Previous testimonial">←</button>
      <figure className="testi-card" key={i}>
        <span className="quote-mark">“</span>
        <blockquote>{t.text}</blockquote>
        <figcaption><span className="avatar">{initials}</span><span><strong>{t.name}</strong><br /><small>{t.role}</small></span></figcaption>
      </figure>
      <button className="round-btn" onClick={() => setI((i + 1) % ITEMS.length)} aria-label="Next testimonial">→</button>
    </div>
  );
}
