import { X } from 'lucide-react';

import { Badge } from '../UI/badge';
import { Button } from '../UI/button';
import { Input } from '../UI/input';

const TechnologyStackInput = ({
  technology_stack,
  setTechStack,
  setTechStackValid,
}) => {
  function handleKeyDown(e) {
    if (e.key !== 'Control') return;
    const value = e.target.value.toLowerCase();
    if (!value.trim()) return;

    e.target.value = '';

    if (technology_stack.length !== 10 && !technology_stack.includes(value)) {
      setTechStack([...technology_stack, value]);
      setTechStackValid(true);
    }
  }

  function removeTag(index) {
    const nextStack = technology_stack.filter((el, i) => i !== index);
    setTechStack(nextStack);
    if (nextStack.length === 0) {
      setTechStackValid(false);
    }
  }

  return (
    <div className='relative z-0 w-full space-y-3'>
      <label htmlFor='technology-stack' className='text-sm font-semibold tracking-tight text-zinc-900'>
        Helpful backgrounds
      </label>
      <div className='space-y-2'>
        <Input
          type='text'
          name='technology-stack'
          id='technology-stack'
          autoComplete='off'
          onKeyDown={handleKeyDown}
          placeholder='Press Ctrl to add a background, domain, or specialty'
          className='h-12 rounded-2xl border-zinc-300 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400'
        />
        <p className='text-sm leading-6 text-zinc-500'>
          Use the <kbd className='rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-semibold text-zinc-700'>Ctrl</kbd>{' '}
          command to separate entries. Limit: {technology_stack.length}/10
        </p>
      </div>
      <div className='flex flex-wrap gap-2.5'>
        {technology_stack.map((stack, index) => (
          <Badge
            key={index}
            variant='outline'
            className='rounded-full border-zinc-200 bg-zinc-100/80 pl-3.5 pr-1.5 py-1.5 text-sm font-medium text-zinc-700'
          >
            {stack}
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='ml-1 h-5 w-5 rounded-full p-0 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
              aria-label='Remove'
              onClick={() => removeTag(index)}
            >
              <X className='h-3 w-3' />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TechnologyStackInput;
