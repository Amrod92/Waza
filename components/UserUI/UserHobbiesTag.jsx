import { Badge } from '../UI/badge';

const UserHobbiesTags = ({ dataHobbies }) => {
  return (
    <div className='relative z-0 mb-2 mt-4 flex w-full flex-wrap gap-2'>
      {dataHobbies.map(hobby => (
        <Badge
          key={hobby}
          className='border-[#d9d8ef] bg-[#f1f0ff] px-3 py-1 text-sm text-[#4b5387]'
        >
          {hobby}
        </Badge>
      ))}
    </div>
  );
};

export default UserHobbiesTags;
