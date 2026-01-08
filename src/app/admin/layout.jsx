'use client';

import ReduxProvider from '@components/providers/ReduxProvider';
import { Toaster } from 'react-hot-toast';

export default function AdminRootLayout({ children }) {
  return (
    <ReduxProvider>
      {children}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </ReduxProvider>
  );
}
