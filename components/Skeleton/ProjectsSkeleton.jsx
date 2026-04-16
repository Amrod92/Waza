import Skeleton from 'react-loading-skeleton';

const ProjectSkeleton = () => {
  const CARDS = [];
  for (let i = 0; i < 5; i++) {
    CARDS.push(
      <div
        key={i}
        className='bg-white m-5 pt-3 pb-3 pl-5 mt-5 grid grid-cols-1 md:grid-cols-6 gap-4 p-2 rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 transition ease-in-out delay-300 hover:-translate-y-1 hover:scale-110 duration-700'
      >
        <div className='md:col-span-5'>
          <div className='flex flex-col md:flex-row'>
            <div className='md:mr-2'>
              <div className='mt-4 flex flex-row items-center space-x-3 animate-pulse duration-150'>
                <svg
                  className='h-16 w-16 text-gray-200 dark:text-gray-700'
                  aria-hidden='true'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
                    clipRule='evenodd'
                  />
                </svg>
                <div>
                  <div className='mb-2 h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700'></div>
                  <div className='mb-2 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700'></div>
                  <div className='h-2 w-48 rounded-full bg-gray-200 dark:bg-gray-700'></div>
                </div>
              </div>
            </div>

            <div className='relative inline-block'>
              <p>
                <Skeleton />
              </p>
              <p className='text-gray-500 text-sm'>
                <Skeleton />
              </p>
              <p className='text-sm'>
                <Skeleton />
                <span className='text-gray-500 text-sm'>
                  <Skeleton />
                </span>
              </p>
            </div>
          </div>

          <div className='mt-3'>
            <div>
              <span className='text-2xl font-medium cursor-pointer'>
                <Skeleton />
              </span>
              <p>
                <Skeleton />
              </p>
              <div className='flex flex-wrap mt-2'>
                {/* TAG */}
                <div className='w-20'>
                  <Skeleton />
                </div>
              </div>
            </div>
            <div className='mt-2'>
              {/* STATUS */}
              <div className='w-24'>
                <Skeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='container mx-auto mb-10 md:mb-24 min-h-screen'>
      <div className='mt-10'>
        <div className='grid grid-cols-1 md:grid-cols-2'>
          <div className='col-span-1 md:col-span-1'>
            <h1 className='text-3xl md:text-3xl ml-5'>Co-Founder Match</h1>
          </div>
          <div className='col-span-1 md:col-span-1 m-5'>
            <div className='grid justify-items-stretch'>
              {/* Search bar */}
              <div>
                <form>
                  <label
                    htmlFor='default-search'
                    className='mb-2 text-sm font-medium sr-only'
                  >
                    <Skeleton />
                  </label>
                  <div className='relative'>
                    <Skeleton className='block w-full p-4 pl-10 text-sm rounded-lg border' />
                    <Skeleton />
                  </div>
                </form>
                <p className='text-xs font-sans'>
                  <Skeleton />
                </p>
              </div>
              {/* Sorting */}
              <div className='justify-self-end'>
                <p className='inline-flex'>
                  <Skeleton />
                  <span className='ml-1.5'>
                    <a
                      aria-checked='false'
                      role='menuitemradio'
                      data-turbo-frame='_self'
                      data-value={'title'}
                      className='cursor-pointer'
                    ></a>
                    <Skeleton />
                  </span>{' '}
                  <span>
                    <a
                      aria-checked='false'
                      role='menuitemradio'
                      data-turbo-frame='_self'
                      data-value='createdAt'
                      className='cursor-pointer'
                    >
                      <Skeleton />
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* CARD */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
          <div className='col-span-3'>{CARDS}</div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSkeleton;
