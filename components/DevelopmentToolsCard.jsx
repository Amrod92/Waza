import { SiFigma, SiGithub, SiTrello, SiJira } from 'react-icons/si';

const DevelopmentToolsCard = ({ devTools }) => {
  if (!devTools) return <p className='text-sm text-muted-foreground italic'>No project tools provided.</p>;

  const tools = [
    { key: 'figma', label: 'Prototype', icon: SiFigma, color: 'text-[#F24E1E]' },
    { key: 'github', label: 'Proof of work', icon: SiGithub, color: 'text-foreground' },
    { key: 'trello', label: 'Traction notes', icon: SiTrello, color: 'text-[#0079BF]' },
    { key: 'jira', label: 'Research or plan', icon: SiJira, color: 'text-[#0052CC]' },
  ];

  const activeTools = tools.filter(tool => devTools[tool.key]);

  if (activeTools.length === 0) return <p className='text-sm text-muted-foreground italic'>No project tools provided.</p>;

  return (
    <div className='grid gap-3'>
      {activeTools.map((tool) => {
        const Icon = tool.icon;
        return (
          <a
            key={tool.key}
            href={devTools[tool.key]}
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-3 p-3 rounded-xl border bg-background hover:bg-accent hover:text-accent-foreground transition-all group'
          >
            <div className={`p-2 rounded-lg bg-muted group-hover:bg-background transition-colors ${tool.color}`}>
              <Icon className='h-4 w-4' />
            </div>
            <span className='text-sm font-medium'>{tool.label}</span>
          </a>
        );
      })}
    </div>
  );
};

export default DevelopmentToolsCard;
