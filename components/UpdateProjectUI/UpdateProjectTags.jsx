import { useEffect } from 'react';

function TagsInput({ tags, setTags, setTagsValid, dataTags }) {
  useEffect(() => {
    if (!dataTags?.length) return;

    setTags(current => (current.length > 0 ? current : [...new Set(dataTags)]));
    setTagsValid(true);
  }, [dataTags, setTags, setTagsValid]);

  function handleKeyDown(e) {
    if (e.key !== 'Control') return;
    const value = e.target.value.toLowerCase();
    if (!value.trim()) return;

    e.target.value = '';

    // If statement to check if the tags array is less than 10 and check if the value is inside the array tags
    if (tags.length !== 10 && !tags.includes(value)) {
      setTags([...tags, value]);
      setTagsValid(true);
    } else {
      return;
    }
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
    checkArrayLength(tags);
  }

  function checkArrayLength(array) {
    if (!array.length > 0) {
      setTagsValid(false);
    }
  }

  return (
    <>
      <div className='relative z-0 mb-6 w-full group'>
        <input
          type='text'
          name='floating_tag'
          id='floating_tag'
          className='flex py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer'
          placeholder=' '
          autoComplete='off'
          onKeyDown={handleKeyDown}
        />
        <label
          htmlFor='floating_tag'
          className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-600 peer-focus:dark:text-red-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'
        >
          Project Tags
        </label>
        <p className='text-sm text-gray-500 mt-2'>
          Use the{' '}
          <kbd className='px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500'>
            Ctrl
          </kbd>{' '}
          command to separate tags. Limit: {tags.length}/10
        </p>
        <div className='mt-2 flex flex-wrap'>
          {tags.map((tag, index) => (
            <span
              id='badge-dismiss-red'
              key={index}
              className='inline-flex items-center mb-3 py-1 px-2 mr-2 text-sm font-medium text-red-800 bg-red-100 rounded dark:bg-red-200 dark:text-red-800'
            >
              #{tag}
              <button
                type='button'
                className='inline-flex items-center p-0.5 ml-2 text-sm text-red-400 bg-transparent rounded-sm hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-300 dark:hover:text-red-900'
                data-dismiss-target='#badge-dismiss-red'
                aria-label='Remove'
                onClick={() => removeTag(index)}
              >
                <svg
                  aria-hidden='true'
                  className='w-3.5 h-3.5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  ></path>
                </svg>
                <span className='sr-only'>Remove badge</span>
              </button>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default TagsInput;
