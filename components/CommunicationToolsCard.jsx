import { Mail, Globe, MessageSquare, Twitter, Slack, Twitch } from 'lucide-react';
import { SiDiscord, SiSlack, SiTwitch, SiX } from 'react-icons/si';

const CommunicationToolsCard = ({ commTools }) => {
  if (!commTools) return <p className='text-sm text-muted-foreground italic'>No contact information provided.</p>;

  const tools = [
    { key: 'website', label: 'Personal site', icon: Globe, color: 'text-foreground' },
    { key: 'discord', label: 'Preferred contact', icon: SiDiscord, color: 'text-[#5865F2]' },
    { key: 'slack', label: 'Team space', icon: SiSlack, color: 'text-[#4A154B]' },
    { key: 'twitch', label: 'Intro call or demo', icon: SiTwitch, color: 'text-[#9146FF]' },
    { key: 'twitter', label: 'X / social profile', icon: SiX, color: 'text-foreground' },
  ];

  const activeTools = tools.filter(tool => commTools[tool.key]);

  if (activeTools.length === 0) return <p className='text-sm text-muted-foreground italic'>No contact information provided.</p>;

  return (
    <div className='grid gap-3'>
      {activeTools.map((tool) => {
        const Icon = tool.icon;
        return (
          <a
            key={tool.key}
            href={commTools[tool.key]}
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

export default CommunicationToolsCard;
