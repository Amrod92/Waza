import { Quote } from 'lucide-react';
import { Card, CardContent } from '../UI/card';

const quotes = [
  {
    quote:
      'The hardest part is rarely having an idea. It is finding people you would actually trust to build with.',
    role: 'Why Waza exists',
  },
  {
    quote:
      'A good matching product reduces ambiguity: what is being built, what kind of person is needed, and why this person is credible.',
    role: 'Design principle',
  },
  {
    quote:
      'The best project networks make serious collaborators easier to find before introductions feel transactional.',
    role: 'Product goal',
  },
];

function Testimonials() {
  return (
    <section className='container mx-auto px-4 py-32'>
      <div className='max-w-3xl mb-24 space-y-6 text-center mx-auto'>
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider'>
          Product Philosophy
        </div>
        <h2 className='text-5xl font-black tracking-tight leading-tight'>
          Built for people who want to <br /> stop starting alone.
        </h2>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        {quotes.map((item, index) => (
          <Card key={index} className='group relative flex flex-col justify-between p-10 rounded-[40px] border-2 bg-muted/20 hover:bg-card hover:border-primary/20 transition-all duration-500 shadow-none hover:shadow-2xl hover:shadow-primary/5'>
            <div className='absolute -top-4 -left-4 p-4 rounded-2xl bg-background border text-primary shadow-lg group-hover:scale-110 transition-transform'>
              <Quote className='h-6 w-6' />
            </div>
            
            <div className='space-y-8'>
              <p className='text-2xl font-bold italic leading-relaxed text-foreground tracking-tight'>
                “{item.quote}”
              </p>
              
              <div className='pt-8 border-t space-y-2'>
                <p className='text-sm font-black uppercase tracking-[0.2em] text-primary'>
                  {item.role}
                </p>
                <div className='h-1 w-8 bg-primary rounded-full group-hover:w-16 transition-all duration-500' />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
