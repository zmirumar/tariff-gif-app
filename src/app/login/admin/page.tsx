'use client';

import { useState } from 'react';
import { GoogleOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  AdminLoginWrapper,
  AdminLoginCard,
  AdminBadge,
  AdminTitle,
  AdminSubtitle,
  FormArea,
  OrDivider,
  GoogleButtonArea,
} from './style';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        message.error(error.message);
      } else {
        message.success('Signed in successfully!');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      message.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/admin`,
        },
      });
      if (error) {
        message.error(error.message);
      }
    } catch {
      message.error('An unexpected error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AdminLoginWrapper>
      <AdminLoginCard>
        <AdminBadge>
          <LockOutlined />
          Admin Access
        </AdminBadge>

        <AdminTitle>Admin Login</AdminTitle>
        <AdminSubtitle>
          Sign in to the administration panel
        </AdminSubtitle>

        <FormArea>
          <Form layout="vertical" onFinish={handleEmailLogin}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input type="email" placeholder="admin@example.com" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </FormArea>

        <OrDivider>or</OrDivider>

        <GoogleButtonArea>
          <Button
            type="default"
            icon={<GoogleOutlined />}
            size="large"
            onClick={handleGoogleLogin}
            loading={googleLoading}
          >
            Continue with Google
          </Button>
        </GoogleButtonArea>
      </AdminLoginCard>
    </AdminLoginWrapper>
  );
}