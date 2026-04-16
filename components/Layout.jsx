import Navbar from '../components/NavbarUI/Navbar';
import Footer from '../components/Footer';

export default function Layout({ children }) {
  return (
    <div className='relative min-h-screen overflow-x-hidden'>
      <div
        aria-hidden='true'
        className='pointer-events-none fixed inset-x-0 top-0 z-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(210,163,73,0.24),transparent_42%),radial-gradient(circle_at_20%_20%,rgba(70,81,58,0.12),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(180,77,36,0.12),transparent_26%)]'
      />
      <Navbar />
      <main className='relative z-10'>{children}</main>
      <Footer />
    </div>
  );
}
