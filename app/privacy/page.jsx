import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/UI/card';

export default function PrivacyPage() {
  return (
    <div className='mx-auto mb-24 mt-12 max-w-4xl px-4 sm:px-6'>
      <Card className='surface-card rounded-[32px] border-[var(--border)] bg-[var(--panel)]'>
        <CardHeader>
          <p className='text-sm font-semibold uppercase tracking-[0.28em] text-[#8b745d]'>
            Privacy
          </p>
          <CardTitle className='text-[#17120d]'>Privacy Policy</CardTitle>
          <CardDescription className='text-base leading-7 text-[#6e6256]'>
            We collect only what is needed to run the platform, authenticate
            users, and understand how the product is being used.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6 text-base leading-8 text-[#43372d]'>
          <p>
            When you use Waza, we store the information needed to support your
            account, founder profile, and idea listings. Authentication is
            handled through GitHub, and analytics are used to understand
            product usage at a service level.
          </p>
          <p>
            We treat personal information carefully, limit its use to platform
            operations, and do not claim broad rights beyond what the product
            needs to function.
          </p>
          <p>
            If you do not agree with how the platform handles account and usage
            data, you should not use the service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
