import { Badge } from '../UI/badge';

const UserSkillsTags = ({ dataSkills }) => {
  return (
    <div className='relative z-0 mb-2 mt-4 flex w-full flex-wrap gap-2'>
      {dataSkills.map(skill => (
        <Badge
          key={skill}
          className='border-red-200 bg-red-50 px-3 py-1 text-sm text-red-700'
        >
          {skill}
        </Badge>
      ))}
    </div>
  );
};

export default UserSkillsTags;
