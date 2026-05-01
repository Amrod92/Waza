import { X } from 'lucide-react';

import { Badge } from '../UI/badge';
import { Button } from '../UI/button';
import { Input } from '../UI/input';

const SkillsTagsInput = ({ skills, setSkills, setSkillsValid }) => {
  function handleKeyDown(e) {
    if (e.key !== 'Control') return;
    const value = e.target.value.toLowerCase();
    if (!value.trim()) return;

    e.target.value = '';

    if (skills.length !== 10 && !skills.includes(value)) {
      setSkills([...skills, value]);
      setSkillsValid(true);
    }
  }

  function removeTag(index) {
    const nextSkills = skills.filter((el, i) => i !== index);
    setSkills(nextSkills);
    if (nextSkills.length === 0) {
      setSkillsValid(false);
    }
  }

  return (
    <div className='relative z-0 w-full space-y-3'>
      <label htmlFor='skills-tags' className='text-sm font-semibold tracking-tight text-zinc-900'>
        Ideal collaborator strengths
      </label>
      <div className='space-y-2'>
        <Input
          type='text'
          name='skills-tags'
          id='skills-tags'
          autoComplete='off'
          onKeyDown={handleKeyDown}
          placeholder='Press Ctrl to add a strength or capability'
          className='h-12 rounded-2xl border-zinc-300 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400'
        />
        <p className='text-sm leading-6 text-zinc-500'>
          Use the <kbd className='rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-semibold text-zinc-700'>Ctrl</kbd>{' '}
          command to separate entries. Limit: {skills.length}/10
        </p>
      </div>
      <div className='flex flex-wrap gap-2.5'>
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant='outline'
            className='rounded-full border-zinc-200 bg-zinc-100/80 pl-3.5 pr-1.5 py-1.5 text-sm font-medium text-zinc-700'
          >
            {skill}
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

export default SkillsTagsInput;
