'use client';

import { useState } from 'react';
import { GoogleOutlined, GiftOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { createClient } from '@/lib/supabase/client';
import {
  LoginWrapper,
  LoginCard,
  LoginIconWrapper,
  LoginTitle,
  LoginSubtitle,
  GoogleButton,
  LoginFooter,
} from './style';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        message.error(error.message);
      }
    } catch {
      message.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <LoginCard>
        <LoginIconWrapper>
          <GiftOutlined />
        </LoginIconWrapper>

        <LoginTitle>Welcome Back</LoginTitle>
        <LoginSubtitle>
          Sign in to manage your tariffs and gifts
        </LoginSubtitle>

        <GoogleButton>
          <Button
            type="default"
            icon={<GoogleOutlined />}
            size="large"
            onClick={handleGoogleLogin}
            loading={loading}
          >
            Continue with Google
          </Button>
        </GoogleButton>

        <LoginFooter>
          By continuing, you agree to our Terms of Service
        </LoginFooter>
      </LoginCard>
    </LoginWrapper>
  );
}
