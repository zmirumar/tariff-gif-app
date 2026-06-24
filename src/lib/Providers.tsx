'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StyledComponentsRegistry from './StyledComponentsRegistry';
import AntdRegistry from './AntdRegistry';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <StyledComponentsRegistry>
        <ThemeProvider theme={lightTheme}>
          <AntdRegistry>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#3B82F6',
                  borderRadius: 8,
                  fontFamily: 'var(--font-geist-sans)',
                },
              }}
            >
              {children}
            </ConfigProvider>
          </AntdRegistry>
        </ThemeProvider>
      </StyledComponentsRegistry>
    </QueryClientProvider>
  );
}
