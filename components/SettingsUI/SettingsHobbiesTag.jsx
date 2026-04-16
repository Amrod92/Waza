import { useEffect } from 'react';
import { X } from 'lucide-react';

import { Badge } from '../UI/badge';
import { Button } from '../UI/button';
import { Input } from '../UI/input';

const HobbiesTagsInput = ({ hobbies, setHobbies, dataHobbies, formChange }) => {
  useEffect(() => {
    if (!dataHobbies?.length) return;

    setHobbies(current =>
      current.length > 0 ? current : [...new Set(dataHobbies)]
    );
  }, [dataHobbies, setHobbies]);

  function handleKeyDown(e) {
    if (e.key !== 'Control') return;
    const value = e.target.value.toLowerCase();
    if (!value.trim()) return;

    e.target.value = '';

    if (hobbies.length !== 10 && !hobbies.includes(value)) {
      formChange(true);
      setHobbies([...hobbies, value]);
    }
  }

  function removeTag(index) {
    setHobbies(hobbies.filter((el, i) => i !== index));
    formChange(true);
  }

  return (
    <div className='relative z-0 w-full'>
      <Input
        type='text'
        id='settings-hobbies'
        autoComplete='off'
        onKeyDown={handleKeyDown}
        className='h-12 w-full rounded-2xl border-zinc-300 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400'
        placeholder='Press Ctrl to add a hobby'
      />
      <p className='mt-3 text-sm leading-6 text-zinc-500'>
        Use the <kbd className='rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-semibold text-zinc-700'>Ctrl</kbd>{' '}
        command to separate tags. Limit: {hobbies.length}/10
      </p>
      <div className='relative z-0 mt-5 flex w-full flex-wrap gap-2.5'>
        {hobbies.map((hobby, index) => (
          <Badge
            key={index}
            variant='outline'
            className='gap-1 rounded-full border-zinc-200 bg-zinc-100/80 px-3.5 py-1.5 text-sm font-medium text-zinc-700'
          >
            {hobby}
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-5 w-5 rounded-full p-0 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
              aria-label='Remove'
              onClick={() => removeTag(index)}
            >
              <X className='h-3.5 w-3.5' />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default HobbiesTagsInput;
